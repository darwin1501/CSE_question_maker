import React from 'react'
import Checker from '../../utility_module/checker'
import { nanoid } from 'nanoid'

export default function CreateQuestion (props) {
  const [formData, setFormData] = React.useState({
    question: '',
    questionType: '',
    correctAnswer: '',
    choices: {
      choiceOne: '',
      choiceTwo: '',
      choiceThree: ''
    },
    explanation: '',
    dateModified: new Date()
  })

  function formatFormData (event) {
    const name = event.target.name
    const value = event.target.value.trim()

    if (
      name === 'choiceOne' ||
      name === 'choiceTwo' ||
      name === 'choiceThree'
    ) {
      setFormData(prev => {
        return { ...prev, choices: { ...prev.choices, [name]: value } }
      })
    } else {
      setFormData(prev => {
        return { ...prev, [name]: value }
      })
    }
  }

  function changeFormData (event) {
    const name = event.target.name
    const value = event.target.value

    if (
      name === 'choiceOne' ||
      name === 'choiceTwo' ||
      name === 'choiceThree'
    ) {
      setFormData(prev => {
        return {
          ...prev,
          choices: { ...prev.choices, [name]: value },
          dateModified: new Date()
        }
      })
    } else {
      setFormData(prev => {
        return { ...prev, [name]: value, dateModified: new Date() }
      })
    }
  }

  async function addQuestion (event) {
    event.preventDefault()

    // When a post request is sent to the create url, we'll add a new record to the database.
    const newQuestion = { ...formData }
    const isQuestionExist = await Checker.hasQuestionDuplicate(
      newQuestion.question
    )

    if (props.type === 'ungroup') {
      if (isQuestionExist === true) {
        alert('Error: Question already exists')
      } else {
        console.log('You may now create this question')
        // insert new question if there's no empty string in object properties
        if (Checker.hasEmptyString(newQuestion) !== true) {
          await fetch('http://localhost:5000/question/add', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(newQuestion)
          }).catch(error => {
            window.alert(error)
            return
          })

          // clear inputs in create question modal
          setFormData({
            question: '',
            questionType: '',
            correctAnswer: '',
            choices: {
              choiceOne: '',
              choiceTwo: '',
              choiceThree: ''
            },
            explanation: '',
            dateModified: new Date()
          })
          props.updateUI()

          alert('new question added')
        } else {
          alert(
            "Error: Can't create question, please fill-out all fields in form "
          )
        }
      }
    } else if (props.type === 'group') {
        const questionGroup = props.questionGroup
        // add _id property in formData that contains question data
        const newQuestion = {...formData, questionType: props.questionGroup.questionType, _id:nanoid()}
        const updatedQestion = [...questionGroup.questions, newQuestion]
        // copy old questions then add new one.
        const modifiedQuestionGroup = {...questionGroup, questions:updatedQestion}
        
        await fetch(`http://localhost:5000/grouped-question-add-question/add/${questionGroup._id}`, {
            method: "POST",
            body: JSON.stringify(modifiedQuestionGroup),
            headers: {
              'Content-Type': 'application/json'
            },
          });
          alert("New question added to group")
          props.updateUI()
          props.updateTableUI()
    } else {
      alert("Error: Can't identify question type")
    }
  }

  return (
    <div>
      <div className='modal-container bring-to-front'>
        <div className='card-modal-content card-md'>
          <div className="flex flex-end">
            <button className="btn-close" onClick={props.toggleClose}></button>
          </div>
          <h4 style={{ textAlign: 'left', fontSize: '20px', marginBottom: "30px", opacity: "0.8" }}>
            Create a Question
          </h4>
          <form onSubmit={addQuestion}>
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
                          value='Environment management 203 and protection'
                          >
                          Environment management 203 and protection
                        </option>
                    </select>
                  </div>
                }
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
              </div>
           </div>
           
            <div className="flex flex-end" style={{marginTop: "20px"}}>
              <input className='btn' type='submit' value='Create' />
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
