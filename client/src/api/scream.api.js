import axios from "axios";
import { handleResponse, handleFailure } from "../utils/helpers";

const ScreamApi = {
  getScreams() {
    return axios
      .get("/scream")
      .then(handleResponse)
      .catch(handleFailure);
  },
  postScream(newScream) {
    return axios
      .post("/scream", newScream)
      .then(handleResponse)
      .catch(handleFailure);
  },
  likeScream(screamId) {
    return axios
      .get(`/scream/${screamId}/like`)
      .then(handleResponse)
      .catch(handleFailure);
  },
  unlikeScream(screamId) {
    return axios
      .get(`/scream/${screamId}/unlike`)
      .then(handleResponse)
      .catch(handleFailure);
  },
  deleteScream(screamId) {
    return axios
      .delete(`/scream/${screamId}`)
      .then(handleResponse)
      .catch(handleFailure);
  }
};

export default ScreamApi;
