import React from "react";
import QuestionsTable from "./QuestionsTable";

export default function QuestionInGroupViewer(props){
    return(
        <div className="modal-container">
            <div className="card-modal-content card-lg">
                <div style={{display: "flex", justifyContent: "flex-end"}}>
                    <div className="flex flex-end">
                        <button className="btn-close" onClick={()=>{props.handleClose()}}></button>
                    </div>
                </div>
                <button className="btn" onClick={()=>{props.openCreateQuestion()}}>
                    Add Question
                </button>
                <QuestionsTable 
                questionData={props.questionGroup}
                openEditQuestion={props.openEditQuestion}
                updateUI={props.updateUI}
                updateTableUI={props.updateTableUI}
                />
            </div>
        </div>
    )
}