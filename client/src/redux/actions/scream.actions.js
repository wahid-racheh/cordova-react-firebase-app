import {
  SET_SCREAMS,
  LOADING_SCREAMS,
  LOADING_UI,
  LIKE_SCREAM,
  UNLIKE_SCREAM,
  DELETE_SCREAM,
  POST_SCREAM,
  SET_ERRORS,
  CLEAR_ERRORS
} from "../types";

export const getScreams = () => (dispatch, getState, { api }) => {
  dispatch({ type: LOADING_SCREAMS });
  // const {
  //   UI: { isMounted }
  // } = getState();
  api.ScreamApi.getScreams()
    .then(data => {
      // if (isMounted) {
      dispatch({
        type: SET_SCREAMS,
        payload: data
      });
      // }
    })
    .catch(() => {
      dispatch({
        type: SET_SCREAMS,
        payload: []
      });
    });
};

export const likeScream = screamId => (dispatch, getState, { api }) => {
  api.ScreamApi.likeScream(screamId).then(data => {
    dispatch({
      type: LIKE_SCREAM,
      payload: data
    });
  });
};

export const unlikeScream = screamId => (dispatch, getState, { api }) => {
  api.ScreamApi.unlikeScream(screamId).then(data => {
    dispatch({
      type: UNLIKE_SCREAM,
      payload: data
    });
  });
};

export const deleteScream = screamId => (dispatch, getState, { api }) => {
  api.ScreamApi.deleteScream(screamId).then(data => {
    dispatch({
      type: DELETE_SCREAM,
      payload: screamId
    });
  });
};

export const postScream = newScream => (dispatch, getState, { api }) => {
  dispatch({
    type: LOADING_UI
  });
  api.ScreamApi.postScream(newScream)
    .then(data => {
      dispatch({
        type: POST_SCREAM,
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
