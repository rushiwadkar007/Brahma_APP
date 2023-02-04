import React, { useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import ApplyRole from "../ApplyRole";
import { useNavigate } from "react-router-dom";
const ApplyRoleForm = ({ show, key, account, contract, web3 }) => {
  const Navigate = useNavigate();
  console.log(
    "key account, contract, web3",
    show,
    key,
    account,
    contract,
    web3
  );
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
  console.log("show vlaue ", showVal);

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
  }
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

  const handleChangeAddr = (e) => {
    setaddr(e.target.value);
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
    const result = await contract.methods
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
    console.log("result ", result);
  };
  useEffect(() => {
    web3Account();
  }, []);
  return (
    <div>
      <td>
        <Button variant="success" onClick={handleShow}>
          APPLY
        </Button>
      </td>
      <Modal show={showVal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Apply For Author Role</Modal.Title>
        </Modal.Header>
        <Modal.Body>
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
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              sendAuthReq(
                fName,
                lName,
                designation,
                affiliation,
                city,
                email,
                phoneNo,
                orcidID
              );
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
