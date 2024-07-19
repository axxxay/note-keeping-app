import { LuLightbulbOff } from "react-icons/lu";
import './style.css';

const NoNotes = () => {
    return (
        <div className="no-notes-container">
            <LuLightbulbOff className="no-notes-icon" />
            <p className="no-notes-text">No Notes Found</p>
        </div>
    );
}

export default NoNotes;