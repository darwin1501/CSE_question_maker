

function hasEmptyString(dataObject){
    const hasEmptyProperty = [];
    // check each object property if they have empty string.
    for (const [, value] of Object.entries(dataObject)) {
    // if property is an object then check its property also if they have empty string.
      if(typeof value === "object"){ 
        const object = value
        for (const [, value] of Object.entries(object)) {
          if(value === ""){
            hasEmptyProperty.push(true);
          }else{
            hasEmptyProperty.push(false);
          }
        } 
      }else{
        if(value === ""){
          hasEmptyProperty.push(true);
        }else{
          hasEmptyProperty.push(false);
        }
      }
    }
  
    if(hasEmptyProperty.includes(true) === true){
      return true;
    }else{
      return false;
    }
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
      return false;
    }else{
      return true;
    }
}

async function hasGroupNameDuplicate(groupName) {
  const response = await fetch(`http://localhost:5000/grouped-question/find/${groupName}`);
    if (!response.ok) {
      const message = `An error has occured: ${response.statusText}`;
      window.alert(message);
      return;
    }
    const record = await response.json();

    console.log(record)

    if (!record) {
      return false;
    }else{
      return true;
    }
}

  export default{
    hasEmptyString,
    hasQuestionDuplicate,
    hasGroupNameDuplicate
  };