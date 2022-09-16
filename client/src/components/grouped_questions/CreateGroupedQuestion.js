import React from 'react';
import Checker from '../../utility_module/checker';

export default function CreateGroupedQuestion(props) {


    const [formData, setFormData] = React.useState({
        questionReference: "",
        imageUrlAsReference: "",
        referenceType: "",
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
                return{...prev, [name]:value, dateModified: new Date()};

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

    function testFormData(event){
        event.preventDefault();
        if(formData.referenceType === "image"){
            setFormData((prev)=>{
                // conditional setting of values on question reference
                    return{...prev, hasImage: true};
            });
        }

        console.log(formData)
    }

    return(
        <div>
            <div className="modal-container">
                <div className="card-modal-content card-sm">
                <div className="flex flex-end">
                    <button className="btn-close" onClick={()=>{
                        props.toggleClose();
                    }}>
                    </button>
                </div>
                <h4 style={{textAlign: "center", fontSize: "20px", marginBottom: "20px"}}>
                    Create Group Question
                </h4>
                <form onSubmit={createGroupedQuestion}>
                    <div className="flex flex-vertical gap-sm">
                        <select name="questionType" value={formData.questionType} onChange={changeFormData} onBlur={formatFormData} required>
                            <option value="">---Select Category---</option>
                            <option value="Numerical">Numerical</option>
                            <option value="Analytical">Analytical</option>
                            <option value="Verbal">Verbal</option>
                            <option value="Philippine Constitution">Philippine Constitution</option>
                            <option value="RA 6713">RA 6713</option>
                            <option value="Environment management 203 and protection">
                                Environment management 203
                                and protection
                            </option>
                            <option
                                value="Peace and Human Rights Issues and Concepts"
                                >
                                Peace and Human Rights Issues and Concepts
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
                        <input className="btn" type="submit" value="Create" />
                    </div>
                </form>
                </div>
            </div>
        </div>
    )
}