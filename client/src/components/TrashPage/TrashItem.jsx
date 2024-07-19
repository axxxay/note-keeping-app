import React, { useState } from 'react'
import { MdDeleteForever, MdRestoreFromTrash} from "react-icons/md";
import {format} from 'date-fns'

function TrashItem({note, restoreNote, deleteNote}) {

  const [showActions, setShowActions] = useState(false);

  const formatDate = format(new Date(note.trashed_at), 'MMM dd, yyyy hh:mm a');

  return (
    <div className="note-item" style={{backgroundColor: note.bg_color ? note.bg_color : "#2E236C"}} onMouseOver={() => setShowActions(true)} onMouseOut={() => setShowActions(false)}>
        <div>
            <h3 className="note-title">{note.title}</h3>
            <p className="note-content">{note.content}</p>
            <div className="notes-item-labels-container">
                { note.labels[0] !== "" &&
                    note.labels.map((label, index) => (
                        <div key={index} className="notes-label">{label}</div>
                    ))
                }
            </div>
        </div>
        <span className="note-archived">{formatDate}</span>
        {showActions &&
        <div className="note-actions">
            <button className="note-action-btn" title='Delete Forever'>
                <MdDeleteForever className='note-action-icon' onClick={() => deleteNote(note.id)} />
            </button>
            <button className="note-action-btn" onClick={() => restoreNote(note.id)} title='Restore'>
                <MdRestoreFromTrash className='note-action-icon' />
            </button>
        </div>
        }
    </div>
  )
}

export default TrashItem