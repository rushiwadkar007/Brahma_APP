import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
export const addUser =  (user) => {
  console.log("uesr details ", user);
  return {
    type: "ADD_USER",
    payload: { email: user[0], password: user[1] },
  };
};
