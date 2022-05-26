const Note = ({note, toggleImportance, removeNote}) => {
    return(
        <li className='note' key={note.content}>
            {note.content}
        <div>
            <button onClick={() => toggleImportance(note.id)}>{note.important ? <>Set to important</>:<>Set to unimportant</>}</button>
            <button onClick={() => removeNote(note.id)}>Delete</button>
        </div>
        </li>
    )
}

export default Note