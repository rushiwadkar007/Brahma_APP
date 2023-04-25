import React, { useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";

// <button className="mr10" onClick={() => handleRemoveClick(i)}>
// Remove
// </button>
import { toast, ToastContainer } from "react-toastify";
import ApplyRole from "./ApplyRole";
import PublisherRole from "./PublisherRole";
import { useNavigate } from "react-router-dom";
import axios from "axios"
const ApplyRoleForm = ({ show, role, account, contract, web3 }) => {
  const Navigate = useNavigate();
  console.log("key %%%%%%%%%%%%%%%%%", role, account);
  const [fName, setFName] = useState("");
  const [lName, setLName] = useState("");
  const [designation, setDesignation] = useState("");
  const [affiliation, setAffiliation] = useState("");
  const [city, setCity] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [orcidID, setOrcidID] = useState("");
  const [addr, setaddr] = useState("");
  const [showVal, setShowVal] = useState(false);
  const [roleCondition, setRoleCondition] = useState(role);

  const [phone, setPhpne] = useState(null);
  const [ISSN, setISSN] = useState(null);
  // const [email, setEmail] = useState("")
  // const [designation, setDesignation] = useState("")
  const [journalName, setJournalName] = useState("");
  const [userAddress, setUserAddress] = useState("");
  const [publisherID, setPublisherID] = useState("");
  console.log("show vlaue ", roleCondition);
  const [inputList, setInputList] = useState([{ info: "" }]);

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...inputList];
    list[index][name] = value;
    setInputList(list);
  };

  // handle click event of the Remove button
  const handleRemoveClick = (index) => {
    const list = [...inputList];
    list.splice(index, 1);
    setInputList(list);
  };

  // handle click event of the Add button
  const handleAddClick = () => {
    setInputList([...inputList, { info: "" }]);
  };

  // const handleShow = () => setShow(true);

  const handleShow = () => setShowVal(true);
  const handleClose = () => {
    setFName("");
    setLName("");
    setDesignation("");
    setAffiliation("");
    setCity("");
    setEmail("");
    setPhoneNo(null);
    setOrcidID("");
    setShowVal(false);
  };
  const handleChangeFName = (e) => {
    setFName(e.target.value);
  };

  const handleChangeLName = (e) => {
    setLName(e.target.value);
  };

  const handleChangeDesignation = (e) => {
    setDesignation(e.target.value);
  };

  const handleChangeAffiliation = (e) => {
    setAffiliation(e.target.value);
  };

  const handleChangeCity = (e) => {
    setCity(e.target.value);
  };

  const handleChangeEmail = (e) => {
    setEmail(e.target.value);
  };

  const handleChangeISSN = (e) => {
    setISSN(e.target.value);
  };

  const handleChangeJournalName = (e) => {
    setJournalName(e.target.value);
  };

  const handleChangePublisherID = (e) => {
    setPublisherID(e.target.value);
  };

  const handleChangePhoneNo = (e) => {
    setPhoneNo(e.target.value);
  };

  const handleChangeOrcidID = (e) => {
    setOrcidID(e.target.value);
  };

  let web3accountadd = "";
  const web3Account = async () => {
    web3accountadd = await web3.eth.getAccounts();
    setaddr(web3accountadd[0]);
  };

  const sendAuthReq = async () => {
    let result = {};

    console.log("role send auth req", roleCondition)

    switch (role) {
      case "author":
        result = await contract.methods
          .applyForAuthorRole(
            fName,
            lName,
            designation,
            affiliation,
            city,
            email,
            phoneNo,
            addr,
            orcidID
          )
          .send({ from: addr });
          axios.post("http://localhost:5050/roles/applyForAuthorRole",{fName,
            lName,
            designation,
            affiliation,
            city,
            email,
            phoneNo,
            addr,
            orcidID}).then((res)=>{
              console.log("response apply auth role", res)
            })
          break;

      case "editor":
        result = await contract.methods
          .applyForEditorRole(
            fName,
            lName,
            designation,
            affiliation,
            city,
            email,
            phoneNo,
            addr,
            orcidID
          )
          .send({ from: addr });
          axios.post("http://localhost:5050/roles/applyForEditorRole",{fName,
            lName,
            designation,
            affiliation,
            city,
            email,
            phoneNo,
            addr,
            orcidID}).then((res)=>{
              console.log("response apply editor role", res);
            })
          break;
      case "reviewer":
        result = await contract.methods
          .applyForReviewerRole(
            fName,
            lName,
            designation,
            affiliation,
            city,
            email,
            phoneNo,
            addr,
            orcidID
          )
          .send({ from: addr });
          axios.post("http://localhost:5050/roles/applyForReviewerRole",{fName,
            lName,
            designation,
            affiliation,
            city,
            email,
            phoneNo,
            addr,
            orcidID}).then((res)=>{
              console.log("response apply reviewer role", res)
            })
          break;

      case "publisher":
        result = await contract.methods
          .applyForPublisherRole(
            inputList,
            phoneNo,
            ISSN,
            email,
            designation,
            journalName,
            addr,
            publisherID
          )
          .send({ from: addr });

          axios.post("http://localhost:5050/roles/applyForPublisherRole",{
            inputList,
            phoneNo,
            ISSN,
            email,
            designation,
            journalName,
            addr,
            publisherID
          }).then((res)=>{
              console.log("response apply reviewer role", res)
            })
          break;
      default:
        toast.error("INAVLID ROLE APPLICATION");
    }

    console.log("result ", result)
  };
  useEffect(() => {
    web3Account();
  }, []);
  return (
    <div>
      <td>
        <Button className="btn"  onClick={handleShow}>
          APPLY
        </Button>
      </td>
      <Modal show={showVal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Apply For {roleCondition} Role</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {roleCondition !== "publisher" ? (
            <ApplyRole
              fName={fName}
              lName={lName}
              designation={designation}
              affiliation={affiliation}
              city={city}
              email={email}
              addr={addr}
              phoneNo={phoneNo}
              orcidID={orcidID}
              handleChangeFName={handleChangeFName}
              handleChangeLName={handleChangeLName}
              handleChangeDesignation={handleChangeDesignation}
              handleChangeAffiliation={handleChangeAffiliation}
              handleChangeCity={handleChangeCity}
              handleChangeEmail={handleChangeEmail}
              handleChangePhoneNo={handleChangePhoneNo}
              handleChangeOrcidID={handleChangeOrcidID}
            />
          ) : (
            <PublisherRole
              designation={designation}
              email={email}
              addr={addr}
              phoneNo={phoneNo}
              ISSN={ISSN}
              journalName={journalName}
              publisherID={publisherID}
              handleChangeISSN={handleChangeISSN}
              handleChangeDesignation={handleChangeDesignation}
              handleChangeAffiliation={handleChangeAffiliation}
              handleChangeEmail={handleChangeEmail}
              handleChangeJournalName={handleChangeJournalName}
              handleChangePublisherID={handleChangePublisherID}
              handleChangePhoneNo={handleChangePhoneNo}
              inputList={inputList}
              handleInputChange={handleInputChange}
              handleRemoveClick={handleRemoveClick}
              handleAddClick={handleAddClick}
            />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              sendAuthReq();
              setShowVal(true);
            }}
          >
            APPLY
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ApplyRoleForm;
