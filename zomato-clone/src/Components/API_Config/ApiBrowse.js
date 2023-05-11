
import jwtDecode from "jwt-decode";

export const BASE_URL ="http://localhost:3007/api/";



export let checkLogin = (response) => {
    // get token
    let token = localStorage.getItem("auth_token");
  
    if (token) {
      // decode token
      // return token
      // return null
      try {
        return jwtDecode(token);
      } catch (error) {
        return null;
      }
    } else {
      return null;
    }
  };