const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const PublisherScehma = new mongoose.Schema({
  inputList: { type: Object, required: true, unique: true },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  ISSN: { type: String, required: true },
  designation: { type: String, required: true },
  journalName: { type: String, required: true },
  emailID: { type: String, required: true },
  phoneNo: { type: Number, required: true },
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
  publisherID: { type: String, required: true },
});

module.exports = mongoose.model("Publisher", PublisherScehma);


