import { format } from "date-fns";
import { useState } from "react";
import { BiBellPlus } from "react-icons/bi"
import { GoClock } from "react-icons/go"
import { IoColorPalette, IoSend } from "react-icons/io5"
import { MdCancel, MdLabelOutline } from "react-icons/md"
import CreatableSelect from 'react-select/creatable';
import { saveNote } from "../APIs";
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


const NoteInput = ({ note, setNote, handleNoteChange, handleContentChange, fetchNotes, labelsList, handleLabelChange, handleBgColorChange }) => {
    
    const [showTextArea, setShowTextArea] = useState(false);
    const [showBgColors, setShowBgColors] = useState(false);
    const [showReminder, setShowReminder] = useState(false);
    const [showLabels, setShowLabels] = useState(false);


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
        <div className="notes-input-container" style={{backgroundColor: note.bg_color ? note.bg_color : 'transparent'}} onClick={() => setShowTextArea(true)} onMouseLeave={() => setShowTextArea(false)}>
            <input type="text" className="notes-input" placeholder={`${showTextArea ? "Title" : "Take a note..."}`} name="title" value={note.title} onChange={handleNoteChange} />
            {showTextArea &&
                <>
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
                    <div className="notes-options">
                        <div className="notes-option-con">
                            <button className="notes-option-btn" title="Background Colors" onMouseOver={() => setShowBgColors(true)}  onMouseOut={() => setShowBgColors(false)}>
                                <IoColorPalette className="notes-option-icon" />
                            </button>
                            {showBgColors &&
                                <div className="notes-colors" onMouseOver={() => setShowBgColors(true)}  onMouseOut={() => setShowBgColors(false)}>
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
                        {/* <div className="notes-option-con">
                            <button className="notes-option-btn" title="Archive" onClick={note.archive ? () => handleArchiveChange(false) : () => handleArchiveChange(true)}>
                                {note.archive ?
                                    <MdOutlineUnarchive className="notes-option-icon"/>
                                    :
                                    <MdOutlineArchive className="notes-option-icon"/>
                                }
                            </button>
                        </div> */}
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
                    </div>
                    <button type="button" className="notes-save-button" onClick={() => saveNote(note, setNote, fetchNotes)}>
                        <IoSend className="notes-save-icon" />
                    </button>
                </div>
                </>
            }
        </div>
    )
}

export default NoteInput;