const Note = ({note, toggleImportance}) => {
    return(
        <li>
            {note.content}
        <div>
            <button onClick={() => toggleImportance(note.id)}>{note.important ? <>Set to important</>:<>Set to unimportant</>}</button>
        </div>
        </li>
    )
}

export default Note