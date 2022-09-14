import React from 'react';
import Checker from '../../utility_module/checker';

export default function EditQuestion(props) {

  let question = null;
  let questionsInQuestionGroup = null
  let selectedQuestion = null

  const questionType = props.type

  if(questionType === "group"){
    questionsInQuestionGroup = props.questionGroup.questions
    selectedQuestion = questionsInQuestionGroup.filter((question)=> question._id === props.questionID)
    question = selectedQuestion[0]
  }else{
    question = props.question
  }

   const [formData, setFormData] =  React.useState(question);
   const [prevQuestion] = React.useState(question);

    async function updateQuestion(event) {
      event.preventDefault();

      const isQuestionExist = await Checker.hasQuestionDuplicate(formData.question);
      let updateThis = null;

      if(questionType === "ungroup") {
        // if question is not modified ignore duplicate checking
        if(prevQuestion.question === formData.question){
          updateThis = true;
        }else{
          if(isQuestionExist === true){
            updateThis = false;
          }else{
            updateThis = true;
          }
        }
  
        if(updateThis === true){
          // This will send a post request to update the data in the database.
          await fetch(`http://localhost:5000/question/update/${formData._id}`, {
            method: "POST",
            body: JSON.stringify(formData),
            headers: {
              'Content-Type': 'application/json'
            },
          });
          alert("Question Updated");
          props.updateUI();
        }else{
          alert("Error: Question Already Exists");
        }
      } else if(questionType === "group") {
        // group update logic


        // get the index of selected question
        const indexOfSelectedQuestion = questionsInQuestionGroup.findIndex( question=> question._id === props.questionID)
        // delete the selected question
        const prevQuestionWithoutSelected = questionsInQuestionGroup.filter((question) => question._id !== props.questionID)

        //logic for inserting replacing object within array
        const insert = (arr, index, ...newItems) => [
          // part of the array before the specified index
          ...arr.slice(0, index),
          // inserted items
          ...newItems,
          // part of the array after the specified index
          ...arr.slice(index)
        ]
        // insert the updated question
        const updatedQuestion = insert(prevQuestionWithoutSelected, indexOfSelectedQuestion, formData)
        // update thhe properties of questions
        const updatedQuestionGroup = {...props.questionGroup, questions: updatedQuestion}

        // call an update
        await fetch(`http://localhost:5000/grouped-question/update/${props.questionGroup._id}`, {
          method: "POST",
          body: JSON.stringify(updatedQuestionGroup),
          headers: {
            'Content-Type': 'application/json'
          },
        });
        alert("Question Updated");

        props.updateUI()
      }else{
        alert("Error: can't identify question type")
      }
  }

  function changeFormData(event) {
    const name = event.target.name;
    const value = event.target.value;
    
    if(name === "choiceOne" || name === "choiceTwo" || name === "choiceThree"){
      setFormData((prev)=>{
        return{...prev, choices:{...prev.choices, [name]:value}, dateModified: new Date()};
      })
    }else{
      setFormData((prev)=>{
        return{...prev, [name]:value, dateModified: new Date()};
      })
    }
  }

  function formatFormData(event) {
    const name = event.target.name;
    const value = event.target.value.trim();
    
    if(name === "choiceOne" || name === "choiceTwo" || name === "choiceThree"){
      setFormData((prev)=>{
        return{...prev, choices:{...prev.choices, [name]:value}};
      });
    }else{
      setFormData((prev)=>{
        return{...prev, [name]:value};
      });
    }
  }

  

    return(
        <div>
            <div className="modal-container">
                    <div className="card-modal-content">
                    <div style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        alignItems: "center"
                    }}>
                        <button onClick={()=>{props.handleClose()}}>
                            x
                        </button>
                    </div>
                    <h4 style={{textAlign: "center", fontSize: "20px"}}>
                        Edit Question
                    </h4>
                    <form onSubmit={updateQuestion}>
                        { questionType === "ungroup" && 
                         <select name="questionType" value={formData.questionType} onChange={changeFormData} onBlur={formatFormData}>
                            <option value="">---Select Category---</option>
                            <option value="Numerical">Numerical</option>
                            <option value="Analitical">Analitical</option>
                            <option value="Verbal">Verbal</option>
                            <option value="Philippine Constitution">Philippine Constitution</option>
                            <option value="RA 6713">RA 6713</option>
                            <option value="Environment management 203 and protection">
                                Environment management 203
                                and protection
                            </option>
                        </select> 
                        }
                        <label>
                            Question
                            <textarea name="question" value={formData.question} onChange={changeFormData} onBlur={formatFormData}/>
                        </label>
                        <label>
                            Correct Answer
                            <input type="text" name="correctAnswer" value={formData.correctAnswer} onChange={changeFormData} onBlur={formatFormData}/>
                        </label>
                        <label>
                            Choice One
                            <input type="text" name="choiceOne" value={formData.choices.choiceOne} onChange={changeFormData} onBlur={formatFormData}/>
                        </label>
                        <label>
                            Choice Two
                            <input type="text" name="choiceTwo" value={formData.choices.choiceTwo} onChange={changeFormData} onBlur={formatFormData}/>
                        </label>
                        <label>
                            Choice Three
                            <input type="text" name="choiceThree" value={formData.choices.choiceThree} onChange={changeFormData} onBlur={formatFormData}/>
                        </label>
                        <label>
                            Explantion
                            <textarea name="explanation" value={formData.explanation} onChange={changeFormData} onBlur={formatFormData}/>
                        </label>
                        <input type="submit" value="Update" />
                    </form>
                    </div>
            </div>
        </div>
        
    );
}