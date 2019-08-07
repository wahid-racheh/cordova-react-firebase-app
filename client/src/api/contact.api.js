import axios from "axios";
import { handleResponse, handleFailure } from "../utils/helpers";

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
  }
};

export default ContactApi;
