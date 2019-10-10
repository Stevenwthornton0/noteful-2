import React from 'react'
import Note from '../Note/Note'
import { Link } from 'react-router-dom'
import CircleButton from '../CircleButton/CircleButton'
import './NotePageMain.css'
import NotefulContext from '../NotefulContext'
import PropTypes from 'prop-types'
import config from '../config'
import { findNote, countNotesForFolder } from '../notes-helpers'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class NotePageMain extends React.Component {

  static props = {
    note: {
      content: '',
      id: '',
      name: '',
      date_modified: ''
    }
  }

  static PropTypes = {
    notes: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      modified: PropTypes.string.isRequired,
      folderId: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired
    }))
  }

  handleDeleteNote = noteId => {
    this.props.history.push('/')
  }

  render() {
    const { noteId } = this.props.match.params;
    console.log(this.state)
    return (
      <NotefulContext.Consumer>
        {(context) => {
          const note = findNote(context.notes, noteId)
          return (
            <section className='NotePageMain'>
              <Note
                id={note.id}
                name={note.name}
                modified={note.date_modified}
                onDeleteNote={this.handleDeleteNote}
              />
              <div className='NotePageMain__content'>
                {note.content.split(/\n \r|\n/).map((para, i) =>
                  <p key={i}>{para}</p>
                )}
              </div>

              <div className='NoteMain_button-container'>
                <CircleButton
                  tag={Link}
                  to={`/edit/${this.props.id}`}
                  type='button'
                  className='NoteMain_edit-note-button'
                >
                  <FontAwesomeIcon icon="edit" symbol="edit-icon" />
                  <br />
                  Edit
                </CircleButton>
              </div>

            </section>
          )
        }}
      </NotefulContext.Consumer>
    )
  }
}

export default NotePageMain;
