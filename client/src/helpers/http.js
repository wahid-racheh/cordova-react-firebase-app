import jwtDecode from "jwt-decode";
import axios from "axios";
import { isSmart } from "../utils/utility";
import { SET_AUTHENTICATED } from "../redux/types";
import { logoutUser, getUserData, stopSync } from "../redux/actions";

export function handleResponse(response) {
  console.log("########### response ###########");
  console.log(response);
  console.log("############## end #############");
  const { data } = response;
  return Promise.resolve(data);
}

export function handleFailure(failure) {
  console.log("########### failure ###########");
  if (failure) console.log(failure.response);
  else console.log(failure);
  console.log("############# end #############");
  try {
    const {
      response: { data, status, statusText }
    } = failure;
    if (status === 403) {
      window.location.href = "/login";
    }
    if (typeof data === "string" && (status === 404 || status === 504)) {
      return Promise.reject({ general: status + " : " + statusText });
    }
    return Promise.reject(data || failure);
  } catch (ex) {
    console.log(ex);
    return Promise.reject({ general: "Something went wrong!!" });
  }
}

export const setAuthorization = store => {
  const token = localStorage.FBIdToken;
  if (token) {
    const decodedToken = jwtDecode(token);
    if (decodedToken.exp * 1000 < Date.now()) {
      store.dispatch(logoutUser());
      window.location.href = "/login";
    } else {
      store.dispatch({ type: SET_AUTHENTICATED });
      axios.defaults.headers.common["Authorization"] = token;
      store.dispatch(getUserData());
    }
  }
};

export const setServerOrigin = origin => {
  if (origin) {
    axios.interceptors.request.use(config => {
      const { url } = config;
      return {
        ...config,
        url: origin + url
      };
    });
  }
};

export const setServerRuntime = (resolve, reject) => {
  if (isSmart()) {
    setTimeout(() => {
      window.CustomConfigParameters.get(
        params => {
          setServerOrigin(params.runtime);
          resolve();
        },
        err => {
          reject();
          console.log(err);
        },
        ["runtime"]
      );
    });
  } else {
    resolve();
  }
};

// axios.defaults.transformResponse = data => {
//   let resp;
//   try {
//     resp = JSON.parse(data);
//   } catch (error) {
//     throw Error(
//       `[requestClient] Error parsing response JSON data - ${JSON.stringify(
//         error
//       )}`
//     );
//   }
//   return resp;
// };
