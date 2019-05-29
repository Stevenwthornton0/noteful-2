import React from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Note from '../Note/Note'
import CircleButton from '../CircleButton/CircleButton'
import NotefulContext from '../NotefulContext'
import { getNotesForFolder } from '../notes-helpers'
import './NoteListMain.css'

class NoteListMain extends React.Component {

  static Props = {
    notes: [],
  }
  
  render() {
    const { folderId } = this.props.match.params
    return (
      <NotefulContext.Consumer>
        {(context) => {
          const notes = getNotesForFolder(context.notes, folderId)
        return (
          <section className='NoteListMain'>
            <ul>
              {notes.map(note =>
                <li key={note.id}>
                  <Note
                    id={note.id}
                    name={note.name}
                    modified={note.modified}
                  />
                </li>
              )}
            </ul>
            <div className='NoteListMain__button-container'>
              <CircleButton
                tag={Link}
                to='/add-note'
                type='button'
                className='NoteListMain__add-note-button'
              >
                <FontAwesomeIcon icon='plus' />
                <br />
                Note
              </CircleButton>
            </div>
          </section>
        )
      }}
    </NotefulContext.Consumer>
    )
  }  
}


export default NoteListMain;
