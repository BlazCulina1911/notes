import {useState, useEffect} from "react";
import noteService from "./services/notes";
import Note from "./components/Note";
import Notification from "./components/Notification";
import Footer from "./components/Footer";
import "./index.css";


function App() {
    const [notes, setNotes] = useState([]);
    const [newNote, setNewNote] = useState("");
    const [showImportant, setImportant] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);

    const newNoteHandler = (event) => setNewNote(event.target.value);
    const toggleImportant = () => setImportant(!showImportant);

    const hook = () => {
        noteService
            .getAll()
            .then(initialNotes => {
                setNotes(initialNotes);
            });
    };
    useEffect(hook, []);

    const addNewNote = () => {
        const newNoteObject = {
            content: newNote, date: new Date(), important: Math.random() < 0.5
        };

        noteService
            .create(newNoteObject)
            .then(responseNote => {
                setNotes(notes.concat(responseNote));
                setNewNote("");
            });
    };

    const changeImportanceOf = id => {
        const note = notes.find(note => note.id === id);
        const modifiedNote = {...note, important: !note.important};

        noteService
            .update(id, modifiedNote)
            .then(returnedNote => {
                setNotes(notes.map(note => note.id === id ? returnedNote : note));
                setErrorMessage(`Note '${returnedNote.content}' has been set to ${returnedNote.important? "IMPORTANT" : "UNIMPORTANT" }`);
                setTimeout(() => {
                    setErrorMessage(null);
                }, 5000);
            })
            .catch(() => {
                setErrorMessage(`Note '${note.content}' was already removed from server`);

                setNotes(notes.filter(n => n.id !== note.id));
                setTimeout(() => {
                    setErrorMessage(null);
                }, 5000);
            });
    };

    const removeNote = id => {
        noteService
            .remove(id)
            .then(() => {
                setNotes(notes.filter(note => note.id !== id));
            });
    };

    const filteredNotes = showImportant ? notes : notes.filter(note => note.important);

    return (<div>
        <h1>Notes</h1>
        <Notification message={errorMessage}></Notification>
        <button onClick={toggleImportant}>{showImportant ? <>hide unimportant</> : <>show all</>}</button>
        <ul>
            {filteredNotes.map(note => <Note removeNote={removeNote} toggleImportance={changeImportanceOf} key={note.id}
                note={note}/>)}
        </ul>
        <input value={newNote} onChange={newNoteHandler}/>
        <button onClick={addNewNote}>Add</button>
        <Footer/>
    </div>);
}

export default App;
