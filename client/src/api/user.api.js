import axios from "axios";
import { handleResponse, handleFailure } from "../utils/helpers";

const UserApi = {
  loginUser(userData) {
    return axios
      .post("/auth/login", userData)
      .then(handleResponse)
      .catch(handleFailure);
  },
  signupUser(newUserData) {
    return axios.post("/auth/signup", newUserData).then(handleResponse);
  },
  getUserData() {
    return axios
      .get("/user")
      .then(handleResponse)
      .catch(handleFailure);
  },
  uploadImage(formData) {
    return axios
      .post("/upload/user/image", formData, {
        headers: {
          enctype: "multipart/form-data"
        }
      })
      .then(handleResponse)
      .catch(handleFailure);
  },
  editUserDetails(userDetails) {
    return axios
      .post("/user", userDetails)
      .then(handleResponse)
      .catch(handleFailure);
  }
};

export default UserApi;
