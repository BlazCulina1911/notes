import {useEffect, useState} from "react";
import noteService from './services/notes'
import Note from "./components/Note";

function App() {
    const [notes, setNotes] = useState([])
    const [newNote, setNewNote] = useState('')
    const [showImportant, setImportant] = useState(true)

    const newNoteHandler = (event) => setNewNote(event.target.value)
    const toggleImportant = () => setImportant(!showImportant)

    const hook = () => {
        noteService
            .getAll()
            .then(initialNotes => {
                setNotes(initialNotes)
            })
    }
    useEffect(hook, [])

    const addNewNote = () => {
        const newNoteObject = {
            content: newNote, date: new Date(), important: Math.random() < 0.5
        }

        noteService
            .create(newNoteObject)
            .then(responseNote => {
                setNotes(notes.concat(responseNote))
                setNewNote('')
            })
    }

    const changeImportanceOf = id => {
        const note = notes.find(note => note.id === id)
        const modifiedNote = {...note, important: !note.important}

        noteService
            .update(id, modifiedNote)
            .then(returnedNote => {
                setNotes(notes.map(note => note.id === id ? returnedNote : note))
            })
            .catch(error => {
                alert(`the note '${note.content}' was already deleted from server`)
                setNotes(notes.filter(n => n.id !== id))
            })
    }


    const filteredNotes = showImportant ? notes : notes.filter(note => note.important)

    console.log(filteredNotes)

    return (<div>
        <button onClick={toggleImportant}>{showImportant ? <>hide unimportant</> : <>show all</>}</button>
        <ul>
            {filteredNotes.map(note => <Note toggleImportance={changeImportanceOf} key={note.id} note={note}/>)}
        </ul>
        <input value={newNote} onChange={newNoteHandler}/>
        <button onClick={addNewNote}>Add</button>
    </div>);
}

export default App;
