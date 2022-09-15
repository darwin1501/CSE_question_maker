import React from 'react';
import Checker from '../../utility_module/checker';

export default function EditGroupedQuestion(props) {

   const [formData, setFormData] = React.useState(props.groupedQuestion);
   const [prevQuestion] = React.useState(props.groupedQuestion);

   console.log(formData)

    async function updateQuestion(event) {
      event.preventDefault();

      const isGroupNameExist = await Checker.hasGroupNameDuplicate(formData.groupName);
      let updateThis = null;

      // if group name is not modified ignore duplicate checking
      if(prevQuestion.groupName === formData.groupName){
        updateThis = true;
      }else{
        if(isGroupNameExist === true){
          updateThis = false;
        }else{
          updateThis = true;
        }
      }

      if(updateThis === true){
        await fetch(`http://localhost:5000/grouped-question/update/${formData._id}`, {
          method: "POST",
          body: JSON.stringify(formData),
          headers: {
            'Content-Type': 'application/json'
          },
        });
        alert("Group Name Updated");
        
        props.updateUI();
      }else{
        alert("Error: Group Name Already Exists");
      }
  }

  function changeFormData(event) {
    const name = event.target.name;
    const value = event.target.value;
    
    setFormData((prev)=>{
      // conditional setting of values on question reference
      // conditional setting of values on question reference
      if(name === "referenceType" && value === "image"){
        return{...prev, [name]:value, hasImage:true, dateModified: new Date()};
      }else{
        return{...prev, [name]:value, hasImage:false, dateModified: new Date()};
      }
      });
    }

  function formatFormData(event) {
    const name = event.target.name;
    const value = event.target.value.trim();
    
    setFormData((prev)=>{
      return{...prev, [name]:value, dateModified: new Date()};
    })
  }

    return(
        <div>
            <div className="modal-container">
                <div className="card-modal-content card-sm">
                    <div className="flex flex-end">
                        <button  className="btn-close" onClick={()=>{
                          props.closeEditQuestion()
                        }}>
                        </button>
                    </div>
                    <h4 style={{textAlign: "center", fontSize: "20px", marginBottom: "20px"}}>
                    Edit Group Question
                    </h4>
                    <form onSubmit={updateQuestion}>
                      <div className="flex flex-vertical gap-sm">
                          <select name="questionType" value={formData.questionType} onChange={changeFormData} onBlur={formatFormData} required>
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
                          <label className="flex flex-vertical gap-sm">
                              Group Name
                              <input  name="groupName" value={formData.groupName} onChange={changeFormData} onBlur={formatFormData} required/>
                          </label>
                          <select name="referenceType" value={formData.referenceType}  onChange={changeFormData} onBlur={formatFormData} required>
                              <option value="">---Select Reference Type---</option>
                              <option value="text">Text</option>
                              <option value="image">Image</option>
                          </select>
                          {
                              formData.referenceType === "text" ? 
                              <label className="flex flex-vertical gap-sm">
                                  Question Reference
                                  <textarea name="questionReference" value={formData.questionReference}  onChange={changeFormData} onBlur={formatFormData} required/>
                              </label> :
                              <label className="flex flex-vertical gap-sm">
                                  Image as Reference
                                  <input name="imageUrlAsReference" value={formData.imageUrlAsReference}  onChange={changeFormData} onBlur={formatFormData} placeholder="Image Url" required/>
                              </label>
                          }
                      </div>
                      <div className="flex flex-end" style={{marginTop: "20px"}}>
                        <input className="btn" type="submit" value="Update" />
                      </div>
                    </form>
                </div>
            </div>
        </div>
    );
}