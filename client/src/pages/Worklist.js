// ------ Dependencies
import React, { Component } from "react";
import API from "../utils/API";
import { Row, Col, Container } from "../components/Grid";
import WorklistComponent from "../components/Worklist";
import FolderComponent from "../components/Folder";

// ------ Main
class Worklist extends Component {
    // ------ State contains an array of patient in db
    state = {
        temp: [],
        patients: [],
        patients_filtered: [],
        folders:[],
        searchTerm: "",
        newFolder: "",
        newPatientFirst: "",
        newPatientLast: "",
        modalShow: false,
        setModalShow: false,
        comment: "",
        newPatientImgURL: "",
        newPatientComment: ""
    };

    // ------ Handles modal new patient create input
    handleNewPatientFirst = event => {
        this.setState({ newPatientFirst: event.target.value });
    }

    handleNewPatientLast = event => {
        this.setState({ newPatientLast: event.target.value });
    }

    handleComment = event => {
        this.setState({ comment: event.target.value });
    }

    handleNewPatientImgURL = event => {
        this.setState({ newPatientImgURL: event.target.value });
    }

    handleNewPatientComment = event => {
        this.setState({ newPatientComment: event.target.value });
    }

    // ------ Handles new patient save button
    handleSave = event => {
        event.preventDefault();
        
        let newPatient = {
            lastName: this.state.newPatientLast,
            firstName: this.state.newPatientFirst,
            imageURL: this.state.newPatientImgURL,
            note: this.state.newPatientComment
        };

        API.createPatient(newPatient)
            .then(this.grabPatients())
            .catch(err => console.log(err));
    }

    handleSaveComment = event => {
        event.preventDefault();

        let patientID = event.target.id;
        console.log(patientID);

        let newComment = { note: this.state.comment };
        console.log(newComment);

        API.updatePatientComment(patientID, newComment)
            .then(this.grabPatients())
            .catch(err => console.log(err));
    }

    // ------ Render patients from db to state as soon as page loads
    componentDidMount() {
        // ------ Retrieve data and set state
        this.grabPatients();
        this.grabFolders();
    }

    // ------ grabPatients
    grabPatients() {
        API.getPatients()
            .then(res => this.setState({ 
                patients: res.data,
                patients_filtered: res.data
            }))
            .catch(err => console.log(err));
    }

    // ------ grab patient by id
    grab1Patient(id) {
        API.getPatient(id)
            .then(res => this.state.temp.push(res.data))
            .catch(err => console.log(err));
    }

    // ------ grabFolders
    grabFolders() {
        API.getFolders()
            .then(res => this.setState({
                folders: res.data
            }))
            .catch(err => console.log(err));
    }

    // ------ Handles user input for Searching Patient Name
    handleOnChange = event => {
        // ------ Set search 
        let searchTerm = event.target.value;
        console.log(searchTerm);
        this.setState( { searchTerm });
        // ------
        if (searchTerm === "") {
            this.grabPatients();
        } else {
            let filtered = this.state.patients.filter(function(patient) {
                let fullName = `${patient.firstName}${patient.lastName}`;
                if(fullName.toLowerCase().indexOf(searchTerm) === -1) {
                    return false;
                }
                return true;
            });
            console.log(filtered);
            console.log(this.state.patients);
            console.log(this.state.patients_filtered);
            this.setState({ patients_filtered: filtered});
        }
    }

    // ------ Handles user input tracking of new folder
    handleNewFolder = event => {
        let newFolder = event.target.value;
        console.log(newFolder);
        this.setState({ newFolder });
    }

    // ------ Create new folder -> db
    handleCreateFolder = event => {
        event.preventDefault();

        let folder = {
            folderName: this.state.newFolder,
            patients: []
        };

        API.createFolder(folder)
            .then(this.grabFolders())
            .catch(err => console.log(err.response))
    }

    // ------ Handle folder onClick filtering
    folderFilter = event => {
        event.preventDefault();
        
        const folder_id = event.target.key || event.target.id;
        if(folder_id === "all") {
            this.grabPatients();
        } else {
            let filtered = this.state.folders.filter(function(folder) {
                if(folder._id === folder_id) {
                    return true;
                }
                return false;
            })
            console.log(filtered[0]);
            console.log(filtered[0].patients);
            let folderPatients = filtered[0].patients;

            let further_filter = this.state.patients.filter(function(patient) {
                return folderPatients.indexOf(patient._id) > -1;
            })

            this.setState({ patients_filtered: further_filter });
        }
    }

    deleteFolder = event => {
        event.preventDefault();
        console.log("Clicked");

        let folderID = event.target.id;
        console.log(folderID);

        API.deleteFolder(folderID)
            .then(this.grabFolders())
            .catch(err => console.log(err));
    }

    deletePatient = event => {
        event.preventDefault();
        console.log("Clicked");

        let patientID = event.target.id;
        console.log(patientID);

        API.deletePatient(patientID)
            .then(this.grabPatients())
            .catch(err => console.log(err));
    }

    // ------ When medical file button is clicked
    openFile = event => {
        event.preventDefault();
        console.log("Clicked");
        // window.open("https://www.w3schools.com");
        let patientID = event.target.id;
        console.log(patientID, event.target.id);
        let thePatient = this.state.patients.filter(function(patient) {
            if(patient._id === patientID) {
                return true;
            }
            return false;
        });
        let patientImg = thePatient[0].imageURL;
        console.log(thePatient);
        console.log(patientImg);
        var myWindow = window.open("", "", "width=500,height=550");
        // https://media.springernature.com/original/springer-static/image/art%3A10.1007%2Fs13244-018-0663-9/MediaObjects/13244_2018_663_Fig17_HTML.png
        // https://media.springernature.com/original/springer-static/image/art%3A10.1007%2Fs13244-018-0663-9/MediaObjects/13244_2018_663_Fig1_HTML.png
        myWindow.document.write("<h5>" + thePatient[0].lastName + "</h5>");
        myWindow.document.write("<img width=500px height=500px src=" + patientImg + ">");
    }

    // ------ Drag and drop related
    allowDrop = event => {
        event.preventDefault();
    }

    drag = event => {
        event.dataTransfer.setData("text", event.target.id);
    }

    drop = event => {
        event.preventDefault();
        let data = event.dataTransfer.getData("text");
        let newPatient = { patients: data };
        console.log("patient._id: " + data);
        let folderID = event.target.id;
        console.log("folder._id " + folderID);
        // event.target.appendChild(document.getElementById(data));
        API.updateFolderPatient(folderID, newPatient)
            .then(this.grabFolders())
            .catch(err => console.log(err));
    }

    // ------ Render
    render() {
        return (
            <Container fluid className="container">
                <Row>
                    <Col size="3">
                        <FolderComponent
                            patients={this.state.patients} 
                            grabPatients={this.grabPatients}
                            folders={this.state.folders}
                            handleNewFolder={this.handleNewFolder}
                            handleCreateFolder={this.handleCreateFolder}
                            folderFilter={this.folderFilter}
                            deleteFolder={this.deleteFolder}
                            drop={this.drop}
                            allowDrop={this.allowDrop}
                        />
                    </Col>
                    <Col size="9">
                        <WorklistComponent 
                            patients_filtered={this.state.patients_filtered} 
                            searchTerm={this.state.searchTerm}
                            handleOnChange={this.handleOnChange}
                            handleNewPatientFirst={this.handleNewPatientFirst}
                            handleNewPatientLast={this.handleNewPatientLast}
                            handleNewPatientImgURL={this.handleNewPatientImgURL}
                            handleNewPatientComment={this.handleNewPatientComment}
                            handleSave={this.handleSave}
                            openFile={this.openFile}
                            comment={this.state.comment}
                            handleComment={this.handleComment}
                            handleSaveComment={this.handleSaveComment}
                            newPatientComment={this.state.newPatientComment}
                            newPatientImgURL={this.state.newPatientImgURL}
                            deletePatient={this.deletePatient}
                            drag={this.drag}
                        />
                    </Col>
                </Row>
            </Container>
        )
    }
}

// ------ Export
export default Worklist