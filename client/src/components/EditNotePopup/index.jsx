import { format } from "date-fns";
import { useState } from "react";
import { BiBellPlus } from "react-icons/bi";
import { GoClock } from "react-icons/go";
import { IoSend } from "react-icons/io5";
import { MdCancel, MdLabelOutline } from "react-icons/md";
import CreatableSelect from 'react-select/creatable';
import { editNote } from "../APIs";
import TextEditorComponent from "../TextEditorComponent";

const customStyles = {
    control: (provided, state) => ({
        ...provided,
        border: '1px solid #433D8B',
        borderRadius: '5px',
        boxShadow: null,
        '&:hover': {
            borderColor: '#433D8B',
        },
        marginBottom: '0px',
        width: '100%!important',
        height: '30px',
        minHeight: '30px',
        fontSize: '13px'
    }),
    menu: (provided, state) => ({
        ...provided,
        marginTop: '0px',
        paddingTop: '0px',
    }),
    dropdownIndicator: (provided) => ({
        ...provided,
        color: '#433D8B',
        '&:hover': {
            color: '#433D8B',
        },
        width: '15px',
        padding: '0px',
        margin: '0px',
        border: '0px',
    }),
    option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isSelected ? '#433D8B' : null,
        color: state.isSelected ? 'white' : 'black',
    }),
};

const EditNotePopup = ({note, setNote, fetchNotes, handleContentChange, setShowEditNotePopup, closeEditNotePopup, handleNoteChange, handleLabelChange, labelsList}) => {
    
    const [showLabels, setShowLabels] = useState(false);
    const [showReminder, setShowReminder] = useState(false);
    
    let editedDate = null;
    if(note.updated_at) {
        editedDate = format(new Date(note.updated_at), 'MMM dd, yyyy hh:mm a');
    }

    const formatDateToDateTimeLocal = (date) => {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };
    
    const minDateTime = formatDateToDateTimeLocal(new Date());

    let formatDate = null;
    if(note.reminder_date) {
        formatDate = format(new Date(note.reminder_date), 'MMM dd, yyyy hh:mm a');
    }

    return (
        <div className="notes-update-popup-container">
            <div className="notes-update-popup-overlay" onClick={closeEditNotePopup}></div>
            <div className="notes-input-container" style={{backgroundColor: note.bg_color ? note.bg_color : '#17153B'}}>
                <input type="text" className="notes-input" placeholder="Title" name="title" value={note.title} onChange={handleNoteChange} />
                {/* <textarea className="notes-textarea" placeholder="Take a note..." name="content" value={note.content} onChange={handleNoteChange} /> */}
                <TextEditorComponent content={note.content} handleContentChange={handleContentChange} />
                {note.reminder_date &&
                    <div className="notes-label" style={{alignSelf: "flex-start", marginLeft: '15px'}}>
                        <GoClock className="notes-label-icon" style={{marginRight: '3px'}} />
                        <span>{formatDate}</span>
                        <MdCancel className="notes-label-icon" onClick={() => setNote({
                            ...note,
                            reminder_date: null
                        })} />
                    </div>
                }
                <div className="notes-labels-container">
                    {note.labels.map((label, index) => (
                        <div key={index} className="notes-label">
                            <span>{label}</span>
                            <MdCancel className="notes-label-icon" onClick={() => setNote({
                                ...note,
                                labels: note.labels.filter((l, i) => i !== index)
                            })} />
                        </div>
                    ))}
                </div>
                <div className="notes-options-container">
                    {/* <div>
                        <button className="edit-note-option-btn">
                            <MdOutlineArchive className="edit-note-option-icon" />
                        </button>
                        <button className="edit-note-option-btn">
                            <RiDeleteBin6Line className="edit-note-option-icon" />
                        </button>
                        <button className="edit-note-option-btn">
                            <MdLabelOutline className="edit-note-option-icon" />
                        </button>
                        <button className="edit-note-option-btn">
                            <IoColorPalette className="edit-note-option-icon" />
                        </button>
                    </div> */}
                    <div className="notes-option-con">
                        <button className="notes-option-btn" title="Background Colors" onMouseOver={() => setShowReminder(true)}  onMouseOut={() => setShowReminder(false)}>
                            <BiBellPlus className="notes-option-icon" />
                        </button>
                        {showReminder &&
                            <div className="notes-colors" onMouseOver={() => setShowReminder(true)}  onMouseOut={() => setShowReminder(false)}>
                                <input type="datetime-local" min={minDateTime} className="reminder-datetime" name='reminder_date' value={note.reminder_date} onChange={handleNoteChange} />
                            </div>
                        }
                    </div>
                    <div className="notes-option-con">
                        <button className="notes-option-btn" title="Add Labels" onMouseOver={() => setShowLabels(true)}  onMouseOut={() => setShowLabels(false)}>
                            <MdLabelOutline className="notes-option-icon" />
                        </button>
                        {showLabels &&
                            <div className="notes-colors" onMouseOver={() => setShowLabels(true)}  onMouseOut={() => setShowLabels(false)}>
                                <CreatableSelect
                                    isClearable
                                    onChange={handleLabelChange}
                                    options={labelsList}
                                    placeholder="Select Company"
                                    styles={customStyles}
                                />
                            </div>
                        }
                    </div>
                    <div className="update-button-con">
                        <span className="last-edited">Edited: {editedDate}</span>
                        <button type="button" className="notes-save-button" onClick={() => editNote(note, setNote, fetchNotes, setShowEditNotePopup)}>
                            <IoSend className="notes-save-icon" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EditNotePopup;