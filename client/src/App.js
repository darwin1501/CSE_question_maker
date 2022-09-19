import React from 'react';
import './App.css';
import './StyleUtils.css';
import QuestionTable from './components/ungrouped_questions/QuestionTable';
import GroupedQuestionsTable from './components/grouped_questions/QuestionGroupTable';
import CreateQuestion from './components/ungrouped_questions/CreateQuestion';
import CreateGroupedQuestion from './components/grouped_questions/CreateGroupedQuestion';
import EditQuestion from './components/ungrouped_questions/EditQuestion';
import EditGroupedQuestion from './components/grouped_questions/EditGroupedQuestion';
import QuestionInGroupModal from './components/grouped_questions/QuestionsInGroupModal';
import Dashboard from './components/dashboard/Dashboard';

function App() {
  // question count for all questions, and sub category
  const [ungroupQuestionsCount, setUngroupQuestionsCount] = React.useState({
    totalQuestions: 0,
    numerical: 0,
    analytical: 0,
    verbal: 0,
    philCon: 0,
    ra6713: 0,
    envProtection: 0,
    humanRights: 0
  });
  const [groupQuestionsCount, setGroupQuestionsCount] = React.useState({
    totalQuestions: 0,
    numerical: 0,
    analytical: 0,
    verbal: 0,
    philCon: 0,
    ra6713: 0,
    envProtection: 0,
    humanRights: 0
  });
  const [showCreateUngroupedQuestion, setShowCreateUngroupedQuestion] = React.useState(false);
  const [showEditUngroupedQuestion, setShowEditUngroupedQuestion] = React.useState(false);
  const [ungroupedQuestions, setUngroupedQuestion] = React.useState([{}]);
  const [UngroupedTableUiUpdate, setUngroupedTableUiUpdate] = React.useState(false);
  const [ungroupedQuestionToEdit, setUngroupedQuestionToEdit] = React.useState({});
  const [tableUngroupedQuestionCount, setTableUngroupedQuestionCount] = React.useState(0);

  const [showCreateGroupedQuestion, setshowCreateGroupedQuestion] = React.useState(false);
  const [showEditGroupedQuestion, setShowEditGroupedQuestion] = React.useState(false);
  const [groupedQuestionToModify, setGroupedQuestionToModify] = React.useState({});
  const [groupedQuestions, setGroupedQuestions] = React.useState([])
  const [GroupTableUiUpdate, setGroupTableUiUpdate] = React.useState(false);
  const [tableGroupQuestionCount, setTableGroupQuestionCount] = React.useState(0);
  const [showQuestionInGroup, setShowQuestionsInGroup] = React.useState(false);
  const [showCreateQuestionInGroup, setShowCreateQuestionInGroup] = React.useState(false);
  const [questionGroupID, setQuestionGroupID] = React.useState("");
  // a question ID of selected question in question group
  //  this will help to identify which group questions within groups to modify
  const [questionIDOfQuestionGroup, setQuestionIDOfQuestionGroup] = React.useState("");
  const [openEditQuestionInQuestionGroup, setOpenEditQuestionInQuestionGroup] = React.useState(false);

  const [changeQuestionToGroup, setChangeQuestionToGroup] = React.useState(false);
  const [contributor, setContributor] = React.useState("");

  React.useEffect(()=>{
    async function getQuestions(){
      const response = await fetch("http://localhost:5000/questions")
      if (!response.ok) {
        const message = `An error occured: ${response.statusText}`;
        window.alert(message);
        return;
      }

      const questions = await response.json();
      const totalQuestionCount = Object.keys(questions).length
      const numericalCount = questions.filter(questions => questions.questionType === "Numerical").length
      const analyticalCount = questions.filter(questions => questions.questionType === "Analytical").length
      const verbalCount = questions.filter(questions => questions.questionType === "Verbal").length
      const philConCount = questions.filter(questions => questions.questionType === "Philippine Constitution").length
      const ra6713Count = questions.filter(questions => questions.questionType === "RA 6713").length
      const envProtectionCount = questions.filter(questions => questions.questionType === "Environment management and protection").length
      const humanRightsCount = questions.filter(questions => questions.questionType === "Peace and Human Rights Issues and Concepts").length
      const questionsCount = {
        totalQuestions: totalQuestionCount,
        numerical: numericalCount,
        analytical: analyticalCount,
        verbal: verbalCount,
        philCon: philConCount,
        ra6713: ra6713Count,
        envProtection: envProtectionCount,
        humanRights: humanRightsCount
      }

      setUngroupQuestionsCount((prev)=>{
        return {...prev, ...questionsCount}
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

      const questionGroup = await response.json();
      let totalQuestionCount = 0
      let numericalCount = 0
      let analyticalCount = 0
      let verbalCount = 0
      let philConCount = 0
      let ra6713Count = 0
      let envProtectionCount = 0
      let humanRightsCount = 0

      // iterate each question group to get the number of questions
      questionGroup.forEach((questionData)=>  totalQuestionCount += Object.keys(questionData.questions).length)

      questionGroup.filter(questions => questions.questionType === "Numerical")
      .forEach((question => numericalCount += Object.keys(question.questions).length))

      questionGroup.filter(questions => questions.questionType === "Analytical")
      .forEach((question => analyticalCount += Object.keys(question.questions).length))

      questionGroup.filter(questions => questions.questionType === "Verbal")
      .forEach((question => verbalCount += Object.keys(question.questions).length))

      questionGroup.filter(questions => questions.questionType === "Philippine Constitution")
      .forEach((question => philConCount += Object.keys(question.questions).length))

      questionGroup.filter(questions => questions.questionType === "RA 6713")
      .forEach((question => ra6713Count += Object.keys(question.questions).length))

      questionGroup.filter(questions => questions.questionType === "Environment management and protection")
      .forEach((question => envProtectionCount += Object.keys(question.questions).length))

      questionGroup.filter(questions => questions.questionType === "Peace and Human Rights Issues and Concepts")
      .forEach((question => humanRightsCount += Object.keys(question.questions).length))
      //Peace and Human Rights Issues and Concepts

      // const analiticalCount = questionGroup.filter(questions => questions.questionType === "Analitical").length
      // const verbalCount = questionGroup.filter(questions => questions.questionType === "Verbal").length
      // const philConCount = questionGroup.filter(questions => questions.questionType === "Philippine Constitution").length
      // const envProtectionCount = questionGroup.filter(questions => questions.questionType === "Environment management 203 and protection").length
      const questionsCount = {
        totalQuestions: totalQuestionCount,
        numerical: numericalCount,
        analytical: analyticalCount,
        verbal: verbalCount,
        philCon: philConCount,
        ra6713: ra6713Count,
        envProtection: envProtectionCount,
        humanRights: humanRightsCount
      }
      
      setGroupQuestionsCount((prev)=>{
        return {...prev, ...questionsCount}
      })

      setGroupedQuestions(questionGroup);
      setTableGroupQuestionCount(Object.keys(questionGroup).length)
  }
      getGroupedQuestions()
  }, [GroupTableUiUpdate])

  function handleSetContributor(event){
    const value = event.target.value

    setContributor(value)
  }

  function toogleCreateUngroupedQuestion() {
    setShowCreateUngroupedQuestion(!showCreateUngroupedQuestion)
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
    setGroupedQuestionToModify(record);
    setShowEditGroupedQuestion(true);
  }

  function closeEditUngroupedQuestion() {
    setUngroupedQuestionToEdit({});
    setShowEditUngroupedQuestion(false);
  }

  function closeEditGroupedQuestion(){
    setGroupedQuestionToModify({});
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
          ungroupQuestionsCount.totalQuestions > 0 && tableUngroupedQuestionCount > 0?
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
                openQuestionsModal={getQuestionInQuestionGroup}
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

  async function loadQuestionInQuestionGroup(id){
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

    return record;
  }

  async function getQuestionInQuestionGroup(id){
    const record = await loadQuestionInQuestionGroup(id);
    setGroupedQuestionToModify(record)
    setShowQuestionsInGroup(!showQuestionInGroup)
    // set ID
    setQuestionGroupID(id)
  }

  async function refreshQuestionsInQuestionGroup(){
    const record = await loadQuestionInQuestionGroup(questionGroupID);
    setGroupedQuestionToModify(record)
  }

  function closeQuestionsInQuestionGroup(){
    setShowQuestionsInGroup(!showQuestionInGroup)
  }

  function toggleShowCreateQuestionInGroup(){
    setShowCreateQuestionInGroup(!showCreateQuestionInGroup);
  }

  function showEditQuestionInQuestionGroup(id){
    setOpenEditQuestionInQuestionGroup(!openEditQuestionInQuestionGroup)
    // set the selected question id in question group
    setQuestionIDOfQuestionGroup(id); 
  }

  return (
    <div className="App">
      <main>
        <div className="main-container">
          {
          <Dashboard 
          totalQuestions = {ungroupQuestionsCount.totalQuestions + groupQuestionsCount.totalQuestions}
          numerical = {ungroupQuestionsCount.numerical + groupQuestionsCount.numerical}
          analytical = {ungroupQuestionsCount.analytical + groupQuestionsCount.analytical}
          verbal = {ungroupQuestionsCount.verbal + groupQuestionsCount.verbal}
          philCon = {ungroupQuestionsCount.philCon + groupQuestionsCount.philCon}
          ra6713 = {ungroupQuestionsCount.ra6713 + groupQuestionsCount.ra6713}
          envProtection = {ungroupQuestionsCount.envProtection + groupQuestionsCount.envProtection}
          humanRights = {ungroupQuestionsCount.humanRights + groupQuestionsCount.humanRights}
          />
          }
          { 
            changeQuestionToGroup ? 
            <button className="btn-create btn" onClick={toggleCreateQuestionGroup}>
                Create Group Question
            </button>
            :
            <button className="btn-create btn" onClick={toogleCreateUngroupedQuestion}>
              Create Question
            </button>
          }
            <br></br>
            <br></br>
          <div style={{display: "flex", gap: "100px"}}>
            <button className="btn" onClick={swtichQuestion}>
                Switch to
                {
                  changeQuestionToGroup ? ' Ungrouped ' : ' Grouped  '
                }
                Question
            </button>
            {
              changeQuestionToGroup ?
              <input className="search-bar" type="text" placeholder="Search a group name" onInput={findGroupedQuestion}/>  :
              <input className="search-bar" type="text" placeholder="Search a question" onInput={findUngroupedQuestion}/>
            }
            <select name="contributor" value={contributor} onChange={handleSetContributor}>
              <option value="">Select Contributor</option>
              <option value="Unknown">Unknown</option>
              <option value="Leonalyn Mutia Tayone">Leonalyn Mutia-Tayone</option>
            </select>
          </div>
          <div className='table-container'>
            {
              <LoadTable />
            }
          </div>
          
          { showCreateUngroupedQuestion && <CreateQuestion
            contributor={contributor} 
            toggleClose={toogleCreateUngroupedQuestion} 
            updateUI={updateUIonUngroupedTable}
            type={'ungroup'}/> }

          {showEditUngroupedQuestion && <EditQuestion
            handleClose={closeEditUngroupedQuestion}
            question={ungroupedQuestionToEdit}
            updateUI={updateUIonUngroupedTable}
            type={"ungroup"}/>}

          {showCreateGroupedQuestion && <CreateGroupedQuestion 
            toggleClose={toggleCreateQuestionGroup}
            updateUI={updateUIonGroupedTable}/>}

          {showEditGroupedQuestion && <EditGroupedQuestion 
            closeEditQuestion={closeEditGroupedQuestion}
            groupedQuestion={groupedQuestionToModify}
            updateUI={updateUIonGroupedTable}/>}

          {showQuestionInGroup && <QuestionInGroupModal 
            openCreateQuestion={toggleShowCreateQuestionInGroup}
            openEditQuestion={showEditQuestionInQuestionGroup}
            handleClose={closeQuestionsInQuestionGroup}
            updateUI={refreshQuestionsInQuestionGroup}
            updateTableUI={updateUIonGroupedTable}
            questionGroup={groupedQuestionToModify}/>}

          {showCreateQuestionInGroup && <CreateQuestion
            contributor={contributor} 
            toggleClose={toggleShowCreateQuestionInGroup} 
            updateUI={refreshQuestionsInQuestionGroup}
            updateTableUI={updateUIonGroupedTable}
            type={'group'}
            questionGroup={groupedQuestionToModify}/>}

            {openEditQuestionInQuestionGroup && <EditQuestion
              handleClose={setOpenEditQuestionInQuestionGroup}
              questionGroup={groupedQuestionToModify}
              questionID={questionIDOfQuestionGroup}
              openEditQuestion={showEditQuestionInQuestionGroup}
              type={"group"}
              updateUI={refreshQuestionsInQuestionGroup}/>}
        </div>
      </main>
    </div>
  );
}

export default App;