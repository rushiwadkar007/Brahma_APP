import React, { useRef, useState, useEffect } from "react";
import Select from "react-select";
import 'react-toastify/dist/ReactToastify.css';
// import MaterialTable, { MTableToolbar } from 'material-table';
import { UploaderComponent } from "@syncfusion/ej2-react-inputs";
// import { Buffer } from 'buffer';
import Form from "react-bootstrap/Form";
import Table from "react-bootstrap/Table";
import { click } from "@testing-library/user-event/dist/click";
import { Button, Modal } from "react-bootstrap";
import { Radio } from "@mobiscroll/react-lite";
import { toast, ToastContainer } from "react-toastify";
import { Page, Document } from "react-pdf";
import { create, IPFSHTTPClient } from "ipfs-http-client";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import { Rating } from "react-simple-star-rating";

import ApplyRoleForm from "./Forms/ApplyRoleForm";
import axios from "axios";
function showsubmit(props) {
  const { user, type, email, loc, phno, modltype, isapproved } = props;
  return (
    <div className="modal fade" id="modal">
      <div className="modal-content">
        <div className="modal-header bg-default">
          <span className="panel">
            <h1 className="left">{user}</h1>
            <h2 className="right">{type}</h2>
          </span>
        </div>
        <form
          action="/"
          method="POST"
          className="form-group text-primary"
          encType="application/x-www-url-encoded"
        >
          <div className="modal-body bg-success">
            <div className="container-fluid justify-content-center">
              <input
                type="text"
                className="form-control"
                placeholder="Designation"
              />
              <input
                type="text"
                className="form-control"
                placeholder="Affliation"
              />
              <input
                type="password"
                className="form-control"
                pattern="[0-9]"
                placeholder="ORCIDID"
              />
            </div>
          </div>
          <div className="modal-footer bg-warning">
            <div className="tacbox bg-warning">
              <input id="checkbox" type="checkbox" />
              <label htmlFor="checkbox">
                {" "}
                I agree to these <a href="#">Terms and Conditions</a>.
              </label>
            </div>
            <button className="btn btn-success" data-dismiss="#modal">
              Confirm Submission
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Payment(props) {
  const [addr, setaddr] = useState(
    "0xb6cba76Df107aB90601866C4c375Ac4349990117"
  );
  const [ethr, setethr] = useState(0.02);
  const [money, setmoney] = useState(0);
  const pay = () => { };
  return (
    <>
      <div>
        <ToastContainer />
      </div>
      <div className="d">
        <form
          className="form-group"
          action="/dashboard"
          encType="application/x-www-form-urlencoded"
        >
          <input
            className="form-control text-primary"
            value={addr}
            disabled
            required
            placeholder="Email Address"
            name="email"
            type="email"
          />
          <input
            className="form-control text-primary"
            value={ethr}
            disabled
            required
            placeholder="Password"
            name="pass"
            type="password"
          />

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
          <button onClick={pay} className="btn btn-success">
            Pay And Submit
          </button>
        </form>
      </div>

    </>
  );
}

function Dashboard_component(props) {
  const navigate = useNavigate()
  const { account, contract, web3 } = props;
  let web3accountadd = "";
  const { user, type } = props;
  const isaproved = useRef(false);
  const [addr, setaddr] = useState("");
  const [show, setShow] = useState(false);
  const [key, setKey] = useState("applyRole")
  const handleShow = () => setShow(true);
  const [ethr, setethr] = useState(0.02);
  console.log("dashboard component accoount contract web3 ", addr);
  const [money, setmoney] = useState(false);
  const [unApprovedUsers, setUnApprovedUsers] = useState([])
  const [unApUsers, setUAPUsers] = useState([])
  console.log("unApprovedUsers", unApprovedUsers);
  const [txs, settsx] = useState([]);
  const [imageError, setImageError] = useState("");
  const [selectedFileName, setSelectedFileName] = useState("");
  const [selectedFile, setSelectedFile] = useState("");
  const [image, setImage] = useState("");
  const [IPFSURL, setIPFSURL] = useState("")
  const web3Account = async () => {
    web3accountadd = await web3.eth.getAccounts();
    setaddr(web3accountadd[0]);
  };

  const dopayment = async (settransac, ethr, addr) => {
    if (window.ethereum) {
      try {
        await window.ethereum.send("eth_requestAccounts");
        console.log(addr, ethr);
        const provider = await ethers.providers(window.ethereum);
        const signer = provider.getSigner();
        ethers.utils.getAddress(addr);
        const transac = await signer.sendTransaction({
          to: addr,
          value: ethers.utils.parseEther(ethr),
        });
        console.log(transac);
        settransac([transac]);
        toast.success("Saving status...", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      } catch (err) {
        toast.error("Payment Failed...", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }
    }
  };

  const unapprovedUsers = async () => {
    await axios.get("http://localhost:5050/roles/getUnapprovedRoles").then((res) => {
      setUnApprovedUsers(res.data.data);
      const unAPUsers = res.data.data.map((item, index) => {
        console.log("unapproved users data ", item);
        const id = item["orcidID"] || item["publisherID"];
        const email = item["email"] || item["emailID"];
        const isApproved = item["isApproved"]
        const address = item["addr"];
        const result = [id, item.rolesApplied[index], item["phoneNo"], email, isApproved, address];
        return result;
      });

      console.log("result of unAPUsers", unAPUsers);
      setUAPUsers(unAPUsers);
    }).catch((error) => {
      console.log("error in unapproved users ", error);
    })
  }
  useEffect(() => {
    unapprovedUsers()
  }, [unApprovedUsers])
  const openpay = () => {
    setmoney(true);
  };
  const closepay = async () => {
    navigate(-1)
    await dopayment(settsx, ethr, addr);

    toast.success("Saving status...", {
      position: toast.POSITION.BOTTOM_CENTER,
    });
    setTimeout(() => {
      setmoney(false);
    }, 2000);
  };
  const pay = () => { };
  const emailuser = useRef("");
  const projectId = "XXXXXXXXXX"; //your project id
  const projectSecret = "XXXXXXXXXXXXX"; //yout project secret
  const auth = "Basic " + (projectId + ":" + projectSecret).toString("base64");
  const client = create({
    host: "ipfs.infura.io",
    port: 5001,
    protocol: "https",
    headers: {
      authorization: auth,
    },
  });
  const [urlarr, seturlarr] = useState([]);
  console.log("url arr ", urlarr)
  const [file, setfile] = useState("");

  const mailer = () => {
    const subject = "Approval Status Brahma Blockchain";
    const body = isaproved
      ? "Your profile is approved"
      : "Your profile is not approved";
    let params = subject || body ? "?" : "";
    if (subject) params += `subject=${encodeURIComponent(subject)}`;
    if (body) params += `${subject ? "&" : ""}body=${encodeURIComponent(body)}`;

    return <a href={`mailto:${emailuser}${params}`}>{Dashboard_component}</a>;
  };
  const options = [
    { value: "R1", label: "Reviewer1" },
    { value: "R2", label: "Reviewer2" },
    { value: "R3", label: "Reviewer3" },
  ];
  const confedit = () => {
    toast.info("Saving edits...", {
      position: toast.POSITION.BOTTOM_CENTER,
    });
  };
  const [mailerbox, setmailbox] = useState(false);
  const mailunload = () => {
    setmailbox(false);
  };
  const handlemail = () => {
    setmailbox(true);
  };
  const mailconf = () => {
    toast.success("Saving status...", {
      position: toast.POSITION.BOTTOM_CENTER,
    });
    setTimeout(() => {
      setmailbox(false);
    }, 4000);
  };
  const showpubnot = () => {
    toast.success("Getting approved articles Published...", {
      position: toast.POSITION.BOTTOM_CENTER,
    });
  };
  const [clicked, setclicked] = useState(false);
  const [clickhis, setclickhis] = useState(false);
  const [seloption, setseloption] = useState(null);
  const [reviewid, setreviewid] = useState("");
  const [authorid, setauthorid] = useState("");
  const [reviewmod, setrevmod] = useState(false);
  const [remarks, setremarks] = useState("");
  const [nump, setnump] = useState(null);
  const [pageno, setpageno] = useState(1);
  const [edited, changedit] = useState(false);
  const [pubmod, setpubmod] = useState(false);
  const handleApproveRole = async (e, userAddress, userID) => {
    console.log("target values ", e, userAddress)
    let result = {};
    switch (e) {
      case "AUTHOR":
        result = await contract.methods
          .approveAuthor(
            userAddress, userID
          )
          .send({ from: addr });
        axios.post("http://localhost:5050/roles/approveRole", { e, userAddress }).then((res) => {
          console.log("response apply auth role", res)
        })
        break;

      case "EDITOR":
        result = await contract.methods
          .approveEditor(
            userAddress, userID
          )
          .send({ from: addr });
        axios.post("http://localhost:5050/roles/approveRole", {
          e, userAddress
        }).then((res) => {
          console.log("response apply editor role", res);
        })
        break;
      case "REVIEWER":
        result = await contract.methods
          .approveReviewer(
            userAddress, userID
          )
          .send({ from: addr });
        axios.post("http://localhost:5050/roles/approveRole", { e, userAddress }).then((res) => {
          console.log("response apply reviewer role", res)
        })
        break;

      case "PUBLISHER":
        result = await contract.methods
          .approvePublisher(
            userAddress, userID
          )
          .send({ from: addr });

        axios.post("http://localhost:5050/roles/approveRole", {
          e, userAddress
        }).then((res) => {
          console.log("response apply reviewer role", res)
        })
        break;
      default:
        toast.error("INAVLID ROLE APPLICATION");
    }
  }
  const closepubmod = () => {
    toast.success("Pending are approved papers now.");
    setpubmod(false);
  };
  const openpubmod = () => {
    setpubmod(true);
  };
  const editor = () => {
    changedit(true);
  };
  const loadpdfsuccess = ({ nump }) => {
    setpageno(pageno);
  };

  const approve = useRef(false);
  const reject = useRef(false);
  const [pdfer, setpdfer] = useState(false);
  const changeremark = (event) => {
    setremarks(event.target.value);
  };
  const pdfload = () => {
    setpdfer(true);
  };
  const pdfunload = () => {
    setpdfer(false);
  };
  const openrev = () => {
    setrevmod(true);
  };
  const closerev = () => {
    setrevmod(false);
  };
  const openmodal = () => {
    setclicked(true);
  };
  const closemodal = () => {
    setclicked(false);
    setTimeout(() => {
      setmoney(true);
    }, 2000);
  };
  const openmodalhis = () => {
    setclickhis(true);
  };
  const closemodalhis = () => {
    setclickhis(false);
  };
  const handler = () => { };
  const [rating, setRating] = useState(0);

  // Catch Rating value
  const handleRating = (rate) => {
    setRating(rate);

    // other logic
  };
  // Optinal callback functions
  const onPointerEnter = () => console.log("Enter");
  const onPointerLeave = () => console.log("Leave");
  const onPointerMove = (value, index) => console.log(value, index);

  const readandupload = async (event) => {
    event.preventDefault();
    try {
      const created = await client.add(file);
      const urlt = `https://ipfs.infura.io/ipfs/${created.path}`;
      seturlarr((prev) => [...prev, urlt]);
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    web3Account();
  }, []);



  // const handleSubmitAuthor= (event) =>{
  //   event.preventDefault()
  //   setFName("")
  //   setLName("")
  //   setDesignation("")
  //   setAffiliation("")
  //   setCity("")
  //   setEmail("")
  //   setPhoneNo(0)
  //   setOrcidID("")
  //   // console.log(fName, lName, designation, affiliation, city,email, addr phoneNo, orcidID, handleChangeFName, handleChangeLName, handleChangeDesignation, handleChangeAffiliation, handleChangeCity, handleChangePhoneNo, handleChangeOrcidID);
  // }

  const uploadFileToIPFS = () =>{
    try {
      let payload = {
        file: selectedFile,
        fileName: selectedFileName
      };
      console.log("payloadd", payload)
      const formData = new FormData();
      Object.keys(payload).forEach((key) => {
        formData.append(key, payload.key);
      });
      if (selectedFile && selectedFileName) {
        console.log("conspiracy handle clicked ", selectedFile, selectedFileName)
        formData.append("ipfsImage", selectedFile, selectedFileName);
      }
      if (formData) {
        axios.post("http://localhost:5050/roles/uploadPaper", formData)
          .then(result => {
            if(result.status === 200){
              toast.success("File Uploaded To IPFS Please Submit your Paper")
              setIPFSURL(result.data.IPFSURL)
            }
            
          })
          .catch(error => {
            console.log(error)
          })
      }

      
    } catch (error) {
      console.log(error);
    }
  }
  const uploadfile = (e) => {
    console.log("file uploaded ", e.target.files[0]);
    let size = e.target.files[0].size;
    const imgs = e.target.files[0].name.split(/[\s.]+/);
    const ext = imgs[imgs.length - 1];
    let imgExtArr = ["pdf"];
    if (!imgExtArr.some((item) => item === ext)) {
      setImageError("Please upload the image in correct format");
      setSelectedFileName("");
      setSelectedFile("");
      return;
    }

    if (size <= 5242880) {
      let preview = URL.createObjectURL(e.target.files[0]);
      setSelectedFileName(e.target.files[0].name);
      console.log("event.target.files[0] ", e.target.files[0])
      setSelectedFile(e.target.files[0]);
      setImage("");
      setImageError("");
    } else {
      setSelectedFileName("");
      setSelectedFile("");
      setImageError("Unable to uplod image greater than size 500 kb");
      return;
    }
  };
  if (type.length) {
    if (type == "Author") {
      const preloadFiles = [
        { name: "Books", size: 500, type: ".png" },
        { name: "Movies", size: 12000, type: ".pdf" },
        { name: "Study materials", size: 500000, type: ".docx" },
      ];
      const path = {
        removeUrl: "https://ej2.syncfusion.com/services/api/uploadbox/Remove",
        saveUrl: "https://ej2.syncfusion.com/services/api/uploadbox/Save",
      };
      console.log(clicked);
      return (
        <>
          <p className="text-success">Welcome {type} to Brahma</p>
          <form className="form-group" onSubmit={readandupload}>
            <span className="panel">
              <input
                type="file"
                onChange={uploadfile}
                className="form-control btn btn-primary"
                name="fileu"
              />
              <button
                style={{ marginBottom: 17, marginTop: 17 }}
                className="btn btn-success"
                onClick={()=> uploadFileToIPFS()}
              >
                Upload File
              </button>
            </span>
          </form>
          <span className="wrapper">
            <button onClick={openmodal} className="btn btn-success">
              Submit Paper
            </button>

            <button
              style={{ marginLeft: 4 }}
              onClick={openmodalhis}
              className="btn btn-info"
            >
              Show History
            </button>
          </span>
          <Modal show={clicked}>
            <Modal.Header closeButton onClick={closemodal}>
              <span className="panel">
                <h1 className="left">{user}</h1>
                <h2 className="right">{type}</h2>
              </span>
            </Modal.Header>
            <form
              action="/"
              method="POST"
              className="form-group text-primary"
              encType="application/x-www-url-encoded"
            >
              <Modal.Body>
                <div className="container-fluid justify-content-center">
                  <input
                    type="text"
                    id="desg"
                    style={{ marginBottom: 4 }}
                    name="desg"
                    className="form-control"
                    placeholder="Designation"
                  />
                  <input
                    type="text"
                    id="affl"
                    style={{ marginBottom: 4 }}
                    name="affl"
                    className="form-control"
                    placeholder="Affliation"
                  />
                  <input
                    type="password"
                    id="orcd"
                    style={{ marginBottom: 4 }}
                    name="orcd"
                    className="form-control"
                    pattern="[0-9]"
                    placeholder="ORCIDID"
                  />
                </div>
              </Modal.Body>
              <Modal.Footer>
                <div className="tacbox bg-warning">
                  <input id="checkbox" type="checkbox" />
                  <label style={{ marginLeft: 8 }} htmlFor="checkbox">
                    {" "}
                    I agree to these <a href="#">Terms and Conditions</a>.
                  </label>
                </div>
                <Button variant="secondary" onClick={closemodal}>
                  Close
                </Button>
                <Button variant="primary" onClick={closemodal}>
                  Confirm Submission
                </Button>
              </Modal.Footer>
            </form>
          </Modal>

          <div>
            <ToastContainer />
          </div>
          <Modal show={money}>
            <Modal.Header closeButton onclick={closepay}>
              <h1 className="left">{user}</h1>
              <h2 className="right">{type}</h2>
            </Modal.Header>

            <Modal.Body>
              <input
                className="form-control text-primary"
                value={addr}
                disabled
                required
                placeholder="Email Address"
                name="email"
                type="password"
              />
              <input
                className="form-control text-primary"
                value={`${ethr}💲`}
                disabled
                required
                placeholder="Password"
                name="pass"
                type="text"
              />
            </Modal.Body>
            <Modal.Footer>
              <input
                className="form-check-input"
                name="rem"
                id="flexCheckDefault"
                type="checkbox"
              />
              <label className="form-check-label" htmlFor="flexCheckDefault">
                I want to proceed
              </label>
              <br />
              <button
                onClick={() => { pay(); closepay() }}
                className="btn btn-success"
              >
                Pay And Submit
              </button>
            </Modal.Footer>
          </Modal>
          <Modal show={clickhis}>
            <Modal.Header closeButton onClick={closemodalhis}>
              <span className="panel">
                <h1 className="left">{user}</h1>
                <h2 className="right">{type}</h2>
              </span>
            </Modal.Header>
            <form
              action="/"
              method="POST"
              className="form-group text-primary"
              encType="application/x-www-url-encoded"
            >
              <Modal.Body>
                <div className="container-fluid justify-content-center">
                  <table className="table table-striped table-hover">
                    <thead>
                      <th className="bg-default">Paper ID</th>
                      <th className="bg-success">Reviewer ID</th>
                      <th className="bg-default">Editor ID</th>
                      <th className="bg-primary">Publisher Link</th>
                      <th className="bg-danger">Remarks</th>
                      <th className="bg-info"> Status</th>
                    </thead>
                    <tr>
                      <td>P1</td>
                      <td>A1</td>
                      <td>E1</td>
                      <td>
                        <a href="#">
                          {urlarr.length ? (
                            urlarr.map((ind) => ind)
                          ) : (
                            <strong>Demo</strong>
                          )}
                        </a>
                      </td>
                      <td>
                        <textarea
                          placeholder="Throw yours remarks here"
                          className="form-control"
                        ></textarea>
                      </td>
                      <td>Approved</td>
                    </tr>
                  </table>
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={closemodalhis}>
                  Close
                </Button>
                <Button variant="primary" onClick={closemodalhis}>
                  Checked
                </Button>
              </Modal.Footer>
            </form>
          </Modal>
        </>
      );
    } else if (type == "Reviewer") {
      return (
        <>
          <div className="table-responsive">

            <table className="table table-striped table-hover dashId">
              <thead>
                <th >Author ID</th>
                <th >Editor ID</th>
                <th >File Link</th>
                <th >Remarks</th>
              </thead>
              <tr>
                <td>A1</td>
                <td>E1</td>
                <td>
                  <a href="#">Link demo</a>
                </td>
                <td>
                  <textarea
                    placeholder="Throw yours remarks here"
                    onKeyUp={changeremark}
                    id="remarksrev"
                    className="form-control"
                  ></textarea>
                </td>
              </tr>
            </table>
          </div>
          <button className="btn btn-success">Review Pending Papers</button>
          <button
            style={{ marginTop: 8 }}
            onClick={openrev}
            className="btn btn-primary"
          >
            Confirms Reviews
          </button>
          <Modal show={reviewmod}>
            <Modal.Header closeButton onClick={closerev}>
              <span className="panel">
                <h1 className="left">{user}</h1>
                <h2 className="right">{type}</h2>
              </span>
            </Modal.Header>
            <form
              action="/"
              method="POST"
              className="form-group text-primary"
              encType="application/x-www-url-encoded"
            >
              <Modal.Body>
                <div className="container-fluid justify-content-center">
                  <input
                    type="text"
                    id="desg"
                    style={{ marginBottom: 4 }}
                    name="desg"
                    className="form-control"
                    placeholder="Designation"
                  />
                  <input
                    type="text"
                    id="affl"
                    style={{ marginBottom: 4 }}
                    name="affl"
                    className="form-control"
                    placeholder="Affliation"
                  />
                  <input
                    type="password"
                    id="orcd"
                    style={{ marginBottom: 4 }}
                    name="orcd"
                    className="form-control"
                    pattern="[0-9]"
                    placeholder="ORCIDID"
                  />
                </div>
                <div className="table-responsive container-fluid justify-content-center">

                  <table className="table table-striped table-hover dashId">
                    <thead>
                      <th >Paper ID</th>
                      <th >Editor ID</th>
                      <th >ORCIDID</th>
                      <th >Remarks</th>
                      <th > Approve</th>
                      <th >Reject</th>
                    </thead>
                    <tr>
                      <td>P1</td>
                      <td>E1</td>
                      <td>DEMO</td>
                      <td>{remarks}</td>
                      <td>
                        <Radio value={approve}>Approve</Radio>
                      </td>
                      <td>
                        <Radio value={reject}>Reject</Radio>
                      </td>
                    </tr>
                  </table>

                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={closerev}>
                  Close
                </Button>
                <Button variant="primary" onClick={closerev}>
                  Send Review Result
                </Button>
              </Modal.Footer>
            </form>
          </Modal>
        </>
      );
    } else if (type == "Admin") {
      return (
        <>
          <ToastContainer />
          <div className="table-responsive">
            <table className="table table-striped table-hover dashId">
              <thead>
                <th >UserID</th>
                <th >User Type</th>
                <th >Location</th>
                <th >Phone no</th>
                <th >Email Id</th>
                <th >IsApproved</th>
              </thead>
              {unApprovedUsers.map((item, index) => {
                if(item.rolesApplied[index] !== "USER"){
                  return (
                    <tr>
                      <td>{item["orcidID"] || item["publisherID"]}</td>
                      <td>{item.rolesApplied[index]}</td>
                      <td>India</td>
                      <td>{item["phoneNo"]}</td>
                      <td>{item["email"] || item["emailID"]}</td>
                      <td>{item["isApproved"] === false ? "UnApproved" : "Approved"}</td>
                    </tr>
                  )
                }                                 
              })}
            </table>
          </div>
          <button onClick={handlemail} className="btn">
            Approve Pending Users
          </button>
          <Modal show={mailerbox}>
            <Modal.Header closeButton onClick={mailunload}>
              <span className="panel">
                <h1 className="left">{user}</h1>
                <h2 className="right">{type}</h2>
              </span>
            </Modal.Header>
            <Modal.Body style={{ overflowX: "scroll" }}>
              <table className="table table-striped table-hover">
                <thead>
                  <th className="bg-success">UserID</th>
                  <th className="bg-info">User Type</th>
                  <th className="bg-primary">Location</th>
                  <th className="bg-success">Phone no</th>
                  <th className="bg-info">Email Id</th>
                  <th className="bg-danger">Status</th>
                </thead>
                {unApUsers.map((item, index) => {
                  console.log("u users ", index, item)
                  if(item[1] !== "USER"){
                    return (
                      <tr>
                        <td>{item[0]}</td>
                        <td>{item[1]}</td>
                        <td>India</td>
                        <td>{item[2]}</td>
                        <td>{item[3]}</td>
                        <td>{item[4] === false ? <button value={item[1]} onClick={(e) => handleApproveRole(e.target.value, item[5], item[0])}>Approve</button> : "Approved"}</td>
                      </tr>
                    )
                  }
                  
                  // return (
                  //     <tr>
                  //       <td>{item[0]}</td>
                  //       <td>{item[1]}</td>
                  //       <td>India</td>
                  //       <td>{item[2]}</td>
                  //       <td ref={emailuser}>{item[3]}</td>
                  //       <td><Radio ref={isaproved}>Approve</Radio></td>
                  //     </tr>
                  // )
                })}

              </table>
            </Modal.Body>
          </Modal>
        </>
      );
    } else if (type == "Editor") {
      return (
        <>
          <ToastContainer />
          <div className="table-responsive">
            <table className="table table-striped table-hover dashId">
              <thead>
                <th >Author ID</th>
                <th >Select Reviewer</th>
                <th >Action</th>
                <th >Remarks</th>
              </thead>
              <tr>
                <td>A1</td>
                <td>
                  <Select
                    value={seloption}
                    options={options}
                    onChange={setseloption}
                  />
                </td>
                <td>
                  <a onClick={pdfload} href="#">
                    EDIT
                  </a>
                </td>
                <td>
                  <textarea
                    placeholder="Throw yours remarks here"
                    className="form-control"
                  ></textarea>
                </td>
              </tr>
            </table>
          </div>
          <button onClick={pdfload} className="btn btn-success">
            Edit Pending Papers
          </button>
          <Modal show={pdfer}>
            <Modal.Header closeButton onClick={pdfunload}>
              <span className="panel">
                <h1 className="left">{user}</h1>
                <h2 className="right">{type}</h2>
              </span>
            </Modal.Header>
            <form
              action="/"
              method="POST"
              className="form-group text-primary"
              encType="application/x-www-url-encoded"
            >
              <Modal.Body>
                <Button variant="primary" onclick={editor}>
                  Edit Now
                </Button>
                <div className="container-fluid">
                  <Document file="" show={!edited} onClick={loadpdfsuccess}>
                    <Page pageNumber={pageno} />
                  </Document>
                  <p>
                    {pageno} of {nump}
                  </p>
                  <textarea
                    show={edited}
                    className="form-control text-primary"
                  ></textarea>
                </div>
              </Modal.Body>
              <Modal.Footer>
                <div className="tacbox bg-warning">
                  <input id="checkbox" type="checkbox" />
                  <label style={{ marginLeft: 8 }} htmlhtmlFor="checkbox">
                    {" "}
                    I am sure to Edit. Post Edit File: <a href="#">File Link</a>
                    .
                  </label>
                </div>
                <Button variant="secondary" onClick={pdfunload}>
                  Close
                </Button>
                <Button variant="primary" onClick={pdfunload}>
                  Save Edits
                </Button>
              </Modal.Footer>
            </form>
          </Modal>
          <button
            style={{ marginLeft: 5 }}
            onClick={confedit}
            className="btn btn-success"
          >
            Commit Edit
          </button>
        </>
      );
    } else if (type == "Publisher") {
      return (
        <>
          <div className="table-responsive">


            <table className="table table-striped table-hover dashId">
              <thead>
                <th >Author</th>
                <th >ISSN</th>
                <th >Status</th>
                <th >Journal</th>
                <th >Pub Id</th>
              </thead>
              <tr>
                <td>A1</td>
                <td>ISSNNO</td>
                <td>Approved</td>
                <td>
                  <a href="#">Link Journal demo</a>
                </td>
                <td>PID-1234</td>
              </tr>
            </table>
          </div>
          <button onClick={openpubmod} className="btn btn-primary">
            Publish pending approvals
          </button>
          <ToastContainer />
          <Modal show={pubmod} className="mw">
            <Modal.Header closeButton onClick={closepubmod}>
              <span className="panel">
                <h1 className="left">{user}</h1>
                <h2 className="right">{type}</h2>
              </span>
            </Modal.Header>
            <form
              action="/"
              method="POST"
              className="form-group text-primary"
              encType="application/x-www-url-encoded"
            >
              <Modal.Body>
                <div className="table-responsive container-fluid justify-content-center">
                  <table className="table table-striped table-hover dashId">
                    <thead>
                      <th >Paper ID</th>
                      <th >Reviewer ID</th>
                      <th >Editor ID</th>
                      <th >Author ID</th>
                      <th >ISSN</th>
                      <th > ORCIDID</th>
                      <th >Publisger Rating</th>
                    </thead>
                    <tr>
                      <td>P1</td>
                      <td>R1</td>
                      <td>E1</td>
                      <td>A1</td>
                      <td>DEMO</td>
                      <td>DEMO</td>
                      <td>
                        <Rating
                          onClick={handleRating}
                          onPointerEnter={onPointerEnter}
                          onPointerLeave={onPointerLeave}
                          onPointerMove={onPointerMove}
                        /* Available Props */
                        />
                      </td>
                    </tr>
                  </table>
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={closepubmod}>
                  Close
                </Button>
                <Button variant="primary" onClick={closepubmod}>
                  Confirm to publish
                </Button>
              </Modal.Footer>
            </form>
          </Modal>
          <ToastContainer />
        </>
      );
    } else if (type === "User") {
      return (
        <div className="table-responsive">
          <Table striped bordered hover className="rolTabl dashId">
            <thead>
              <tr>
                <th>#</th>
                <th>Role</th>
                <th style={{ textAlign: "right", paddingRight: "26px" }}>Apply</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>AUTHOR</td>
                {props.appliedRoles.includes('2') ? <a>Already Applied</a> : <td align="right"><ApplyRoleForm show={show} role={"author"} account={account} contract={contract} web3={web3} /></td>}
              </tr>
              <tr>
                <td>2</td>
                <td>EDITOR</td>
                {/* <td>Applied</td> */}
                {props.appliedRoles.includes('3') ? <a>Already Applied</a> : <td align="right"><ApplyRoleForm show={show} role={"editor"} account={account} contract={contract} web3={web3} /></td>}
              </tr>
              <tr>
                <td>3</td>
                <td>REVIEWER</td>
                <td align="right">
                  {props.appliedRoles.includes('4') ? <a>Already Applied</a> : <ApplyRoleForm show={show} role={"reviewer"} account={account} contract={contract} web3={web3} />}</td>
              </tr>
              <tr>
                <td>4</td>
                <td>PUBLISHER</td>
                <td align="right">
                  {props.appliedRoles.includes('5') ? <a>Already Applied</a> : <ApplyRoleForm show={show} role={"publisher"} account={account} contract={contract} web3={web3} />}
                </td>
                {/* <td>
                <Button variant="danger">✖</Button>
              </td> */}
              </tr>
            </tbody>
          </Table>
        </div>
      );
    }
  }
}

export function Dashboard(props) {
  console.log("props ", props);
  const navigate = useNavigate();
  const { account, contract, web3 } = props;
  const cuser = props;
  const type = "Author";
  const name = cuser.name;
  const options = [
    { value: type, label: type },
    { value: "User", label: "User" },
    { value: "Admin", label: "Admin" },
    { value: "Reviewer", label: "Reviewer" },
    { value: "Editor", label: "Editor" },
    { value: "Publisher", label: "Publisher" },
  ];

  const roles = {
    0: "USER",
    1: "ADMIN",
    2: "AUTHOR",
    3: "EDITOR",
    4: "REVIEWER",
    5: "PUBLISHER",
  };

  let appliedroles = [];
  const [role, setRole] = useState("");
  const [appliedRoles, setAppliedRoles] = useState([])
  console.log("current role ", appliedRoles)
  const getRole = async () => {
    appliedroles = await contract.methods
      .fetchAppliedRoles(account)
      .call();
    let uniqueAppliedRoles = [...new Set(appliedroles)];

    setAppliedRoles(uniqueAppliedRoles);
  };

  useEffect(() => {
    if (props.web3 === null) {
      navigate("/wallet");
    }
    getRole();
  }, []);
  const [seloption, setseloption] = useState(null);
  return (
    <>
      <div className="wallet">
        <div className="titleS">
          <h5>Current Role: {role}</h5>

        </div>
        <div className="titleUtr">
          <label className=" text" htmlFor="type">
            Welcome {name} as
          </label>
          <Select className="seT" value={type} options={options} onChange={setseloption} />

        </div>

        <Dashboard_component
          type={seloption ? seloption.value : ""}
          account={account}
          contract={contract}
          web3={web3}
          appliedRoles={appliedRoles}
        />




      </div>

    </>
  );
}