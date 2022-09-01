import React from "react";
import BootstrapTable from "react-bootstrap-table-next";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";
import paginationFactory from "react-bootstrap-table2-paginator";


export default function GroupedQuestionsTable(props){

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    async function deleteGroupedQuestion(id) {
                // eslint-disable-next-line no-restricted-globals
                const confirmation = confirm("Do you want to delete this?");
                
                if(confirmation === true){
                    await fetch(`http://localhost:5000/grouped-question/delete/${id}`, {
                    method: "DELETE"
                    });
                    alert("question deleted");
                    props.updateUI();
                }
            }

    const tableData = props.questionsData.map((data)=>{
        const questionDate = new Date(Date.parse(data.dateModified));
        const month = months[questionDate.getMonth()];
        const date = questionDate.getDate();
        const year = questionDate.getFullYear();
        return {
            id: data._id,
            groupName: data.groupName,
            questionType: data.questionType,
            referenceType: data.referenceType,
            dateModified: `${month} ${date}, ${year}`,
            action:
                <div style={{display: "flex", justifyContent: "center", alignItems:"center", gap: "15px"}}>
                    <p className="btn-in-table" onClick={()=>{props.openEditQuestion(data._id)}} >Edit</p>
                    <p className="btn-in-table" onClick={()=>{deleteGroupedQuestion(data._id)}}>Delete</p>
                </div>
        }
    })
    
    // const questionList = props.questionsData.map((data)=>{
    //     const questionDate = new Date(Date.parse(data.dateModified));
    //     const month = months[questionDate.getMonth()];
    //     const date = questionDate.getDate();
    //     const year = questionDate.getFullYear();

    //     async function deleteQuestion(id) {
    //         // eslint-disable-next-line no-restricted-globals
    //         const confirmation = confirm("Do you want to delete this?");
            
    //         if(confirmation === true){
    //             await fetch(`http://localhost:5000/question/delete/${id}`, {
    //             method: "DELETE"
    //             });
    //             alert("question deleted");
    //             props.updateUI();
    //         }
    //     }

    //     return{
    //         id: data._id,
    //         question: data.question,
    //         questionType: data.questionType,
    //         dateModified: `${month} ${date}, ${year}`,
    //         action: 
    //             <div style={{display: "flex", justifyContent: "center", alignItems:"center", gap: "15px"}}>
    //                 <p className="btn-in-table" onClick={()=>props.openEditQuestion(data._id)}>Edit</p>
    //                 <p className="btn-in-table" onClick={()=>deleteQuestion(data._id)}>Delete</p>
    //                 <Link 
    //                     to={`preview/${data._id}`} 
    //                     target="_blank">
    //                     <p className="btn-in-table">Preview</p>
    //                 </Link>
    //             </div>
    //     }
    // })

    // // style to hide extra characters in question column in table
    // const defaultSorted = [{
    //     dataField: 'dateModified',
    //     order: 'desc'
    //   }];

    const columnStyle = {
        maxWidth: '400px',
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        fontWeight: 'bold'
    }

    const columns = [
        {dataField: "id", text: "ID"},
        {dataField: "groupName", text: "Group Name",
        style: columnStyle},
        {dataField: "referenceType", text: "Reference Type"},
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
                data={ tableData } 
                columns={ columns } 
                // defaultSorted = {defaultSorted}
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