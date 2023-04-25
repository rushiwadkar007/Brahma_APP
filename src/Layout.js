import { useContext } from "react";
import { Link, Outlet } from "react-router-dom";
import { luser } from "./App";
import { loguser } from "./components/Login";
export const Layout = ({ web3, contract, account }) => {
  const user = useContext(luser);
  console.log(user);
  return (
    <>
      <section>
        <div className="container">
          <nav className="navbar navbar-expand-lg  navbar-dark bg-dark">
            <a className="navbar-brand nm" href="#">
              Brahma Blockchain
            </a>
            <button
              className="navbar-toggler"
              type="button"
              data-toggle="collapse"
              data-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>

            <div
              className="collapse navbar-collapse justify-content-center"
              id="navbarSupportedContent"
            >
              <ul className="navbar-nav mr-auto">
                <li className="nav-item active">
                  <Link to="/" className="navbar-brand">
                    {user || "Login"}
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/Sign-up" className="navbar-brand">
                    Signup
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/Forgot-pass" className="navbar-brand">
                    Forgot Password?
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/wallet" className="navbar-brand">
                    Visit Wallet
                  </Link>
                </li>
              </ul>
            </div>
          </nav>
          <div className="row">
            <div className="col-lg-12 col-md-12">
              <Outlet />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
