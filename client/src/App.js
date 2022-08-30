import React from 'react';
import './App.css';
import QuestionTable from './components/ungrouped_questions/QuestionTable';
import CreateQuestion from './components/ungrouped_questions/CreateQuestion';
import EditQuestion from './components/ungrouped_questions/EditQuestion';

function App() {
  // question count for all questions, and sub category
  const [questionsCount, setQuestionsCount] = React.useState({
    totalQuestions: 0
  });
  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const [showEditModal, setShowEditModal] = React.useState(false);
  const [listOfQuestions, setListOfQuestions] = React.useState([{}]);
  const [isUpdateUI, setIsUpdateUI] = React.useState(false);
  const [questionToEdit, setQuestionToEdit] = React.useState({});
  const [tableQuestionCount, setTableQuestionCount] = React.useState(0);
  const [changeQuestionToGroup, setChangeQuestionToGroup] = React.useState(false);

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

      setTableQuestionCount(Object.keys(questions).length);

      // sort object here

      setListOfQuestions(questions);
    }
    getQuestions();

    return
  }, [isUpdateUI]);

  function toogleCreateQuestion() {
    setShowCreateModal(showCreateModal ? false:true);
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
      setQuestionToEdit(record);
      setShowEditModal(true);
    }
    fetchData();
  }

  function closeEditQuestion() {
    setQuestionToEdit({});
    setShowEditModal(false);
  }

  function swtichQuestion(){
    setChangeQuestionToGroup(!changeQuestionToGroup);
  }

  function updateUI(){
    setIsUpdateUI(isUpdateUI ? false: true);
  }

  async function findQuestion(event){
    const question = event.target.value;

    if(question !== ""){
      const response = await fetch(`http://localhost:5000/questions/search/${question}`);

      if (!response.ok) {
        const message = `An error has occured: ${response.statusText}`;
        window.alert(message);
        return;
      }

      const record = await response.json();
      const resultCount = Object.keys(record).length;

      if( resultCount > 0){
        setListOfQuestions(record);
        setTableQuestionCount(resultCount);
      }else{
        setTableQuestionCount(0);
      }
    }else{
      updateUI();
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
              toggleClose={toogleCreateQuestion} 
              updateUI={updateUI}
              /> }
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
              updateUI={updateUI}/>}
          <div className='table-container'>
            {
              questionsCount.totalQuestions > 0 && tableQuestionCount > 0? 
              <QuestionTable questionsData={listOfQuestions} 
                openEditQuestion={openEditQuestion}
                updateUI={updateUI}
                // handleDelete={deleteQuestion}
                /> 
                : <h3>No questions to show at this moment</h3>
            }
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;