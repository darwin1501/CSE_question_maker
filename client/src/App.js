import React from 'react';
import './App.css';
import QuestionsTable from './components/QuestionTable';
import CreateQuestion from './components/CreateQuestion';

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
// state for deciding wethere to show or hide modal to create question
  const [showCreate, setShowCreate] = React.useState(false)

  const [listOfQuestions, setListOfQuestions] = React.useState([{}])

  const [isUpdateUI, setIsUpdateUI] = React.useState(false);

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
    setShowCreate(showCreate ? false:true)
  }

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

  async function addQuestion(event) {
    event.preventDefault()

    // When a post request is sent to the create url, we'll add a new record to the database.
    const newQuestion = { ...formData };

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

    setIsUpdateUI(isUpdateUI ? false: true)

    alert("new question added")
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
            { showCreate && <CreateQuestion 
              toogleClose={toogleCreateQuestion} 
              handleChange={changeFormData}
              onSubmit={addQuestion}
              value={formData}
              /> }
          <div className='table-container'>
            <QuestionsTable questionsData={listOfQuestions}/>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
