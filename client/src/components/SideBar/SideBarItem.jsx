import React, { useState } from 'react'
import { IoCheckmarkOutline } from 'react-icons/io5';
import { MdDelete, MdLabel, MdOutlineEdit } from 'react-icons/md'

function SideBarItem({label, updateLabel, deleteLabel}) {
    const [toggleLabel, setToggleLabel] = useState(false);
    const [labelName, setLabelName] = useState(label.name);


    return (
        <div className="label-popup-item" onMouseOver={() => setToggleLabel(true)} onMouseOut={() => setToggleLabel(false)}>
            {toggleLabel ? 
                <MdDelete className="label-popup-icon" onClick={() => deleteLabel(label.id)} /> 
                : 
                <MdLabel className="label-popup-icon" />
            }
            <input type="text" value={labelName} className="label-popup-input" onChange={(e) => setLabelName(e.target.value)} />
            <button className="label-create-btn" onClick={() => updateLabel({id: label.id, name: labelName})}>
                {toggleLabel ?
                    <IoCheckmarkOutline size={20} className="checkmark-icon" />
                    :
                    <MdOutlineEdit size={20} className="checkmark-icon" />
                }
            </button>
        </div>
    )
}

export default SideBarItem