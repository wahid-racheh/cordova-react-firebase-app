import axios from "axios";
import { handleResponse, handleFailure } from "../utils/helpers";

const ContactApi = {
  postContact(newContact) {
    return axios
      .post("/contact", newContact)
      .then(handleResponse)
      .catch(handleFailure);
  }
};

export default ContactApi;
