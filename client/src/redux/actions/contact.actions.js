import { from, Observable } from "rxjs";
import { concatMap } from "rxjs/operators";

import {
  SET_CONTACTS,
  LOADING_CONTACTS,
  SET_ERRORS,
  MERGE_CONTACTS,
  START_SYNC_ITEM,
  END_SYNC_ITEM,
  START_SYNC,
  STOP_SYNC
} from "../types";

const syncSubscriptions = [];

export const getNativeContacts = () => (dispatch, getState, { mocks }) => {
  function parseNativeContacts(array) {
    return array
      ? array.map(c => {
          const item = { ...c, phoneNumberId: c.id, contactId: c.id };
          delete item.id;
          return item;
        })
      : [];
  }
  if (window.cordova) {
    navigator.contactsPhoneNumbers.list(
      data => {
        dispatch({
          type: MERGE_CONTACTS,
          payload: parseNativeContacts(data)
        });
      },
      error => {
        console.error(error);
        dispatch({
          type: MERGE_CONTACTS,
          payload: []
        });
      }
    );
  } else {
    dispatch({
      type: MERGE_CONTACTS,
      payload: parseNativeContacts(mocks.contacts.nativeContactList)
    });
  }
};

export const getContacts = () => (dispatch, getState, { api }) => {
  dispatch({ type: LOADING_CONTACTS });

  api.ContactApi.getContacts()
    .then(data => {
      dispatch({
        type: SET_CONTACTS,
        payload: data
      });
      dispatch(getNativeContacts());
    })
    .catch(() => {
      dispatch({
        type: SET_CONTACTS,
        payload: []
      });
      dispatch(getNativeContacts());
    });
};

const doSyncContact = (contact, api) => {
  const {
    displayName,
    firstName,
    phoneNumberId,
    lastName,
    thumbnail,
    phoneNumbers
  } = contact;

  return new Observable(observer => {
    observer.next({
      [START_SYNC_ITEM]: {
        type: START_SYNC_ITEM,
        payload: {
          phoneNumberId: contact.phoneNumberId
        }
      }
    });
    api.ContactApi.syncContact({
      displayName,
      firstName,
      phoneNumberId,
      lastName,
      thumbnail,
      phoneNumbers
    })
      .then(data => {
        observer.next({
          [END_SYNC_ITEM]: {
            type: END_SYNC_ITEM,
            payload: {
              phoneNumberId: contact.phoneNumberId,
              isSuccessfull: true
            }
          }
        });
        observer.complete();
      })
      .catch(error => {
        console.log("error : ", error);
        observer.next({
          [END_SYNC_ITEM]: {
            type: END_SYNC_ITEM,
            payload: {
              phoneNumberId: contact.phoneNumberId,
              isSuccessfull: false
            }
          },
          [SET_ERRORS]: {
            type: SET_ERRORS,
            payload: error
          }
        });
        observer.complete();
      });
  });
};

export const startSync = contacts => dispatch => {
  dispatch({
    type: START_SYNC,
    payload: contacts
  });
};

export const stopSync = () => dispatch => {
  syncSubscriptions.forEach(s => s.unsubscribe());
  dispatch({ type: STOP_SYNC });
};

export const syncContact = contact => (dispatch, getState, { api }) => {
  dispatch(startSync([contact]));
  const subscription = doSyncContact(contact, api).subscribe({
    next(actions) {
      if (actions[START_SYNC_ITEM]) dispatch(actions[START_SYNC_ITEM]);
      if (actions[END_SYNC_ITEM]) dispatch(actions[END_SYNC_ITEM]);
      if (actions[SET_ERRORS]) dispatch(actions[SET_ERRORS]);
    },
    error() {},
    complete() {}
  });
  syncSubscriptions.push(subscription);
  return subscription;
};

export const syncContacts = contacts => (dispatch, getState, { api }) => {
  dispatch(startSync(contacts));
  return from(contacts)
    .pipe(concatMap(contact => doSyncContact(contact, api)))
    .subscribe({
      next(actions) {
        if (actions[START_SYNC_ITEM]) dispatch(actions[START_SYNC_ITEM]);
        if (actions[END_SYNC_ITEM]) dispatch(actions[END_SYNC_ITEM]);
        if (actions[SET_ERRORS]) dispatch(actions[SET_ERRORS]);
      },
      error() {},
      complete() {}
    });
};
