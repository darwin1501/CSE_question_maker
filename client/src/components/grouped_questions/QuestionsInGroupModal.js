import React from "react";

export default function QuestionInGroupViewer(props){
    return(
        <div className="modal-container">
            <div className="card-modal-content-md">
                <div style={{display: "flex", justifyContent: "flex-end"}}>
                    <button onClick={()=>{props.handleClose()}}>X</button>
                </div>
                <button onClick={()=>{props.openCreateQuestion()}}>Add Question</button>
                {/* load table here */}
            </div>
        </div>
    )
}