import {
  SET_CONTACTS,
  LOADING_CONTACTS,
  LOADING_UI,
  POST_CONTACT,
  CLEAR_ERRORS,
  SET_ERRORS
} from "../types";

export const getContacts = () => dispatch => {
  dispatch({ type: LOADING_CONTACTS });
  if (window.cordova) {
    navigator.contactsPhoneNumbers.list(
      contacts => {
        dispatch({
          type: SET_CONTACTS,
          payload: contacts
        });
      },
      error => {
        console.error(error);
        dispatch({
          type: SET_CONTACTS,
          payload: []
        });
      }
    );
  } else {
    dispatch({
      type: SET_CONTACTS,
      payload: []
    });
  }
};

export const postContact = newContact => (dispatch, getState, { api }) => {
  dispatch({
    type: LOADING_UI
  });
  api.ContactApi.postContact(newContact)
    .then(data => {
      dispatch({
        type: POST_CONTACT,
        payload: data
      });
      dispatch({
        type: CLEAR_ERRORS
      });
    })
    .catch(error => {
      dispatch({
        type: SET_ERRORS,
        payload: error
      });
    });
};
