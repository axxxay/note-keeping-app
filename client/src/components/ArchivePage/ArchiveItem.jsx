import React, { useState } from 'react'
import {IoColorPalette} from "react-icons/io5";
import { RiDeleteBin6Line } from "react-icons/ri";
import {MdOutlineUnarchive, MdLabelOutline, MdCancel, MdOutlineArchive} from "react-icons/md";


function ArchiveItem({note, trashNote, unarchiveNote, openEditNotePopup, handleColorUpdate}) {

  const [showActions, setShowActions] = useState(false);
  const [showBgColors, setShowBgColors] = useState(false);

    const handleBgColorChange = (color) => {
        handleColorUpdate(note, color);
    }

  return (
    <div className="note-item" style={{backgroundColor: note.bg_color ? note.bg_color : "#2E236C"}} onMouseOver={() => setShowActions(true)} onMouseOut={() => setShowActions(false)}>
        <div onClick={() => openEditNotePopup(note)}>
            <h3 className="note-title">{note.title}</h3>
            <p className="note-content">{note.content}</p>
            <div className="notes-item-labels-container">
                {note.labels.map((label, index) => (
                    <div key={index} className="notes-label">{label}</div>
                ))}
            </div>
        </div>
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
                        <button className="notes-color" style={{backgroundColor: '#f28b82'}} onClick={() => handleBgColorChange('#f28b82')} ></button>
                        <button className="notes-color" style={{backgroundColor: '#fbbc04'}} onClick={() => handleBgColorChange('#fbbc04')} ></button>
                        <button className="notes-color" style={{backgroundColor: '#fff475'}} onClick={() => handleBgColorChange('#fff475')} ></button>
                        <button className="notes-color" style={{backgroundColor: '#ccff90'}} onClick={() => handleBgColorChange('#ccff90')} ></button>
                        <button className="notes-color" style={{backgroundColor: '#a7ffeb'}} onClick={() => handleBgColorChange('#a7ffeb')} ></button>
                    </div>
                }
            </div>
            <button className="note-action-btn" onClick={() => unarchiveNote(note.id)} title='Unarchive'>
                <MdOutlineUnarchive className='note-action-icon' />
            </button>
            <button className="note-action-btn" onClick={() => trashNote(note.id)} title='Delete'>
                <RiDeleteBin6Line className='note-action-icon' />
            </button>
        </div>
        }
    </div>
  )
}

export default ArchiveItem