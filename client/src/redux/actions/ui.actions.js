import { SET_MOUNTED, SET_UNMOUNTED, SET_ADD_ACTION } from "../types";

export const mount = () => dispatch => {
  dispatch({
    type: SET_MOUNTED
  });
};

export const unmount = () => dispatch => {
  dispatch({
    type: SET_UNMOUNTED
  });
};

export const setAddAction = action => dispatch => {
  dispatch({
    type: SET_ADD_ACTION,
    payload: action
  });
};
