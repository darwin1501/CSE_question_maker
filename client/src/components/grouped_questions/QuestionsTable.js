import React from "react";
import BootstrapTable from "react-bootstrap-table-next";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";
import paginationFactory from "react-bootstrap-table2-paginator";


export default function QuestionsTable(props){

    const tableData = props.questionData.questions.map((data)=>{
        return {
            id: data._id,
            questionType: data.questionType,
            question: data.question,
            action: 
            <div style={{display: "flex", justifyContent: "center", alignItems:"center", gap: "15px"}}>
                <p className="btn-in-table">Edit</p>
                <p className="btn-in-table">Delete</p>
                <p className="btn-in-table">Preview</p>
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
        <div>
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