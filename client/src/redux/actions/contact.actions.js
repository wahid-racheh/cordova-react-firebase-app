import { from, Observable } from "rxjs";
import { concatMap } from "rxjs/operators";
import { compactObject } from "../../utils/utility";

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

export const getNativeContacts = () => (dispatch, getState, { api, mocks }) => {
  api.ContactApi.getNativeContacts()
    .then(data => {
      console.log(JSON.stringify(data));
      dispatch({
        type: MERGE_CONTACTS,
        payload: data
      });
    })
    .catch(() => {
      dispatch({
        type: MERGE_CONTACTS,
        payload: mocks.contacts.nativeContactList
      });
    });
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
    .catch(error => {
      dispatch({
        type: SET_CONTACTS,
        payload: []
      });
      dispatch(getNativeContacts());
    });
};

const getSyncStartPayload = element => {
  return {
    [START_SYNC_ITEM]: {
      type: START_SYNC_ITEM,
      payload: {
        ...element
      }
    }
  };
};

const getSyncSuccessPayload = element => {
  return {
    [END_SYNC_ITEM]: {
      type: END_SYNC_ITEM,
      payload: {
        ...element,
        isSuccessfull: true
      }
    }
  };
};

const getSyncFailerPayload = (element, error) => {
  console.log("error : ", error);
  return {
    [END_SYNC_ITEM]: {
      type: END_SYNC_ITEM,
      payload: {
        ...element,
        isSuccessfull: false
      }
    },
    [SET_ERRORS]: {
      type: SET_ERRORS,
      payload: error
    }
  };
};

const doSyncContact = (contact, api) => {
  const element = compactObject(contact);
  return new Observable(observer => {
    observer.next(getSyncStartPayload(element));
    if (element.shouldBeSynced) {
      api.ContactApi.syncContact(element)
        .then(() => {
          observer.next(getSyncSuccessPayload(element));
          observer.complete();
        })
        .catch(error => {
          observer.next(getSyncFailerPayload(element, error));
          observer.complete();
        });
    } else if (element.shouldBeAddedToDevice) {
      api.ContactApi.saveContactToDevice(element)
        .then(() => {
          observer.next(getSyncSuccessPayload(element));
          observer.complete();
        })
        .catch(error => {
          observer.next(getSyncFailerPayload(element, error));
          observer.complete();
        });
    } else {
      observer.next(
        getSyncFailerPayload(element, {
          error: "Something went wrong while syncing the contact"
        })
      );
      observer.complete();
    }
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
