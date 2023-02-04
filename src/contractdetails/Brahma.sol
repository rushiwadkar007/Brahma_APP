// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract BrahmaBlockchain{

    address public admin;

    struct Authors{
        string  firstName;
        string  lastName;
        string  designation;
        string  affiliation;
        string  city;
        string  email;
        uint256 phNo;
        address author;
        uint256 ORCIDID;
        bool isApproved;
    }

    struct Editors {
        string  firstName;
        string  lastName;
        string  designation;
        string  affiliation;
        string  city;
        string  email;
        uint256 phNo;
        address editor;
        uint256 ORCIDID;
        bool isApproved;
    }

    struct Reviewers{
        string  firstName;
        string  lastName;
        string  designation;
        string  affiliation;
        string  city;
        string  email;
        uint256 phNo;
        address reviewer;
        uint256 ORCIDID;
        bool isApproved;
    }

    struct Publishers{
        string[] publisherInfo;
        uint256 phNo;
        uint256 ISSN;
        string email;
        string designation;
        string journalName;
        uint256 publisherID;
        address publisher;
        bool isApproved;
    }

// open access
// if not open only abstract accesss - like only first 200 characters should be visible... and some keywords....
    struct Papers{
        string URL;
        uint256 paperID;
        address paperCreator;
        address paperScreener;
        //paper Title
        bool isPaperValid;
        bool isPaperScreened;
        bool isPaperReviewed;
        uint256 paperCreatedAt;
        bool submittedForScreening;
        bool isPaperApproved;
    }

    struct PaperReview{
        uint256 paperID;
        address reviewer;
        string remarks;
        bool isApproved;
    }

    Authors[] authors;
    Editors[] editors;
    Reviewers[] reviewers;
    Publishers[] publishers;
    Papers[] papers;
    PaperReview[] paperReview;


    event AuthorCreated(string firstName, string  lastName, string  designation, string  affiliation, string  city, string  email, uint256 phNo, address author, uint256 orcidID);
    event EditorCreated(string firstName, string  lastName, string  designation, string  affiliation, string  city, string  email, uint256 phNo, address editor, uint256 orcidID);
    event ReviewerCreated(string firstName, string  lastName, string  designation, string  affiliation, string  city, string  email, uint256 phNo, address reviewer, uint256 orcidID);
    event PublisherCreated(string[] publisherInfo, uint256 phNo, uint256 ISSN, string email, string designation, string journalName,uint256 publisherID, address publisher, bool isApproved);
    event AuthorApproved(address user, uint256 orcidId);
    event EditorApproved(address user, uint256 orcidId);
    event ReviewerApproved(address user, uint256 orcidId);
    event PublisherApproved(address uesr, uint256 publisherID);

    enum Role{
    USER,
    ADMIN,
    AUTHOR,
    EDITOR,
    REVIEWER,
    PUBLISHER
    }

    // single user can have many roles. reviewer can act as an author.
    // reviewer can't be an editor.

    Role defaultChoice = Role.USER;

    mapping(address => Role) role;
    mapping(address => mapping(uint256 => Authors)) public getAuthorDetails;
    mapping(address => mapping(uint256 => Editors)) public getEditorDetails;
    mapping(address => mapping(uint256 => Reviewers)) public getReviewerDetails;
    mapping(address => mapping(uint256 => Publishers)) public getPublisherDetails;
    mapping(address => mapping(uint256 => Papers)) public getPaperDetails;
    mapping(uint256 => Papers) public getPaperDetailsByPaperID;
    mapping(address => mapping(uint256=> string)) public screenerRemarks;
    mapping(uint256 => PaperReview[]) public reviews;
 
    modifier onlyAdmin(){
        require(role[msg.sender] == Role.ADMIN);
        admin = msg.sender;
        _;
    }

    modifier onlyApplier(address user){
        require(user == msg.sender, "NOT USER ADDRESS");
        _;
    }

    modifier onlyAuthor(address author, uint256 orcidId){
        require(getAuthorDetails[author][orcidId].isApproved == true, "INVALID AUTHOR");
        require(role[author] == Role.AUTHOR, "INVALID ROLE");
        _;
    }

    modifier onlyEditor(address editor, uint256 orcidId){
        require(getEditorDetails[editor][orcidId].isApproved == true, "INVALID AUTHOR");
        require(role[editor] == Role.EDITOR, "INVALID ROLE");
        _;
    }

    modifier onlyReviewer(address reviewer, uint256 orcidId){
        require(getReviewerDetails[reviewer][orcidId].isApproved == true, "INVALID REVIEWER");
        require(role[reviewer] == Role.REVIEWER, "INVALID ROLE");
        _;
    }

    constructor(){
        role[msg.sender] = Role.ADMIN;
        admin = msg.sender ;
    }

    function getUserRole(address user) external view returns(Role){
        return role[user];
    }

    function applyForAuthorRole(string memory firstName, string memory lastName, string memory designation, string memory affiliation, string memory city, string memory email, uint256 phNo, address user, uint256 orcidID) external returns(bool authorCreated){

        Authors memory auth = Authors({
            firstName: firstName,
            lastName: lastName,
            designation: designation,
            affiliation: affiliation,
            city: city,
            email: email,
            phNo: phNo,
            author: user,
            ORCIDID: orcidID,
            isApproved: false
        });

        getAuthorDetails[user][orcidID] = auth;

        role[user] = Role.AUTHOR;        

        authorCreated = true;

        emit AuthorCreated(firstName, lastName, designation, affiliation, city, email, phNo, user, orcidID);

        return authorCreated;

    }

    function applyForEditorRole(string memory firstName, string memory lastName, string memory designation, string memory affiliation, string memory city, string memory email, uint256 phNo, address user, uint256 orcidID) external  returns(bool editorCreated){

        require(role[user] != Role.REVIEWER, "Invalid Role");

        Editors memory edit = Editors({
            firstName: firstName,
            lastName: lastName,
            designation: designation,
            affiliation: affiliation,
            city: city,
            email: email,
            phNo: phNo,
            editor: user,
            ORCIDID: orcidID,
            isApproved: false
        });

        getEditorDetails[user][orcidID] = edit;

        role[user] = Role.EDITOR;        

        editorCreated = true;

        emit EditorCreated(firstName, lastName, designation, affiliation, city, email, phNo, user, orcidID);

        return editorCreated;

    }

    function applyForReviewerRole(string memory firstName, string memory lastName, string memory designation, string memory affiliation, string memory city, string memory email, uint256 phNo, address user, uint256 orcidID) external returns(bool reviewerCreated){
        require(role[user] != Role.EDITOR, "Invalid Role");

        Reviewers memory review = Reviewers({
            firstName: firstName,
            lastName: lastName,
            designation: designation,
            affiliation: affiliation,
            city: city,
            email: email,
            phNo: phNo,
            reviewer: user,
            ORCIDID: orcidID,
            isApproved: false
        });

        getReviewerDetails[user][orcidID] = review;

        role[user] = Role.REVIEWER;        

        reviewerCreated = true;

        emit ReviewerCreated(firstName, lastName, designation, affiliation, city, email, phNo, user, orcidID);

        return reviewerCreated;

    }

    function applyForPublisherRole(string[] memory publisherInfo, uint256 phNo, uint256 ISSN, string memory email, string memory designation, string memory journalName, address user, uint256 publisherID)external returns(bool publisherCreated){

        Publishers memory publisher = Publishers({
            publisherInfo: publisherInfo,
            phNo: phNo,
            ISSN: ISSN,
            email: email,
            designation: designation,
            journalName: journalName,
            publisherID: publisherID,
            publisher: user,
            isApproved: false
        });

        getPublisherDetails[user][publisherID] = publisher;

        role[user] = Role.PUBLISHER;  

        publisherCreated = true;

        emit PublisherCreated(publisherInfo, phNo, ISSN, email, designation, journalName, publisherID, user, true);

    }

    function approveAuthor(address user, uint256 orcidId) external onlyAdmin returns(bool authorApproved){

        require(role[user] == Role.AUTHOR, "BB5");

        getAuthorDetails[user][orcidId].isApproved =  true;

        authors.push(getAuthorDetails[user][orcidId]);

        authorApproved = true;

        emit AuthorApproved(user, orcidId);

    }

    function approveEditor(address user, uint256 orcidId) external onlyAdmin returns(bool editorApproved){

        require(role[user] == Role.EDITOR, "BB6");

        getEditorDetails[user][orcidId].isApproved =  true;

        editors.push(getEditorDetails[user][orcidId]);

        editorApproved = true;

        emit EditorApproved(user, orcidId);

    }


    function approveReviewer(address user, uint256 orcidId) external onlyAdmin returns(bool reviewerApproved){

        require(role[user] == Role.REVIEWER, "INVALID ROLE");

        getReviewerDetails[user][orcidId].isApproved =  true;

        reviewers.push(getReviewerDetails[user][orcidId]);

        reviewerApproved = true;

        emit ReviewerApproved(user, orcidId);

    }

    function approvePublisher(address user, uint256 publisherID) external onlyAdmin returns(bool reviewerApproved){

        require(role[user] == Role.PUBLISHER, "INVALID ROLE");

        getPublisherDetails[user][publisherID].isApproved =  true;

        publishers.push(getPublisherDetails[user][publisherID]);

        reviewerApproved = true;

        emit PublisherApproved(user, publisherID);

    }

    function createPaper(uint256 paperID, uint256 orcidID, address paperScreener, address paperCreator, uint256 paperCreatedAt) external onlyAuthor(paperCreator, orcidID) returns(bool paperCreated){

        Papers memory paper = Papers({
        URL: "www.google.com",
        paperID: paperID,
        paperCreator: paperCreator,
        paperScreener: paperScreener,
        isPaperValid: false,
        isPaperScreened:false,
        isPaperReviewed: false,
        paperCreatedAt: paperCreatedAt,
        submittedForScreening: false,
        isPaperApproved: true
        });

        getPaperDetails[paperCreator][paperID] = paper;

        paperCreated = true;

    }

    function updatePaper(string memory URL, uint256 paperID, uint256 orcidID, address paperScreener, address paperCreator, uint256 paperCreatedAt) external onlyAuthor(paperCreator, orcidID) returns(bool paperUpdated){

        // Papers memory paper = getPaperDetails[paperCreator][paperID];

        getPaperDetails[paperCreator][paperID].URL = URL;
        getPaperDetails[paperCreator][paperID].paperID =  paperID;
        getPaperDetails[paperCreator][paperID].paperCreator = paperCreator;
        getPaperDetails[paperCreator][paperID].paperScreener = paperScreener;
        getPaperDetails[paperCreator][paperID].isPaperValid = false;
        getPaperDetails[paperCreator][paperID].paperCreatedAt = paperCreatedAt;
        getPaperDetails[paperCreator][paperID].submittedForScreening = false;
        getPaperDetails[paperCreator][paperID].isPaperApproved = false;

        return paperUpdated = true;
    }

    function submitPaperForScreening(address paperCreator, uint256 orcidID, uint256 paperID) external  onlyAuthor(paperCreator, orcidID) returns(bool paperSubmittedForScreening){

        require(getPaperDetails[paperCreator][paperID].isPaperValid == false && getPaperDetails[paperCreator][paperID].submittedForScreening == false);

        getPaperDetails[paperCreator][paperID].submittedForScreening = true;

        paperSubmittedForScreening = true;

    }

    function screenPaper(address paperCreater, uint256 orcidId, uint256 paperID,string memory remarks, bool isPaperAccepted) external onlyEditor(paperCreater, orcidId) returns(bool paperAccepted){

        require(paperCreater != address(0) && paperID != 0);

        require(getPaperDetails[paperCreater][paperID].submittedForScreening == true, "Paper not submitted for screening~");

        screenerRemarks[paperCreater][paperID] = remarks;

        getPaperDetails[paperCreater][paperID].isPaperScreened = isPaperAccepted;

        if(isPaperAccepted == true){
            return paperAccepted = true;
        }
        else{
            return paperAccepted = false;
        }

    }

    function getPaper(uint256 paperID, address author) external view returns(Papers memory paperByAuthor, Papers memory paperByPaperID){
        
        paperByAuthor = getPaperDetails[author][paperID];
        
        paperByPaperID = getPaperDetailsByPaperID[paperID];

        return (paperByAuthor, paperByPaperID);
    }

    function reviewPaper(address reviewer, uint256 orcidId, uint256 paperID, string memory remarks, bool isPaperAproved) external onlyReviewer(reviewer, orcidId) returns(bool paperReviewed){
        
        require(getPaperDetailsByPaperID[paperID].isPaperScreened ==  true, "Paper NOT SCREENED!");
        
        require(getAuthorDetails[reviewer][orcidId].ORCIDID != getReviewerDetails[reviewer][orcidId].ORCIDID, "SAME AUTHOR AND REVIEWER!");
        
        require(reviews[paperID].length < 5, "ALREADY REVIEW PROCESS IS DONE!");
        
        PaperReview memory reviewed = PaperReview({
            paperID: paperID,
            reviewer: reviewer,
            remarks: remarks,
            isApproved: isPaperAproved
        });

        paperReview.push(reviewed);

        paperReviewed = true;
        
        return paperReviewed;

    }

    function getAllReviews(uint256 paperID) external view returns(PaperReview[] memory p, uint256 totalReviews){
        
        p = reviews[paperID];

        totalReviews = reviews[paperID].length;

        return (p, totalReviews);
    }

    function approvePaper(address reviewer, uint256 orcidId, uint256 paperID, uint8 totalApprovals) external onlyReviewer(reviewer, orcidId) returns(bool paperApproved){
        
        if(reviews[paperID].length == 5 && totalApprovals >=3){

        getPaperDetailsByPaperID[paperID].isPaperApproved = true;

        paperApproved = true;

        return paperApproved;

        }
        else{
            
            paperApproved = false;

            return paperApproved;

        }

    }

}