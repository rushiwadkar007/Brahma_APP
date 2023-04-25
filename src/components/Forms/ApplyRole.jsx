import React, { useState } from "react";
import Form from "react-bootstrap/Form";
const ApplyRole = ({fName, lName, designation, affiliation, city, email, addr, phoneNo, orcidID, handleChangeFName, handleChangeLName, handleChangeDesignation, handleChangeAffiliation, handleChangeCity,handleChangeEmail, handleChangePhoneNo, handleChangeOrcidID}) => {
    return (
    <>
    <Form>
                    <Form.Group className="mb-3" controlId="formBasicFname">
                      <Form.Label>First Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="First Name"
                        value={fName}
                        onChange={handleChangeFName}
                      />
                    </Form.Group>
                    <Form.Group className="mb-4" controlId="formBasicLName">
                      <Form.Label>Last Name</Form.Label>
                      <Form.Control type="text" placeholder="Last Name"
                      value={lName}
                      onChange={handleChangeLName} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicDesignatin">
                      <Form.Label>Designation</Form.Label>
                      <Form.Control type="text" placeholder="Designation"
                      value={designation}
                      onChange={handleChangeDesignation} /> 
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicAffiliation">
                      <Form.Label>Affiliation</Form.Label>
                      <Form.Control type="text" placeholder="Affiliation"
                      value={affiliation}
                      onChange={handleChangeAffiliation} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicCity">
                      <Form.Label>City</Form.Label>
                      <Form.Control type="text" placeholder="City"
                      value={city}
                      onChange={handleChangeCity} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                      <Form.Label>Email</Form.Label>
                      <Form.Control type="email" placeholder="Enter email"
                      value={email}
                      onChange={handleChangeEmail} />
                      <Form.Text className="text-muted">
                        We'll never share your email with anyone else.
                      </Form.Text>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPhoneNo">
                      <Form.Label>Phone No.</Form.Label>
                      <Form.Control type="text" placeholder="Phone No."
                      value={phoneNo}
                      onChange={handleChangePhoneNo} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicUser">
                      <Form.Label>User Public Key</Form.Label>
                      <Form.Control type="text" placeholder="User Public Key"
                      value={addr} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicOrcidID">
                      <Form.Label>ORCID ID</Form.Label>
                      <Form.Control type="text" placeholder="ORCID ID"
                      value={orcidID}
                      onChange={handleChangeOrcidID} />
                    </Form.Group>
                  </Form>
    </>
  )
}

export default ApplyRole