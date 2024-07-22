import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import 'quill/dist/quill.snow.css';
import './style.css'

const TextEditorComponent = ({handleContentChange, content}) => {

  const customStyles = {
    backgroundColor: 'transparent', // Custom background color
    color: '#ffffff', // Custom text color
    fontFamily: 'Arial, sans-serif', // Custom font family
    fontSize: '14px', // Custom font size
    border: 'none', // Custom border
    borderTop: '1px solid #2E236C', // Custom border style
    borderRadius: '5px', // Custom border radius
    marginBottom: '16px', // Custom margin bottom
  };

  return (
    <div>
      <ReactQuill
        value={content}
        onChange={handleContentChange}
        placeholder='Take a note...'
        modules={{
          toolbar: [
            [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
            [{ 'size': [] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{'list': 'ordered'}, {'list': 'bullet'}, 
             {'indent': '-1'}, {'indent': '+1'}],
            [{ 'color': [] }, { 'background': [] }],
            ['link'],
            ['clean']
          ],
        }}
        style={customStyles}
      />
    </div>
  );
};

export default TextEditorComponent;
