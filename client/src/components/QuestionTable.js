import React from "react"
import BootstrapTable from "react-bootstrap-table-next"
import "react-bootstrap-table-next/dist/react-bootstrap-table2.css"
import "bootstrap/dist/css/bootstrap.min.css"
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css"
import paginationFactory from "react-bootstrap-table2-paginator"

export default function questionsTable(props){

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

        const questionList = props.questionsData.map((data)=>{
        const questionDate = new Date(Date.parse(data.dateModified))
        const month = months[questionDate.getMonth()]
        const date = questionDate.getDate()
        const year = questionDate.getFullYear()

        return{
            id: data._id,
            question: data.question,
            questionType: data.questionType,
            dateModified: `${month} ${date}, ${year}`,
            action: 
                <div style={{display: "flex", justifyContent: "center", alignItems:"center", gap: "15px"}}>
                    <p className="btn-in-table" onClick={()=>props.openEditQuestion(data._id)}>Edit</p>
                    <p className="btn-in-table" onClick={()=>props.handleDelete(data._id)}>Delete</p>
                </div>
        }
    })

    // style to hide extra characters in question column in table
    const defaultSorted = [{
        dataField: 'dateModified',
        order: 'desc'
      }];

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
        {
            dataField: "dateModified", 
            text: "Date Modified",
            sort: true,
            sortFunc: (a, b, order) => {
                if (order === "asc") {
                  return Date.parse(a) - Date.parse(b);
                } else if (order === "desc") {
                  return Date.parse(b) - Date.parse(a);
                }
              }
        },
        {dataField: "action", text: "Action"}
    ]

    return(
        <div>
            { <BootstrapTable 
                keyField="id" 
                data={ questionList } 
                columns={ columns } 
                defaultSorted = {defaultSorted}
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