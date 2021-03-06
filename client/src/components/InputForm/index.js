// ------ Dependencies
import React from "react";
import "./style.css";

// ------ Input form
const InputForm = props => {
    return (
        <form>
            <div className="form-group">
                <input 
                    className="col-12 form-control"
                    type="text"
                    name="searchTerm"
                    placeholder="Search Patient Name..."
                    size="50"
                    value={props.searchTerm}
                    onChange={props.handleOnChange}
                />
            </div>
        </form>
    )
}

// ------ Export
export default InputForm