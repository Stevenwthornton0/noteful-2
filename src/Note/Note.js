import React from 'react'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './Note.css'
import config from '../config'
import NotefulContext from '../NotefulContext'

class Note extends React.Component {

static defaultProps = {
  onDeleteNote: () => {}
}

static contextType = NotefulContext

deleteNoteRequest = (noteId) => {
  fetch(config.API_ENDPOINT_NOTES + `/${noteId}`, {
    method: 'DELETE',
    headers: {
      'content-type': 'application/json'
    }
  })
    .then(res => {
      if(!res.ok) {
        return res.json().then(error => {
          throw error
        })
      }
      return res.json()
    })
    .then(data => {
      this.context.deleteNote(noteId)
      this.props.onDeleteNote(noteId)
    })
    .catch(err => {
      console.log(err)
    })
}

render() {
  console.log('blah')
  return (
        <div className='Note'>
          <h2 className='Note__title'>
            <Link to={`/note/${this.props.id}`}>
              {this.props.name}
            </Link>
          </h2>
          <button 
            onClick={() => {
              this.deleteNoteRequest(this.props.id)
            }}
            className='Note__delete' type='button'>
            <FontAwesomeIcon icon='trash-alt' />
            {' '}
            remove
          </button>
          <div className='Note__dates'>
            <div className='Note__dates-modified'>
              Modified
              {' '}
              <span className='Date'>
                {format(this.props.modified, 'Do MMM YYYY')}
              </span>
            </div>
          </div>
        </div>
      )}
}

export default Note;
