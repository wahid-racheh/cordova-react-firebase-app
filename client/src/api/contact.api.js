import axios from "axios";
import {
  handleResponse,
  handleFailure,
  cloneNewContactInstance,
  getNativeContactList,
  getNativeContactById
} from "../helpers";
import { isSmart } from "../utils/utility";

const ContactApi = {
  getContacts() {
    return axios
      .get(`${process.env.API_PREFIX}/contact`)
      .then(handleResponse)
      .catch(handleFailure);
  },
  syncContact(contact) {
    return axios
      .post(`${process.env.API_PREFIX}/contact`, contact)
      .then(handleResponse)
      .catch(handleFailure);
  },
  getNativeContacts() {
    return new Promise((resolve, reject) => {
      if (isSmart()) {
        getNativeContactList()
          .then(data => {
            resolve(data);
          })
          .catch(error => {
            reject(error);
          });
      } else {
        reject({
          error: "Something went wrong while getting native contact list"
        });
      }
    });
  },
  saveContactToDevice(contact) {
    const newContact = isSmart()
      ? cloneNewContactInstance(contact)
      : { ...contact };
    return new Promise((resolve, reject) => {
      getNativeContactById(contact.id)
        .then(data => {
          const temp = [...data];
          const contactToModify = [...temp.clone(), ...newContact];
          temp.remove(
            () => {
              contactToModify.save(
                savedContact => {
                  resolve(savedContact);
                },
                error => {
                  reject(error);
                }
              );
            },
            error => {
              reject(error);
            }
          );
        })
        .catch(() => {
          if (isSmart()) {
            const contact = window.navigator.contacts.create(newContact);
            contact.save(
              savedContact => {
                resolve(savedContact);
              },
              error => {
                reject(error);
              }
            );
          } else {
            reject({
              error: "Something went wrong while saving contact"
            });
          }
        });
    });
  }
};

export default ContactApi;
