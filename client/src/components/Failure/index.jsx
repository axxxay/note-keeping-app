import { MdErrorOutline } from "react-icons/md";
import './style.css';

function Failure({fetchNotes}) {
  return (
    <div className="failure-container">
        <MdErrorOutline className="failure-icon" />
        <p className="failure-text">Failed to load notes</p>
        <button className="retry-button" onClick={fetchNotes}>Retry</button>
    </div>
  )
}

export default Failure