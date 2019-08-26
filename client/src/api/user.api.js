import axios from "axios";
import { handleResponse, handleFailure } from "../helpers";

const UserApi = {
  loginUser(userData) {
    return axios
      .post(`${process.env.API_PREFIX}/auth/login`, userData)
      .then(handleResponse)
      .catch(handleFailure);
  },
  signupUser(newUserData) {
    return axios
      .post(`${process.env.API_PREFIX}/auth/signup`, newUserData)
      .then(handleResponse);
  },
  getUserData() {
    return axios
      .get(`${process.env.API_PREFIX}/user`)
      .then(handleResponse)
      .catch(handleFailure);
  },
  getUserDataByUserHandle(userHandle) {
    return axios
      .get(`${process.env.API_PREFIX}/user/${userHandle}`)
      .then(handleResponse)
      .catch(handleFailure);
  },
  uploadImage(formData) {
    return axios
      .post(`${process.env.API_PREFIX}/upload/user/image`, formData, {
        headers: {
          enctype: "multipart/form-data"
        }
      })
      .then(handleResponse)
      .catch(handleFailure);
  },
  editUserDetails(userDetails) {
    return axios
      .post(`${process.env.API_PREFIX}/user`, userDetails)
      .then(handleResponse)
      .catch(handleFailure);
  },
  markNotificationsRead(notificationsIds) {
    return axios
      .post(`${process.env.API_PREFIX}/user/notifications`, notificationsIds)
      .then(handleResponse)
      .catch(handleFailure);
  }
};

export default UserApi;
