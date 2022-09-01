import React from 'react';
import './App.css';
import QuestionTable from './components/ungrouped_questions/QuestionTable';
import GroupedQuestionsTable from './components/grouped_questions/GroupedQuestionsTable';
import CreateQuestion from './components/ungrouped_questions/CreateQuestion';
import CreateGroupedQuestion from './components/grouped_questions/CreateGroupedQuestion';
import EditQuestion from './components/ungrouped_questions/EditQuestion';
import EditGroupedQuestion from './components/grouped_questions/EditGroupedQuestion';

function App() {
  // question count for all questions, and sub category
  const [questionsCount, setQuestionsCount] = React.useState({
    totalQuestions: 0
  });
  const [showCreateUngroupedQuestion, setShowCreateUngroupedQuestion] = React.useState(false);
  const [showEditUngroupedQuestion, setShowEditUngroupedQuestion] = React.useState(false);
  const [ungroupedQuestions, setUngroupedQuestion] = React.useState([{}]);
  const [UngroupedTableUiUpdate, setUngroupedTableUiUpdate] = React.useState(false);
  const [ungroupedQuestionToEdit, setUngroupedQuestionToEdit] = React.useState({});
  const [tableUngroupedQuestionCount, setTableUngroupedQuestionCount] = React.useState(0);

  const [showCreateGroupedQuestion, setshowCreateGroupedQuestion] = React.useState(false);
  const [showEditGroupedQuestion, setShowEditGroupedQuestion] = React.useState(false);
  const [groupedQuestionToEdit, setGroupedQuestionToEdit] = React.useState({});
  const [groupedQuestions, setGroupedQuestions] = React.useState([])
  const [GroupTableUiUpdate, setGroupTableUiUpdate] = React.useState(false);
  const [tableGroupQuestionCount, setTableGroupQuestionCount] = React.useState(0);

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

      setTableUngroupedQuestionCount(Object.keys(questions).length);

      // sort object here

      setUngroupedQuestion(questions);
    }
    getQuestions();

    return
  }, [UngroupedTableUiUpdate]);

  React.useEffect(()=>{
    async function getGroupedQuestions(){
      const response = await fetch("http://localhost:5000/grouped-questions")
      if (!response.ok) {
      const message = `An error occured: ${response.statusText}`;
      window.alert(message);
      return;
      }

      const groupedQuestions = await response.json();

      setGroupedQuestions(groupedQuestions);
      setTableGroupQuestionCount(Object.keys(groupedQuestions).length)
  }
      getGroupedQuestions()
  }, [GroupTableUiUpdate])

  function toogleCreateUngroupedQuestion() {
    setShowCreateUngroupedQuestion(showCreateUngroupedQuestion ? false:true);
  }

  function toggleCreateQuestionGroup(){
   setshowCreateGroupedQuestion(showCreateGroupedQuestion ? false:true)
  }

  function openEditUngroupedQuestion(id) {
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
      setUngroupedQuestionToEdit(record);
      setShowEditUngroupedQuestion(true);
    }
    fetchData();
  }

  async function openEditGroupedQuestion(id) {
                
    const response = await fetch(`http://localhost:5000/grouped-question/${id}`);

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
    setGroupedQuestionToEdit(record);
    setShowEditGroupedQuestion(true);
  }

  function closeEditUngroupedQuestion() {
    setUngroupedQuestionToEdit({});
    setShowEditUngroupedQuestion(false);
  }

  function closeEditGroupedQuestion(){
    setGroupedQuestionToEdit({});
    setShowEditGroupedQuestion(false);
  }

  function swtichQuestion(){
    setChangeQuestionToGroup(!changeQuestionToGroup);
  }

  function updateUIonUngroupedTable(){
    setUngroupedTableUiUpdate(UngroupedTableUiUpdate ? false: true);
  }

  function updateUIonGroupedTable(){
    setGroupTableUiUpdate(GroupTableUiUpdate ? false : true);
  }

  function LoadTable(){
    if(changeQuestionToGroup === false){
      return(
          questionsCount.totalQuestions > 0 && tableUngroupedQuestionCount > 0?
          <QuestionTable 
            questionsData={ungroupedQuestions} 
            openEditQuestion={openEditUngroupedQuestion}
            updateUI={updateUIonUngroupedTable}
            /> : <h3>No questions to show at this moment</h3>
      )
    }else{
      return (tableGroupQuestionCount > 0 ? <GroupedQuestionsTable 
                questionsData={groupedQuestions}
                openEditQuestion={openEditGroupedQuestion}
                updateUI={updateUIonGroupedTable}
                /> : <h3>No group questions to show at this moment</h3>
                
      )
    }
  }

  async function findUngroupedQuestion(event){
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
        setUngroupedQuestion(record);
        setTableUngroupedQuestionCount(resultCount);
      }else{
        setTableUngroupedQuestionCount(0);
      }
    }else{
      updateUIonUngroupedTable();
    }
  }

  async function findGroupedQuestion(event){
    const question = event.target.value;

    if(question !== ""){
      const response = await fetch(`http://localhost:5000/grouped-questions/search/${question}`);

      if (!response.ok) {
        const message = `An error has occured: ${response.statusText}`;
        window.alert(message);
        return;
      }

      const record = await response.json();
      const resultCount = Object.keys(record).length;

      if( resultCount > 0){
        setGroupedQuestions(record);
        setTableGroupQuestionCount(resultCount);
      }else{
        setTableGroupQuestionCount(0);
      }
    }else{
      // update UI on with group table to
      // load all group questions
      updateUIonGroupedTable();
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
            <button onClick={toggleCreateQuestionGroup}>
                Create Group Question
            </button>
            :
            <button onClick={toogleCreateUngroupedQuestion}>
              Create Question
            </button>
          }
            <br></br>
            <br></br>
          {
            changeQuestionToGroup ?
            <input type="text" placeholder="Search a group name" onInput={findGroupedQuestion}/>  :
            <input type="text" placeholder="Search a question" onInput={findUngroupedQuestion}/>
          }
          { 
            showCreateUngroupedQuestion && <CreateQuestion 
            toggleClose={toogleCreateUngroupedQuestion} 
            updateUI={updateUIonUngroupedTable}
            /> 
          }
          {
            showCreateGroupedQuestion && <CreateGroupedQuestion 
              toggleClose={toggleCreateQuestionGroup}
              updateUI={updateUIonGroupedTable}
              />
          }
            <button onClick={swtichQuestion}>
              Switch to
              {
                changeQuestionToGroup ? ' Ungrouped ' : ' Grouped  '
              }
              Question
            </button>
          {showEditUngroupedQuestion && <EditQuestion 
            closeEditQuestion={closeEditUngroupedQuestion}
            question={ungroupedQuestionToEdit}
            updateUI={updateUIonUngroupedTable}/>}

          {showEditGroupedQuestion && <EditGroupedQuestion 
            closeEditQuestion={closeEditGroupedQuestion}
            groupedQuestion={groupedQuestionToEdit}
            updateUI={updateUIonGroupedTable}/>}
          <div className='table-container'>
            {
              <LoadTable />
            }
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;