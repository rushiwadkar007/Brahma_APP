const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  fName: { type: String, required: true },
  lName: { type: String, required: true },
  designation: { type: String, required: true },
  affiliation: { type: String, required: true },
  city: { type: String, required: true },
  email: { type: String, required: true },
  phoneNo: { type: Number, required: true },
  isApproved: {
    type: Boolean,
    default: false,
  },
  role: { type: String, required: true },
  rolesApplied: [
    {
      type: String,
    },
  ],
  approvedRoles: [
    {
      type: String,
    },
  ],
  addr: { type: String, required: true },
  orcidID: { type: String, required: true },
});

module.exports = mongoose.model("User", UserSchema);
