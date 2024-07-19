import React, { useState } from 'react'
import { MdDeleteForever, MdRestoreFromTrash} from "react-icons/md";

function TrashItem({note, restoreNote, deleteNote}) {

  const [showActions, setShowActions] = useState(false);

  return (
    <div className="note-item" style={{backgroundColor: note.bg_color ? note.bg_color : "#2E236C"}} onMouseOver={() => setShowActions(true)} onMouseOut={() => setShowActions(false)}>
        <div>
            <h3 className="note-title">{note.title}</h3>
            <p className="note-content">{note.content}</p>
        </div>
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