import React from 'react';
import './App.css';
import QuestionsTable from './components/QuestionTable';
import CreateQuestion from './components/CreateQuestion';
import EditQuestion from './components/EditQuestion';

function App() {

  // question count for all questions, and sub category
  const [questionsCount, setQuestionsCount] = React.useState({
    totalQuestions: 0
  })
  const [formData, setFormData] = React.useState({
      question:"",
      questionType:"",
      correctAnswer:"",
      choices: {
        choiceOne:"",
        choiceTwo:"",
        choiceThree:""
      },
      explanation: ""     
  })
  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const [showEditModal, setShowEditModal] = React.useState(false);
  const [listOfQuestions, setListOfQuestions] = React.useState([{}]);
  const [isUpdateUI, setIsUpdateUI] = React.useState(false);
  const [questionToEdit, setQuestionToEdit] = React.useState({})

  React.useEffect(()=>{

    async function getQuestions(){
      const response = await fetch("http://localhost:5000/questions")
      if (!response.ok) {
        const message = `An error occured: ${response.statusText}`;
        window.alert(message);
        return;
      }

      const questions = await response.json();

      setQuestionsCount((prev)=>{
        return {...prev, totalQuestions: Object.keys(questions).length}
      })

      setListOfQuestions(questions)
    }
    getQuestions()

    return
  }, [isUpdateUI])  

  function toogleCreateQuestion() {
    setShowCreateModal(showCreateModal ? false:true)
  }

  function openEditQuestion(id) {
    async function fetchData() {
            
      const response = await fetch(`http://localhost:5000/question/${id}`);

      if (!response.ok) {
        const message = `An error has occured: ${response.statusText}`;
        window.alert(message);
        return;
      }
      const record = await response.json();

      if (!record) {
        window.alert(`Record with id ${id} not found`);
        return;
      }
      setQuestionToEdit(record)
      setShowEditModal(true)
    }
    fetchData();
  }

  function closeEditQuestion() {
    setQuestionToEdit({})
    setShowEditModal(false)
  }
  // prepares the question data for new question when creating
  function changeFormData(event) {
    const name = event.target.name
    const value = event.target.value
    
    if(name === "choiceOne" || name === "choiceTwo" || name === "choiceThree"){
      setFormData((prev)=>{
        return{...prev, choices:{...prev.choices, [name]:value}}
      })
    }else{
      setFormData((prev)=>{
        return{...prev, [name]:value}
      })
    }
  }

  function formatFormData(event) {
    const name = event.target.name
    const value = event.target.value.trim()
    
    if(name === "choiceOne" || name === "choiceTwo" || name === "choiceThree"){
      setFormData((prev)=>{
        return{...prev, choices:{...prev.choices, [name]:value}}
      })
    }else{
      setFormData((prev)=>{
        return{...prev, [name]:value}
      })
    }
  }

  function updateUI(){
    setIsUpdateUI(isUpdateUI ? false: true)
  }

  async function hasQuestionDuplicate(question) {
    const response = await fetch(`http://localhost:5000/question/find/${question}`);

      if (!response.ok) {
        const message = `An error has occured: ${response.statusText}`;
        window.alert(message);
        return;
      }
      const record = await response.json();

      if (!record) {
        return false
      }else{
        return true
      }
  }

  async function addQuestion(event) {
    event.preventDefault()

// When a post request is sent to the create url, we'll add a new record to the database.
      const newQuestion = { ...formData };
      const isQuestionExist = await hasQuestionDuplicate(newQuestion.question)

      if(isQuestionExist === true){
        alert("Erro: Question already exists")
      }else{
        console.log("You may now create this question")
        // insert new question if there's no empty string in object properties
        if(hasEmptyString(newQuestion) !== true) {
          await fetch("http://localhost:5000/question/add", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newQuestion),
          })
          .catch(error => {
            window.alert(error);
            return;
          });
      
          // clear inputs in create question modal
          setFormData({
            question:"",
            questionType:"",
            correctAnswer:"",
            choices: {
              choiceOne:"",
              choiceTwo:"",
              choiceThree:""
            },
            explanation: ""
          });
      
          updateUI()
      
          alert("new question added")
        }else{
          alert("Error: Can't create question, please fill-out all fields in form ")
        }
      }
  }

  async function deleteQuestion(id) {

    // eslint-disable-next-line no-restricted-globals
    const confirmation = confirm("Do you want to delete this?")
    
    if(confirmation === true){
      await fetch(`http://localhost:5000/question/delete/${id}`, {
        method: "DELETE"
      });
      alert("question deleted");
      updateUI()
    }
  }

  /*checks if the object property has an empty string
  * it also checks the object properties inside an object properties. */
  function hasEmptyString(dataObject){
    const hasEmptyProperty = []

    // check each object property if they have empty string.
    for (const [, value] of Object.entries(dataObject)) {
    // if property is an object then check its property also if they have empty string.
      if(typeof value === "object"){ 
        const object = value
        for (const [, value] of Object.entries(object)) {
          if(value === ""){
            hasEmptyProperty.push(true)
          }else{
            hasEmptyProperty.push(false)
          }
        } 
      }else{
        if(value === ""){
          hasEmptyProperty.push(true)
        }else{
          hasEmptyProperty.push(false)
        }
      }
    }
  
    if(hasEmptyProperty.includes(true) === true){
      return true
    }else{
      return false
    }
  }


  return (
    <div className="App">
      <main>
        <div className="main-container">
          <div className="total-question-card card">
              <h4>Total Question</h4>
              <h2>{questionsCount.totalQuestions}</h2>
          </div>
          <button onClick={toogleCreateQuestion}>
            Create Question
          </button>
            { showCreateModal && <CreateQuestion 
              toogleClose={toogleCreateQuestion} 
              handleChange={changeFormData}
              onSubmit={addQuestion}
              formatFormData={formatFormData}
              value={formData}
              
              /> }
            {showEditModal && <EditQuestion 
              closeEditQuestion={closeEditQuestion}
              question={questionToEdit}
              updateUI={updateUI}
              questionDuplicate={hasQuestionDuplicate}
              />}
          <div className='table-container'>
            {questionsCount.totalQuestions > 0 ? 
            <QuestionsTable questionsData={listOfQuestions} 
                openEditQuestion={openEditQuestion}
                handleDelete={deleteQuestion}/> : <h3>This looks empty, Start making question now.</h3>}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
