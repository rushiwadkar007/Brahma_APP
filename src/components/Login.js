import ReCAPTCHA from "react-google-recaptcha";
import React, { createContext, useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { render } from "@testing-library/react";
import { Dashboard } from "./Dashboard";
import { useSelector } from "react-redux";
import { addUser } from "../redux/actions";
import { useDispatch } from "react-redux";
import { ThemeConsumer } from "react-bootstrap/esm/ThemeProvider";
export const loguser = createContext();

export function Login(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const userData = useSelector((user) => user);
  console.log("userData", userData.login)
  const [role, setrole] = useState("Reviewer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setuser] = useState([]);

  // const updateuser = (event) => {
  //   event.preventDefault();
  //   console.log(event)
  //   setuser(user => [...user, ...event.target.value.split(",")]);
  //   console.log(user)
  // };
  const [type, settype] = useState("type");
  let { flag } = props;
  const login =  () => {
    if (user.length > 0) {
      dispatch(addUser(user))
       toast.success("Redirecting to Wallet...", {
        position: toast.POSITION.TOP_RIGHT,
      });
      navigate("/wallet")
      console.log("user1 ", user);
      setTimeout(async () => {
        return <Dashboard cuser={{ name: "user", type: "Reviewer" }} />;
      }, 4000);
    }
    
  };

  const handleOnSubmit = async (event) => {
    event.preventDefault();
    console.log(email, password);
    let values = [email, password];
    values.map((item) => {
      console.log("item ", item);
      setuser((values) => [...values, item]);
    });
    console.log("user ", user);
  };

  useEffect(() => {
    login()
    console.log("user use effect ", user);
  }, [user]);

  const captchaval = useRef(null);
  return (
    <>
      <div>
        <ToastContainer />
      </div>
      <form
        className="form-group"
        onSubmit={(e) => handleOnSubmit(e)}
        encType="application/x-www-form-urlencoded"
      >
        <input
          className="form-control text-primary"
          required
          placeholder="Email Address"
          name="email"
          type="email"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <input
          className="form-control text-primary"
          required
          placeholder="Password"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          name="pass"
          type="password"
        />

        {/* <ReCAPTCHA
          sitekey={process.env.REACT_APP_SITE_KEY}
          size="normal"
          theme="dark"
          ref={captchaval}
        /> */}

        <br />
        <input
          className="form-check-input"
          name="rem"
          id="flexCheckDefault"
          type="checkbox"
        />
        <label className="form-check-label" htmlFor="flexCheckDefault">
          Remember Me
        </label>
        <br />
        <button onClick={login} disabled={!flag} className="btn btn-success">
          LOGIN
        </button>
      </form>
    </>
  );
}
