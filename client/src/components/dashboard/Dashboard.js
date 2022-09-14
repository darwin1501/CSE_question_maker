import React from "react";
import DashboardStyle from "./DashboardStyle.module.css"

export default function Dashboard(props) {
    return (
        <div className={DashboardStyle.container} style={{display: "flex", alignItems: "flex-start", gap: "20px"}}>
            <div className={DashboardStyle.total_question_card} style={{width: "250px", textAlign: "center"}}>
                <h4>Total Question</h4>
                <h2>{props.totalQuestions}</h2>
            </div>
            <div className={DashboardStyle.total_question_card} style={{width: "400px"}}>
                <p className={DashboardStyle.bold}>Total Question on Each Categories</p>
                <div className={DashboardStyle.flex}>
                    <p>Numerical:</p> <p className={DashboardStyle.bold}>{props.numerical}</p>
                </div>
                <div className={DashboardStyle.flex}>
                    <p>Analitical:</p> <p className={DashboardStyle.bold}>{props.analitical}</p>
                </div>
                <div className={DashboardStyle.flex}>
                    <p>Verbal:</p> <p className={DashboardStyle.bold}>{props.verbal}</p>
                </div>
                <div className={DashboardStyle.flex}>
                    <p>Philippine Constitution:</p> <p className={DashboardStyle.bold}>{props.philCon}</p>
                </div>
                <div className={DashboardStyle.flex}>
                    <p>(RA 6713)</p> <p className={DashboardStyle.bold}>{props.ra6713}</p>
                </div>
                <div className={DashboardStyle.flex}>
                    <p>Environment management 203 and protection</p> 
                <p className={DashboardStyle.bold}>{props.envProtection}</p>
                </div>
            </div>
        </div>
    )
}