import jwtDecode from "jwt-decode";
import axios from "axios";
import { SET_AUTHENTICATED } from "../redux/types";
import { logoutUser, getUserData } from "../redux/actions/user.actions";
import { isSmart } from "./utility";

export function handleResponse(response) {
  console.log("########### response ###########");
  console.log(response);
  console.log("############## end #############");
  return Promise.resolve(response.data);
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
  axios.interceptors.request.use(config => {
    const { url } = config;
    return {
      ...config,
      url: origin + url
    };
  });
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
//   if (resp.status === 403) {
//     store.dispatch(logoutUser());
//   } else {
//     return resp;
//   }
// };
