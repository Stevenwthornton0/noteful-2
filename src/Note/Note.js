import React from 'react'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PropTypes from 'prop-types'
import CircleButton from '../CircleButton/CircleButton'
import './Note.css'
import config from '../config'
import NotefulContext from '../NotefulContext'

class Note extends React.Component {

static defaultProps = {
  onDeleteNote: () => {}
}

static PropTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  modified: PropTypes.string.isRequired
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
      return res
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
  return (
        <div className='Note'>

          <h2 className='Note__title'>
            <Link to={`/notes/${this.props.id}`}>
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
                {format(this.props.modified, 'DD MMM YYYY')}
                {/* {this.props.modified} */}
              </span>

            </div>
          </div>
        </div>
      )}
}

export default Note;
