import React from 'react'

export default function CreateQuestion(props) {

    return(
        <div>
            <div className="create-question-modal">
                <div className="create-question-modal-content">
                    <div style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        alignItems: "center"
                    }}>
                        <button onClick={props.toogleClose}>
                            x
                        </button>
                    </div>
                    <h4 style={{textAlign: "center", fontSize: "20px"}}>
                        Create Question
                    </h4>
                    <form onSubmit={props.onSubmit}>
                        <select name="questionType" value={props.value.questionType} onChange={props.handleChange}>
                            <option value="">---Select Category---</option>
                            <option value="Numerical">Numerical</option>
                            <option value="Analitical">Analitical</option>
                            <option value="Verbal">Verbal</option>
                            <option value="Philippine Constitution">Philippine Constitution</option>
                            <option value="RA 6713">RA 6713</option>
                            <option value="Environment management 203
                                and protection">
                                Environment management 203
                                and protection
                            </option>
                        </select>
                        <label>
                            Question
                            <textarea value={props.value.question} name="question" onChange={props.handleChange}/>
                        </label>
                        <label>
                            Correct Answer
                            <input type="text" name="correctAnswer" value={props.value.correctAnswer} onChange={props.handleChange}/>
                        </label>
                        <label>
                            Choice One
                            <input type="text" name="choiceOne" value={props.value.choices.choiceOne} onChange={props.handleChange}/>
                        </label>
                        <label>
                            Choice Two
                            <input type="text" name="choiceTwo" value={props.value.choices.choiceTwo} onChange={props.handleChange}/>
                        </label>
                        <label>
                            Choice Three
                            <input type="text" name="choiceThree" value={props.value.choices.choiceThree} onChange={props.handleChange}/>
                        </label>
                        <label>
                            Explantion
                            <textarea value={props.value.explanation} name="explanation" onChange={props.handleChange}/>
                        </label>
                        <input type="submit" value="Create" />
                    </form>
                </div>
            </div>
        </div>
    )
}