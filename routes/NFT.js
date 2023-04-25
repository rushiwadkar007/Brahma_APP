const router = require("express").Router();

const { getUserRole, applyForAuthorRole,getUnapprovedRoles, applyForPublisherRole, applyForEditorRole, applyForReviewerRole, saveApplication, approveRole, getUnapprovedUsers} = require("../controllers/ApplyRole");

const bodyParser = require('body-parser');

router.get('/getUserRole', getUserRole)

router.post("/applyForAuthorRole", applyForAuthorRole);

router.get("/getUnapprovedRoles", getUnapprovedRoles);

router.post("/applyForEditorRole", applyForEditorRole);

router.post("/applyForReviewerRole", applyForReviewerRole);

router.post("/saveApplication", saveApplication);

router.post("/applyForPublisherRole", applyForPublisherRole);

router.post("/approveRole", approveRole)

router.get("/getUnapprovedUsers", getUnapprovedUsers)

module.exports = router;