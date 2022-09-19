import React from 'react';
import Checker from '../../utility_module/checker';

export default function EditQuestion(props) {

  const [hasExplanation, setHasExplanation] = React.useState(false);
  let question = null;
  let questionsInQuestionGroup = null
  let selectedQuestion = null
  const questionType = props.type

  React.useEffect(()=>{
    // logic for displaying explanation for group and ungroup question
    if(questionType === "ungroup"){
      if(props.question.explanation ==="None"){
        setHasExplanation(false)
      }else{
        setHasExplanation(true)
      }
    }else{
      const question = questionsInQuestionGroup.filter( question=> question._id === props.questionID)[0]
      if(question.explanation === "None"){
        setHasExplanation(false)
      }else{
        setHasExplanation(true)
      }
    }
  },[])

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
      let copyOfFormData = { ...formData }

      if(!hasExplanation){
        copyOfFormData = { ...formData, explanation: "None" }
      }

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
          body: JSON.stringify(copyOfFormData),
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
      const updatedQuestion = insert(prevQuestionWithoutSelected, indexOfSelectedQuestion, copyOfFormData)
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

  function handleCheckbox(){
    setHasExplanation(!hasExplanation)
  }
  
    return(
        <div>
            <div className="modal-container">
                    <div className="card-modal-content card-md">
                    <div style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        alignItems: "center"
                    }}>
                        <div className="flex flex-end">
                          <button className="btn-close"  onClick={()=>{props.handleClose()}}>
                          </button>
                        </div>
                    </div>
                    <h4 style={{textAlign: "center", fontSize: "20px"}}>
                        Edit Question
                    </h4>
                    <form onSubmit={updateQuestion}>
                      <div className="flex flex-center gap-sm">
                        <div>
                            {props.type === "ungroup" && 
                              <div style={{marginBottom: "10px"}}>
                                <select
                                name='questionType'
                                value={formData.questionType}
                                onChange={changeFormData}
                                onBlur={formatFormData}
                                required
                                >
                                    <option value=''>---Select Category---</option>
                                    <option value='Numerical'>Numerical</option>
                                    <option value='Analytical'>Analytical</option>
                                    <option value='Verbal'>Verbal</option>
                                    <option value='Philippine Constitution'>
                                      Philippine Constitution
                                    </option>
                                    <option value='RA 6713'>RA 6713</option>
                                    <option
                                      value='Environment management and protection'
                                      >
                                      Environment management and protection
                                    </option>
                                    <option
                                      value="Peace and Human Rights Issues and Concepts"
                                      >
                                      Peace and Human Rights Issues and Concepts
                                    </option>
                                </select>
                              </div>
                            }
                            <select name="contributor" value={formData.contributor} onChange={changeFormData}>
                              <option value="">Select Contributor</option>
                              <option value="Unknown">Unknown</option>
                              <option value="Leonalyn Mutia Tayone">Leonalyn Mutia-Tayone</option>
                            </select>
                            <label className="flex flex-vertical">
                              Correct Answer
                              <input
                                className="text-input"
                                type='text'
                                name='correctAnswer'
                                value={formData.correctAnswer}
                                onChange={changeFormData}
                                onBlur={formatFormData}
                                required
                              />
                            </label>
                            
                            <label className="flex flex-vertical">
                              Choice One
                              <input
                                className="text-input"
                                type='text'
                                name='choiceOne'
                                value={formData.choices.choiceOne}
                                onChange={changeFormData}
                                onBlur={formatFormData}
                                required
                              />
                            </label>
                
                            <label className="flex flex-vertical">
                              Choice Two
                              <input
                                className="text-input"
                                type='text'
                                name='choiceTwo'
                                value={formData.choices.choiceTwo}
                                onChange={changeFormData}
                                onBlur={formatFormData}
                              />
                            </label>
                
                            <label className="flex flex-vertical">
                              Choice Three
                              <input
                                className="text-input"
                                type='text'
                                name='choiceThree'
                                value={formData.choices.choiceThree}
                                onChange={changeFormData}
                                onBlur={formatFormData}
                                required
                              />
                            </label>
                        </div>
              
                          <div>
                            <label className="flex flex-vertical">
                              Question
                              <textarea
                                value={formData.question}
                                name='question'
                                onChange={changeFormData}
                                onBlur={formatFormData}
                                required
                              />
                            </label>
                            <label style={{margin: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
                              Add Explanation?
                              <input type="checkbox" 
                                      name="addExplanation" 
                                      checked={hasExplanation} 
                                      onChange={handleCheckbox}
                                      style={{padding: "40px", width: "25px", height: "25px"}}/>
                            </label>
                            {
                              hasExplanation &&
                              <label className="flex flex-vertical">
                                Explantion
                                <textarea
                                  value={formData.explanation}
                                  name='explanation'
                                  onChange={changeFormData}
                                  onBlur={formatFormData}
                                  required
                                />
                              </label>
                            }
                          </div>
                      </div>
                      <div className="flex flex-end" style={{marginTop: "20px"}}>
                          <input className='btn' type="submit" value="Update" />
                      </div>
                    </form>
                    </div>
            </div>
        </div>
        
    );
}