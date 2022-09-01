import React from 'react';
import Checker from '../../utility_module/checker';

export default function CreateGroupedQuestion(props) {

    const [formData, setFormData] = React.useState({
        questionReference: "",
        hasImage: false,
        imageUrlAsReference: "",
        referenceType: "text",
        groupName: "",
        questionType: "",
        questions: [],
        dateModified: new Date()   
    });

    function formatFormData(event) {
        const name = event.target.name;
        const value = event.target.value.trim();
        
        setFormData((prev)=>{
            return{...prev, [name]:value, dateModified: new Date()};
          });
      }
    
    function changeFormData(event) {
        const name = event.target.name;
        const value = event.target.value;
        
        setFormData((prev)=>{
            // conditional setting of values on question reference
            if(name === "referenceType" && value === "image"){
                return{...prev, [name]:value, hasImage:true,  dateModified: new Date()};
            }else{
                return{...prev, [name]:value, hasImage:false, dateModified: new Date()};
            }
          });
    }

    async function createGroupedQuestion(event){
        event.preventDefault();

        const newQuestion = { ...formData };

        const isGroupNameExist = await Checker.hasGroupNameDuplicate(formData.groupName)

        if(isGroupNameExist === false) {
            await fetch("http://localhost:5000/grouped-question/add", {
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
    
            alert("Grouped Question Added");
            props.updateUI()
        }else{
            alert("Error: Group Name Already Exist");
        }
    }

    return(
        <div>
            <div className="modal-container">
                <div className="card-modal-content">
                <div style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center"
                }}>
                    <button onClick={()=>{
                        props.toggleClose();
                    }}>
                        x
                    </button>
                </div>
                <h4 style={{textAlign: "center", fontSize: "20px"}}>
                    Create Group Question
                </h4>
                <form onSubmit={createGroupedQuestion}>
                    <select name="questionType" value={formData.questionType} onChange={changeFormData} onBlur={formatFormData} required>
                        <option value="">---Select Category---</option>
                        <option value="Numerical">Numerical</option>
                        <option value="Analitical">Analitical</option>
                        <option value="Verbal">Verbal</option>
                        <option value="Philippine Constitution">Philippine Constitution</option>
                        <option value="RA 6713">RA 6713</option>
                        <option value="Environment management 203
                            and protection">
                            Environment management 203
                            and protection
                        </option>
                    </select>
                    <label>
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
                        <label>
                            Question Reference
                            <textarea name="questionReference" value={formData.questionReference}  onChange={changeFormData} onBlur={formatFormData} required/>
                        </label> :
                        <label>
                            Image as Reference
                            <input name="imageUrlAsReference" value={formData.imageUrlAsReference}  onChange={changeFormData} onBlur={formatFormData} placeholder="Image Url" required/>
                        </label>
                    }
                    
                    <input type="submit" value="Create" />
                </form>
                </div>
            </div>
        </div>
    )
}