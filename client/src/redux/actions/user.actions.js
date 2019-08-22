import {
  SET_USER,
  SET_ERRORS,
  CLEAR_ERRORS,
  LOADING_UI,
  SET_UNAUTHENTICATED,
  LOADING_USER,
  END_LOADING_USER,
  SET_SCREAMS,
  SET_SELECTED_USER
} from "../types";
import axios from "axios";

export const loginUser = (userData, history) => {
  return (dispatch, getState, { api /* whatever */ }) => {
    dispatch({ type: LOADING_UI });
    api.UserApi.loginUser(userData)
      .then(data => {
        setAuthorizationHeader(data.token);
        dispatch(getUserData());
        dispatch({ type: CLEAR_ERRORS });
        history.push("/");
      })
      .catch(error => {
        dispatch({
          type: SET_ERRORS,
          payload: error
        });
      });
  };
};

export const signupUser = (newUserData, history) => (
  dispatch,
  getState,
  { api }
) => {
  dispatch({ type: LOADING_UI });

  api.UserApi.signupUser(newUserData)
    .then(data => {
      setAuthorizationHeader(data.token);
      dispatch(getUserData());
      dispatch({
        type: CLEAR_ERRORS
      });
      history.push("/");
    })
    .catch(error => {
      dispatch({
        type: SET_ERRORS,
        payload: error
      });
    });
};

export const logoutUser = () => dispatch => {
  localStorage.removeItem("FBIdToken");
  delete axios.defaults.headers.common["Authorization"];
  dispatch({
    type: SET_UNAUTHENTICATED
  });
};

export const getUserData = () => (dispatch, getState, { api }) => {
  dispatch({ type: LOADING_USER });

  api.UserApi.getUserData()
    .then(data => {
      dispatch({
        type: SET_USER,
        payload: data
      });
    })
    .catch(error => {
      dispatch({
        type: SET_ERRORS,
        payload: error
      });
    });
};

export const getUserDataByUserHandle = userHandle => (
  dispatch,
  getState,
  { api }
) => {
  dispatch({ type: LOADING_UI });

  api.UserApi.getUserDataByUserHandle(userHandle)
    .then(data => {
      dispatch({
        type: SET_SCREAMS,
        payload: data.screams
      });
      dispatch({
        type: SET_SELECTED_USER,
        payload: data.user
      });
    })
    .catch(() => {
      dispatch({
        type: SET_SCREAMS,
        payload: []
      });
      dispatch({
        type: SET_SELECTED_USER,
        payload: {}
      });
    });
};

export const uploadImage = formData => (dispatch, getState, { api }) => {
  dispatch({ type: LOADING_USER });
  api.UserApi.uploadImage(formData)
    .then(() => {
      dispatch(getUserData());
    })
    .catch(error => {
      dispatch({ type: END_LOADING_USER });
      dispatch({
        type: SET_ERRORS,
        payload: error
      });
    });
};

export const editUserDetails = useDetails => (dispatch, getState, { api }) => {
  dispatch({ type: LOADING_USER });
  api.UserApi.editUserDetails(useDetails)
    .then(() => {
      dispatch(getUserData());
    })
    .catch(error => {
      dispatch({ type: END_LOADING_USER });
      dispatch({
        type: SET_ERRORS,
        payload: error
      });
    });
};
const setAuthorizationHeader = token => {
  const FBIdToken = `Bearer ${token}`;
  localStorage.setItem("FBIdToken", FBIdToken);
  axios.defaults.headers.common["Authorization"] = FBIdToken;
};
