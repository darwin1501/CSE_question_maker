import React from 'react';
import './App.css';
import QuestionsTable from './components/QuestionTable';
import CreateQuestion from './components/CreateQuestion';
import EditQuestion from './components/EditQuestion';
import ungrouped_question from './utility_module/ungrouped_question';

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
      explanation: "",
      dateModified: new Date()   
  })
  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const [showEditModal, setShowEditModal] = React.useState(false);
  const [listOfQuestions, setListOfQuestions] = React.useState([{}]);
  const [isUpdateUI, setIsUpdateUI] = React.useState(false);
  const [questionToEdit, setQuestionToEdit] = React.useState({});
  const [tableQuestionCount, setTableQuestionCount] = React.useState(0);
  const [changeQuestionToGroup, setChangeQuestionToGroup] = React.useState(false)

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

      setTableQuestionCount(Object.keys(questions).length)

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
        return{...prev, choices:{...prev.choices, [name]:value}, dateModified: new Date()}
      })
    }else{
      setFormData((prev)=>{
        return{...prev, [name]:value, dateModified: new Date()}
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

  function swtichQuestion(){
    setChangeQuestionToGroup(!changeQuestionToGroup)
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
        alert("Error: Question already exists")
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
            explanation: "",
            dateModified: new Date()
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

  async function findQuestion(event){
    const question = event.target.value
    if(question !== ""){
      const response = await fetch(`http://localhost:5000/questions/search/${question}`)

      if (!response.ok) {
        const message = `An error has occured: ${response.statusText}`;
        window.alert(message);
        return;
      }

      const record = await response.json();
      const resultCount = Object.keys(record).length

      if( resultCount > 0){
        setListOfQuestions(record)
        setTableQuestionCount(resultCount)
      }else{
        setTableQuestionCount(0)
      }
    }else{
      updateUI()
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
          { 
            changeQuestionToGroup ? 
            <button onClick={toogleCreateQuestion}>
                Create Group Question
            </button>
            :
            <button onClick={toogleCreateQuestion}>
              Create Question
            </button>
          }
          <br></br>
          <br></br>
          {
            changeQuestionToGroup ?
            <input type="text" placeholder="Search a group name"/>  :
            <input type="text" placeholder="Search a question" onInput={findQuestion}/>
          }
            { showCreateModal && <CreateQuestion 
              toogleClose={toogleCreateQuestion} 
              handleChange={changeFormData}
              onSubmit={addQuestion}
              formatFormData={formatFormData}
              value={formData} /> }
            <button onClick={swtichQuestion}>
              Switch to
              {
                changeQuestionToGroup ? ' Ungrouped ' : ' Grouped  '
              }
              Question
            </button>
            {showEditModal && <EditQuestion 
              closeEditQuestion={closeEditQuestion}
              question={questionToEdit}
              updateUI={updateUI}
              questionDuplicate={hasQuestionDuplicate}/>}
          <div className='table-container'>
            {
              questionsCount.totalQuestions > 0 && tableQuestionCount > 0? 
              <QuestionsTable questionsData={listOfQuestions} 
                openEditQuestion={openEditQuestion}
                handleDelete={deleteQuestion}/> 
                : <h3>No questions to show at this moment</h3>
            }
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
