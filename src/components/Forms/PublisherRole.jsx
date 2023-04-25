import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import { Button, Modal } from "react-bootstrap";
const PublisherRole = ({
  inputList,
  handleInputChange,
  handleRemoveClick,
  handleAddClick,
  phone, 
  ISSN, 
  email, 
  designation, 
  journalName, 
  addr, 
  publisherID,
  handleChangeEmail,
  handleChangeDesignation,
  handleChangePhoneNo,
  handleChangeISSN,
  handleChangeJournalName,
  handleChangePublisherID,
}) => {
  console.log("inputlist ", inputList)
  
  return (
    <>
      <Form>
        {inputList.map((x, i) => {
          return (
            <Form.Group className="mb-3" controlId="formBasicFname">
              <Form.Label>Add Additional Publisher Information</Form.Label>
              <Form.Control
                name="info"
                placeholder="Enter Info"
                value={x.info}
                onChange={(e) => handleInputChange(e, i)}
              />
              <div className="btn-box">
                {inputList.length !== 1 && (
                  <Button
                    variant="secondary"
                    style={{margin:"5px"}}
                    onClick={() => handleRemoveClick(i)}
                  >
                    Remove
                  </Button>
                )}
                {inputList.length - 1 === i && (
                  <Button variant="secondary" style={{margin:"5px"}} onClick={handleAddClick}>
                    Add
                  </Button>
                )}
              </div>
            </Form.Group>
          );
        })}
        <Form.Group className="mb-4" controlId="formBasicLName">
          <Form.Label>Phone</Form.Label>
          <Form.Control
            type="text"
            placeholder="Phone No."
            value={phone}
            onChange={handleChangePhoneNo}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicISSN">
          <Form.Label>ISSN</Form.Label>
          <Form.Control
            type="text"
            placeholder="ISSN"
            value={ISSN}
            onChange={handleChangeISSN}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={handleChangeEmail}
          />
          <Form.Text className="text-muted">
            We'll never share your email with anyone else.
          </Form.Text>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicDeisgnation">
          <Form.Label>Designation.</Form.Label>
          <Form.Control
            type="text"
            placeholder="Designation"
            value={designation}
            onChange={handleChangeDesignation}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicJournalName">
          <Form.Label>JournalName</Form.Label>
          <Form.Control
            type="text"
            placeholder="Journal Name"
            value={journalName}
            onChange={handleChangeJournalName}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicUser">
          <Form.Label>User Address</Form.Label>
          <Form.Control
            type="text"
            placeholder="user"
            value={addr}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicPublisherID">
          <Form.Label>Publisher ID</Form.Label>
          <Form.Control
            type="text"
            placeholder="PublisherID"
            value={publisherID}
            onChange={handleChangePublisherID}
          />
        </Form.Group>
      </Form>
    </>
  );
};

export default PublisherRole;
