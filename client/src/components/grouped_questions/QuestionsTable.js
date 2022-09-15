import React from "react";
import BootstrapTable from "react-bootstrap-table-next";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";
import paginationFactory from "react-bootstrap-table2-paginator";
import { Link } from "react-router-dom";


export default function QuestionsTable(props){

    async function deleteAQuestion(id){
        // eslint-disable-next-line no-restricted-globals
        const deleteThis = confirm("Do you want to delete this?")
        
        if(deleteThis === true){
            // remove a question
            const updatedQuestion = props.questionData.questions.filter((question)=> question._id !== id)
            const questionData = {...props.questionData, questions: updatedQuestion}

            // call an update
        await fetch(`http://localhost:5000/grouped-question/update/${props.questionData._id}`, {
            method: "POST",
            body: JSON.stringify(questionData),
            headers: {
              'Content-Type': 'application/json'
            },
          });
          alert("Question Deleted");
          props.updateUI();
          props.updateTableUI()
        }
    }

    const tableData = props.questionData.questions.map((data)=>{
        return {
            id: data._id,
            questionType: data.questionType,
            question: data.question,
            action: 
            <div style={{display: "flex", justifyContent: "center", alignItems:"center", gap: "15px"}}>
                <p className="btn-in-table" onClick={()=>{props.openEditQuestion(data._id)}}>Edit</p>
                <p className="btn-in-table" onClick={()=>{deleteAQuestion(data._id)}}>Delete</p>
                <Link 
                    to={`preview/${props.questionData._id},${'group'},${data._id}`} 
                    target="_blank">
                    <p className="btn-in-table">Preview</p>
                </Link>
            </div>
        }
    })

    const columnStyle = {
        maxWidth: '400px',
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        fontWeight: 'bold'
    }

    const columns = [
        {dataField: "id", text: "ID"},
        {dataField: "question", text: "Question",
        style: columnStyle},
        {dataField: "questionType", text: "Question Type"},
        {dataField: "action", text: "Action"}
    ]


    return(
        <div style={{marginTop: "40px"}}>
            { <BootstrapTable 
                keyField="id" 
                data={ tableData } 
                columns={ columns } 
                pagination={ paginationFactory({
                    page: 1,
                    sizePerPage: 4,
                    lastPageText: '>>',
                    firstPageText: '<<',
                    nextPageText: '>',
                    prePageText: '<',
                    showTotal: true,
                    alwaysShowAllBtns: true,
                    onPageChange: function (page, sizePerPage) {
                    console.log('page', page);
                    console.log('sizePerPage', sizePerPage);
                    },
                    onSizePerPageChange: function (page, sizePerPage) {
                    console.log('page', page);
                    console.log('sizePerPage', sizePerPage);
                    }
                }) }
            />}
        </div>
    )
}