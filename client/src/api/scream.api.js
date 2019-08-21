import axios from "axios";
import { handleResponse, handleFailure } from "../helpers";

const ScreamApi = {
  getScreams() {
    return axios
      .get(`${process.env.API_PREFIX}/scream`)
      .then(handleResponse)
      .catch(handleFailure);
  },
  getScream(screamId) {
    return axios
      .get(`${process.env.API_PREFIX}/scream/${screamId}`)
      .then(handleResponse)
      .catch(handleFailure);
  },
  postScream(newScream) {
    return axios
      .post(`${process.env.API_PREFIX}/scream`, newScream)
      .then(handleResponse)
      .catch(handleFailure);
  },
  likeScream(screamId) {
    return axios
      .get(`${process.env.API_PREFIX}/scream/${screamId}/like`)
      .then(handleResponse)
      .catch(handleFailure);
  },
  unlikeScream(screamId) {
    return axios
      .get(`${process.env.API_PREFIX}/scream/${screamId}/unlike`)
      .then(handleResponse)
      .catch(handleFailure);
  },
  deleteScream(screamId) {
    return axios
      .delete(`${process.env.API_PREFIX}/scream/${screamId}`)
      .then(handleResponse)
      .catch(handleFailure);
  }
};

export default ScreamApi;
