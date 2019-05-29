import React from 'react'
import Note from '../Note/Note'
import './NotePageMain.css'
import NotefulContext from '../NotefulContext';
import { findNote } from '../notes-helpers'

class NotePageMain extends React.Component {
  static Props = {
    note: {
      content: '',
    }
  }

  handleDeleteNote = noteId => {
    this.props.history.push('/')
  }

  render() {
    const { noteId } = this.props.match.params
    return (
      <NotefulContext.Consumer>
        {(context) => {
          const note = findNote(context.notes, noteId)
          return (
            <section className='NotePageMain'>
              <Note
                id={note.id}
                name={note.name}
                modified={note.modified}
                onDeleteNote={this.handleDeleteNote}
              />
              <div className='NotePageMain__content'>
                {note.content.split(/\n \r|\n/).map((para, i) =>
                  <p key={i}>{para}</p>
                )}
              </div>
            </section>
          )
        }}
      </NotefulContext.Consumer>
    )
  }
}

export default NotePageMain;
