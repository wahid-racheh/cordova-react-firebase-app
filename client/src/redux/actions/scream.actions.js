import {
  SET_SCREAMS,
  SET_SCREAM,
  LOADING_SCREAMS,
  LOADING_UI,
  STOP_LOADING_UI,
  LIKE_SCREAM,
  UNLIKE_SCREAM,
  DELETE_SCREAM,
  POST_SCREAM,
  SET_ERRORS,
  CLEAR_ERRORS,
  POST_COMMENT
} from "../types";

export const getScreams = () => (dispatch, getState, { api }) => {
  dispatch({ type: LOADING_SCREAMS });
  api.ScreamApi.getScreams()
    .then(data => {
      dispatch({
        type: SET_SCREAMS,
        payload: data
      });
    })
    .catch(() => {
      dispatch({
        type: SET_SCREAMS,
        payload: []
      });
    });
};

export const getScream = screamId => (dispatch, getState, { api }) => {
  dispatch({ type: LOADING_UI });
  api.ScreamApi.getScream(screamId)
    .then(data => {
      dispatch({
        type: SET_SCREAM,
        payload: data
      });
      dispatch({ type: STOP_LOADING_UI });
    })
    .catch(error => {
      dispatch({
        type: SET_ERRORS,
        payload: error
      });
      dispatch({ type: STOP_LOADING_UI });
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
      dispatch(clearErrors());
    })
    .catch(error => {
      dispatch({
        type: SET_ERRORS,
        payload: error
      });
    });
};

export const postComment = (screamId, commentData) => (
  dispatch,
  getState,
  { api }
) => {
  api.ScreamApi.postComment(screamId, commentData)
    .then(data => {
      dispatch({
        type: POST_COMMENT,
        payload: data
      });
      dispatch(clearErrors());
    })
    .catch(error => {
      dispatch({
        type: SET_ERRORS,
        payload: error
      });
    });
};

export const clearErrors = () => dispatch => {
  dispatch({ type: CLEAR_ERRORS });
};
