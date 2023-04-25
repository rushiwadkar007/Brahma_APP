const {
  Roles,
  ETx,
  common,
  web3,
  contractAddress,
  contract,
} = require("../utils/handleinfo");
const user = require("../models/User");
const User = require("../models/User");
const Publisher = require("../models/Publisher");
const { findOne } = require("../models/User");
console.log(user);
const getRoles = async (address) => {
  let getUserRole = await contract.methods.fetchAppliedRoles(address).call();
  let uniqueRoles = [...new Set(getUserRole)];
  console.log("getUser role data ", uniqueRoles)
  return uniqueRoles.map((item, index) => {
    return Roles[item];
  });
};

const fetchApprovedRoles = async (address) => {
  let getUserRole = await contract.methods.fetchApprovedRoles(address).call();
  let uniqueRoles = [...new Set(getUserRole)];
  console.log("getUser role data ", uniqueRoles)
  return uniqueRoles.map((item, index) => {
    return Roles[item];
  });
}

const saveApplication = async (req, res) => {
  const {
    fName,
    lName,
    designation,
    affiliation,
    city,
    email,
    userAddress,
    phoneNo,
    role,
    addr,
    orcidID,
  } = req.body;

  const user = await User.find({ addr: userAddress });

  if (!user) res.status(400).json({ data: null, error: "User Not Found!" });

  let roles = [...user.roleApplied];

  roles.push(role);

  let unapprovedRoles = [...user.roleApplied]

  unapprovedRoles.push(role)

  const trxHashObject = new TRXHash({
    username: fName,
    password: "abcd123",
    isAdmin: false,
    mnemonic: "amb",
    fName: fName,
    lName: lName,
    designation: designation,
    affiliation: affiliation,
    city: city,
    email: email,
    phoneNo: phoneNo,
    rolesApplied: roles,
    approvedRoles: [],
    addr: addr,
    orcidID: orcidID,
  });

  trxHashObject
    .save()
    .then((result) => {
      console.log("Transaction details saved! ", result);
    })

    .catch((err) => {
      console.log(err);
    });

  res.status(200).send({ success: true });
};

const approveRole = async (req, res) => {
  const { userAddress, roleType } = req.body;

  const user = await User.find({ addr: userAddress });

  if (!user) res.status(400).json({ data: null, error: "User not found" });

  let roles = [...user.approvedRoles];

  let unapprovedRoles = [...user.unApprovedRoles]

  await unapprovedRoles.remove(roleType)

  await roles.push(roleType);

  if (userAddress) {
    User.updateOne(
      { addr: userAddress },

      {
        $set: {
          approvedRoles: roles,
          unApprovedRoles: unapprovedRoles
        },
      }
    )
      .then((result) =>
        res.status(200).json({ status: "User Approved Successfully!" })
      )

      .catch((err) => console.log(err));

    return true;
  } else {
    res.status(500).json({ error: "Server ERROR!" });
  }
};

const getUnapprovedUsers = async (req, res) => {
  const users = await User.find({})

  if (!users) res.status(400).json({ status: "Data not found!" })

  let unApprovedUsers = users.map((item, index) => {
    const totalRolesApplied = item.unApprovedRoles.length

    if (totalRolesApplied > 0) {
      return item
    }
  })

  res.status(200).json({
    data: unApprovedUsers,
    status: "Success"
  })
}

const getUserRole = async (req, res) => {
  try {
    const roles = await getRoles(req.body.address);
    const approvedRoles = await fetchApprovedRoles()
    res.status(200).send({
      data: {
        userAddress: req.body.address,
        Role: [...new Set(roles)],
      },
    });
  } catch (error) {
    res.status(400).send({ data: null, status: error });
  }
};

const applyForAuthorRole = async (req, res) => {
  try {
    const {
      fName,
      lName,
      designation,
      affiliation,
      city,
      email,
      phoneNo,
      addr,
      orcidID,
    } = req.body;
    const roles = await getRoles(addr);
    console.log("roles ", roles);
    const approvedRoles = await fetchApprovedRoles(addr);
    const user = await User.find({ addr: addr });
    if (user.length === 0) {
      const isAdmin = await approvedRoles.includes("ADMIN") ? true : false
      const userObject = new User({
        username: fName,
        password: "abcd123",
        isAdmin: isAdmin,
        fName: fName,
        lName: lName,
        designation: designation,
        affiliation: affiliation,
        city: city,
        email: email,
        role: "AUTHOR",
        phoneNo: phoneNo,
        rolesApplied: roles,
        isApproved: false,
        approvedRoles: approvedRoles,
        addr: addr,
        orcidID: orcidID,
      });

      userObject
        .save()
        .then((result) => {
          console.log("author role saved....!")
        })
        .catch(error => {
          res.status(400).json({
            status: false,
            error: error
          })
        })
      res.status(200).send({
        success: true, data: {
          username: fName,
          password: "abcd123",
          isAdmin: isAdmin,
          fName: fName,
          lName: lName,
          designation: designation,
          affiliation: affiliation,
          city: city,
          email: email,
          phoneNo: phoneNo,
          rolesApplied: roles,
          approvedRoles: approvedRoles,
          addr: addr,
          orcidID: orcidID,
        }
      });
    }
    else {
      console.log("roles ", roles)
      if (roles.includes("AUTHOR")) return res.status(400).send({ status: "Role Already Assigned!" });
      User.updateOne(
        { addr: addr },
        {
          $set: {
            rolesApplied: roles,
            approvedRoles: approvedRoles,
          },
        }
      )
        .then((result) =>
          // res.status(200).json({ status: "User Approved Successfully!" })
          console.log("User Updated Successfully!")
        )
        .catch((err) => console.log(err));

      res.status(200).send({
        success: true, data: "Data Updated Successfully."
      });
    }
    // let nonce = await web3.eth.getTransactionCount(user.toString(), "pending");

    // const NetworkId = await web3.eth.net.getId();

    // const pvt = Buffer.from(privateKey, "hex");

    // const transferFunction = await contract.methods
    //   .applyForAuthorRole(
    //     firstName,
    //     lastName,
    //     designation,
    //     affiliation,
    //     city,
    //     email,
    //     phNo,
    //     user,
    //     orcidID
    //   )
    //   .encodeABI();

    // const rawTx = {
    //   from: user,
    //   to: contractAddress.toLowerCase(),
    //   data: transferFunction,
    //   nonce: nonce,
    //   value: "0x00000000000000",
    //   gas: web3.utils.toHex(1500000),
    //   gasPrice: web3.utils.toHex(30000000000 * 2),
    //   chainId: NetworkId,
    // };

    // let trans = new ETx(rawTx, { common });

    // trans.sign(pvt);

    // await web3.eth
    //   .sendSignedTransaction("0x" + trans.serialize().toString("hex"))
    //   .on("receipt", async (data) => {
    //     res.status(200).send({ success: true, data: data });
    //   })
    //   .on("error", async (data) => {
    //     res.status(404).send({ status: "data not found", data: data });
    //   });
  } catch (error) {
    console.log(error);
  }
};

const applyForEditorRole = async (req, res) => {
  try {
    const {
      fName,
      lName,
      designation,
      affiliation,
      city,
      email,
      phoneNo,
      addr,
      orcidID,
    } = req.body;
    const roles = await getRoles(addr);
    console.log("roles ", roles);
    const approvedRoles = await fetchApprovedRoles(addr);
    const user = await User.find({ addr: addr });
    if (user.length === 0) {
      const isAdmin = await approvedRoles.includes("ADMIN") ? true : false
      const userObject = new User({
        username: fName,
        password: "abcd123",
        isAdmin: isAdmin,
        fName: fName,
        lName: lName,
        designation: designation,
        affiliation: affiliation,
        city: city,
        role: "EDITOR",
        email: email,
        phoneNo: phoneNo,
        rolesApplied: roles,
        isApproved: false,
        approvedRoles: approvedRoles,
        addr: addr,
        orcidID: orcidID,
      });

      userObject
        .save()
        .then((result) => {
          console.log("author role saved....!")
        })
        .catch(error => {
          res.status(400).json({
            status: false,
            error: error
          })
        })
      res.status(200).send({
        success: true, data: {
          username: fName,
          password: "abcd123",
          isAdmin: isAdmin,
          fName: fName,
          lName: lName,
          designation: designation,
          affiliation: affiliation,
          city: city,
          email: email,
          phoneNo: phoneNo,
          rolesApplied: roles,
          approvedRoles: approvedRoles,
          addr: addr,
          orcidID: orcidID,
        }
      });
    }
    else {
      console.log("roles ", roles)
      if (roles.includes("EDITOR")) return res.status(400).send({ status: "Role Already Assigned!" });
      User.updateOne(
        { addr: addr },
        {
          $set: {
            rolesApplied: roles,
            approvedRoles: approvedRoles,
          },
        }
      )
        .then((result) =>
          // res.status(200).json({ status: "User Approved Successfully!" })
          console.log("User Updated Successfully!")
        )
        .catch((err) => console.log(err));

      res.status(200).send({
        success: true, data: "Data Updated Successfully."
      });
    }
  }
  catch (error) {
    console.log(error);
  }

  // try {
  //   const {
  //     firstName,
  //     lastName,
  //     designation,
  //     affiliation,
  //     city,
  //     email,
  //     phNo,
  //     user,
  //     privateKey,
  //     orcidID,
  //   } = req.body;

  //   const roles = await getRoles(user);

  //   if (roles.includes("EDITOR"))
  //     return res.status(400).send({ status: "Role Already Assigned!" });

  //   if (getUserRole[1].includes("4")) {
  //     return res
  //       .status(404)
  //       .send({ status: "Reviewers can not apply for Editor Role" });
  //   }

  //   let nonce = await web3.eth.getTransactionCount(user.toString(), "pending");

  //   const NetworkId = await web3.eth.net.getId();

  //   const pvt = Buffer.from(privateKey, "hex");

  //   const transferFunction = await contract.methods
  //     .applyForEditorRole(
  //       firstName,
  //       lastName,
  //       designation,
  //       affiliation,
  //       city,
  //       email,
  //       phNo,
  //       user,
  //       orcidID
  //     )
  //     .encodeABI();

  //   const rawTx = {
  //     from: user,
  //     to: contractAddress.toLowerCase(),
  //     data: transferFunction,
  //     nonce: nonce,
  //     value: "0x00000000000000",
  //     gas: web3.utils.toHex(1500000),
  //     gasPrice: web3.utils.toHex(30000000000 * 2),
  //     chainId: NetworkId,
  //   };

  //   let trans = new ETx(rawTx, { common });

  //   trans.sign(pvt);

  //   await web3.eth
  //     .sendSignedTransaction("0x" + trans.serialize().toString("hex"))
  //     .on("receipt", async (data) => {
  //       res.status(200).send({ success: true, data: data });
  //     })
  //     .on("error", async (data) => {
  //       res.status(404).send({ status: "data not found", data: data });
  //     });
  // } catch (error) {
  //   // res.status(404).send({ status: 'data not found', errorStatus: error });
  //   console.log(error);
  // }
};
//0x29Dea38799a8702c22299220be1EEC1a1cD9609e
//128c4227eb9db18434de178b49f032b862480d8682fb12a4baa8281561667817

const applyForReviewerRole = async (req, res) => {
  try {
    const {
      fName,
      lName,
      designation,
      affiliation,
      city,
      email,
      phoneNo,
      addr,
      orcidID,
    } = req.body;
    const roles = await getRoles(addr);
    console.log("roles ", roles);
    const approvedRoles = await fetchApprovedRoles(addr);
    const user = await User.find({ addr: addr });
    if (user.length === 0) {
      const isAdmin = await approvedRoles.includes("ADMIN") ? true : false
      const userObject = new User({
        username: fName,
        password: "abcd123",
        isAdmin: isAdmin,
        fName: fName,
        lName: lName,
        designation: designation,
        affiliation: affiliation,
        city: city,
        email: email,
        role: "REVIEWER",
        phoneNo: phoneNo,
        rolesApplied: roles,
        isApproved: false,
        approvedRoles: approvedRoles,
        addr: addr,
        orcidID: orcidID,
      });

      userObject
        .save()
        .then((result) => {
          console.log("author role saved....!")
        })
        .catch(error => {
          res.status(400).json({
            status: false,
            error: error
          })
        })
      res.status(200).send({
        success: true, data: {
          username: fName,
          password: "abcd123",
          isAdmin: isAdmin,
          fName: fName,
          lName: lName,
          designation: designation,
          affiliation: affiliation,
          city: city,
          email: email,
          phoneNo: phoneNo,
          rolesApplied: roles,
          approvedRoles: approvedRoles,
          addr: addr,
          isApproved: false,
          orcidID: orcidID,
        }
      });
    }
    else {
      console.log("roles ", roles)
      if (roles.includes("EDITOR")) return res.status(400).send({ status: "Role Already Assigned!" });
      User.updateOne(
        { addr: addr },
        {
          $set: {
            rolesApplied: roles,
            approvedRoles: approvedRoles,
          },
        }
      )
        .then((result) =>
          // res.status(200).json({ status: "User Approved Successfully!" })
          console.log("User Updated Successfully!")
        )
        .catch((err) => console.log(err));

      res.status(200).send({
        success: true, data: "Data Updated Successfully."
      });
    }
  }
  catch (error) {
    console.log(error);
  }
  // try {
  //   const {
  //     firstName,
  //     lastName,
  //     designation,
  //     affiliation,
  //     city,
  //     email,
  //     phNo,
  //     user,
  //     privateKey,
  //     orcidID,
  //   } = req.body;

  //   const roles = await getRoles(user);

  //   if (roles.includes("REVIEWER"))
  //     return res.status(400).send({ status: "Role Already Assigned!" });

  //   if (getUserRole[1].includes("3")) {
  //     return res
  //       .status(400)
  //       .send({ status: "Editors can not apply for Reviewer Role" });
  //   }

  //   let nonce = await web3.eth.getTransactionCount(user.toString(), "pending");

  //   const NetworkId = await web3.eth.net.getId();

  //   const pvt = Buffer.from(privateKey, "hex");

  //   const transferFunction = await contract.methods
  //     .applyForReviewerRole(
  //       firstName,
  //       lastName,
  //       designation,
  //       affiliation,
  //       city,
  //       email,
  //       phNo,
  //       user,
  //       orcidID
  //     )
  //     .encodeABI();

  //   const rawTx = {
  //     from: user,
  //     to: contractAddress.toLowerCase(),
  //     data: transferFunction,
  //     nonce: nonce,
  //     value: "0x00000000000000",
  //     gas: web3.utils.toHex(1500000),
  //     gasPrice: web3.utils.toHex(30000000000 * 2),
  //     chainId: NetworkId,
  //   };

  //   let trans = new ETx(rawTx, { common });
  //   console.log(trans);

  //   trans.sign(pvt);

  //   await web3.eth
  //     .sendSignedTransaction("0x" + trans.serialize().toString("hex"))
  //     .on("receipt", async (data) => {
  //       res.status(200).send({ success: true, data: data });
  //     })
  //     .on("error", async (data) => {
  //       return;
  //     });
  // } catch (error) {
  //   console.log(error);
  // }
};

const applyForPublisherRole = async (req, res) => {
  try {
    const {
      inputList,
      ISSN,
      designation,
      journalName,
      email,
      phoneNo,
      addr,
      publisherID,
    } = req.body;
    const roles = await getRoles(addr);
    console.log("roles ", req.body);
    const approvedRoles = await fetchApprovedRoles(addr);
    const user = await Publisher.find({ addr: addr });
    if (user.length === 0) {
      // if (roles.includes("PUBLISHER"))
      //   return res.status(400).send({ status: "Role Already Assigned!" });
      const isAdmin = await approvedRoles.includes("ADMIN") ? true : false
      const publisherObject = new Publisher({
        inputList: inputList,
        isAdmin: isAdmin,
        designation: designation,
        ISSN: ISSN,
        journalName: journalName,
        emailID: email,
        phoneNo: phoneNo,
        rolesApplied: roles,
        role: "PUBLISHER",
        isApproved: false,
        approvedRoles: approvedRoles,
        addr: addr,
        publisherID: publisherID,
      });
      publisherObject
        .save()
        .then((result) => {
          console.log("publisher role saved....!", result)
        })
        .catch(error => {
          // res.status(400).json({
          //   status: false,
          //   error: error
          // })
          console.log("error in publisher saving ", error)
        })
      res.status(200).send({
        success: true, data: {
          inputList,
          isAdmin,
          ISSN,
          designation,
          journalName,
          email,
          phoneNo,
          roles,
          approvedRoles,
          addr,
          publisherID
        }
      });
    }
    else {
      console.log("roles ", roles)
      if (roles.includes("PUBLISHER")) return res.status(400).send({ status: "Role Already Assigned!" });
      Publisher.updateOne(
        { addr: addr },
        {
          $set: {
            rolesApplied: roles,
            approvedRoles: approvedRoles,
          },
        }
      )
        .then((result) =>
          // res.status(200).json({ status: "User Approved Successfully!" })
          console.log("Publisher Updated Successfully!")
        )
        .catch((err) => console.log(err));

      res.status(200).send({
        success: true, data: "Data Updated Successfully."
      });
    }
  }
  catch (error) {
    console.log(error);
  }
}

const getUnapprovedRoles = async (req, res) =>{

  const publishers = await Publisher.find({isApproved: false})
  let users = await User.find({isApproved: false})

  users = users.concat(publishers);

  res.status(200).json({
    data: users,
    success: true
  })
}

module.exports = {
  getUserRole,
  applyForAuthorRole,
  applyForEditorRole,
  applyForReviewerRole,
  applyForPublisherRole,
  saveApplication,
  approveRole,
  getUnapprovedUsers,
  getUnapprovedRoles
};
