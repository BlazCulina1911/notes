const Note = ({note, toggleImportance, removeNote}) => {
    return(
        <li className='note' key={note.content}>
            {note.content}
        <div>
            <button onClick={() => toggleImportance(note.id)}>{note.important ? <>Set to unimportant</> : <>Set to important</> }</button>
            <button onClick={() => removeNote(note.id)}>Delete</button>
        </div>
        </li>
    )
}

export default Note