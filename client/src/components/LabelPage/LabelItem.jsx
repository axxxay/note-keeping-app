import React, { useState } from 'react'
import {IoColorPalette} from "react-icons/io5";
import { RiDeleteBin6Line } from "react-icons/ri";
import {MdOutlineArchive, MdCancel} from "react-icons/md";
import { format } from 'date-fns';

function LabelItem({note, trashNote, archiveNote, openEditNotePopup, handleColorUpdate}) {

  const [showActions, setShowActions] = useState(false);
  const [showBgColors, setShowBgColors] = useState(false);

    const handleBgColorChange = (color) => {
        handleColorUpdate(note, color);
    }

    let formatDate = null;
    if(note.reminder_date){
        formatDate = format(new Date(note.reminder_date), 'MMM dd, yyyy hh:mm a');
    }

  return (
    <div className="note-item" style={{backgroundColor: note.bg_color ? note.bg_color : "#2E236C"}} onMouseOver={() => setShowActions(true)} onMouseOut={() => setShowActions(false)}>
        <div onClick={() => openEditNotePopup(note)}>
            <h3 className="note-title">{note.title}</h3>
            <p className="note-content">{note.content}</p>
            {note.reminder_date && <div className="notes-label" style={{marginTop: "5px", width: "fit-content"}}>{formatDate}</div>}
            <div className="notes-item-labels-container">
                { note.labels[0] !== "" &&
                    note.labels.map((label, index) => (
                        <div key={index} className="notes-label">{label}</div>
                    ))
                }
            </div>
        </div>
        {(note.archived === 1) && <span className="note-archived">ARCHIVED</span>}
        {showActions &&
        <div className="note-actions">
            <div className="notes-option-con">
                <button className="notes-option-btn" title="Background Colors" onMouseOver={() => setShowBgColors(true)}  onMouseOut={() => setShowBgColors(false)}>
                    <IoColorPalette className="notes-option-icon" style={{marginRight: "0px"}} />
                </button>
                {showBgColors &&
                    <div className="notes-colors" style={{top: '19px'}} onMouseOver={() => setShowBgColors(true)}  onMouseOut={() => setShowBgColors(false)}>
                        <button className="notes-color" style={{backgroundColor: "transparent"}} onClick={() => handleBgColorChange('')} >
                            <MdCancel className="notes-color-icon" />
                        </button>
                        <button className="notes-color" style={{backgroundColor: '#77172e'}} onClick={() => handleBgColorChange('#77172e')} ></button>
                        <button className="notes-color" style={{backgroundColor: '#692b17'}} onClick={() => handleBgColorChange('#692b17')} ></button>
                        <button className="notes-color" style={{backgroundColor: '#7c4a03'}} onClick={() => handleBgColorChange('#7c4a03')} ></button>
                        <button className="notes-color" style={{backgroundColor: '#264d3b'}} onClick={() => handleBgColorChange('#264d3b')} ></button>
                        <button className="notes-color" style={{backgroundColor: '#256377'}} onClick={() => handleBgColorChange('#256377')} ></button>
                        <button className="notes-color" style={{backgroundColor: '#472e5b'}} onClick={() => handleBgColorChange('#472e5b')} ></button>
                    </div>
                }
            </div>
            <button className="note-action-btn" onClick={() => archiveNote(note.id)} title='Archive'>
                <MdOutlineArchive className='note-action-icon' />
            </button>
            <button className="note-action-btn" onClick={() => trashNote(note.id)} title='Delete'>
                <RiDeleteBin6Line className='note-action-icon' />
            </button>
        </div>
        }
    </div>
  )
}

export default LabelItem