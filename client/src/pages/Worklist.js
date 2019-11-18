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
        patients: []
    };

    // ------ Render patients from db to state as soon as page loads
    componentDidMount() {
        // ------ Retrieve data and set state
        API.getPatients()
            .then(res => this.setState({ patients: res.data }))
            .catch(err => console.log(err))
    }

    // ------ Render
    render() {
        return (
            <Container fluid className="container">
                <Row>
                    <Col size="3">
                        <FolderComponent />
                    </Col>
                    <Col size="9">
                        <WorklistComponent patients={this.state.patients} />
                    </Col>
                </Row>
            </Container>
        )
    }
}

// ------ Export
export default Worklist