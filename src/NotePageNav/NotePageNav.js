import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import CircleButton from '../CircleButton/CircleButton'
import PropTypes from 'prop-types'
import './NotePageNav.css'
import { findNote, findFolder } from '../notes-helpers'
import NotefulContext from '../NotefulContext'

class NotePageNav extends React.Component {
  static Props = {
    history: {
      goBack: () => {}
    }
  }

  static PropTypes = {
    notes: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      modified: PropTypes.string.isRequired,
      folderId: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired
    })),
    folders: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired
      }))
  }

  render() {
    const { noteId } = this.props.match.params
    return (
      <NotefulContext.Consumer>
        {(context) => {
          const note = findNote(context.notes, noteId) || {}
          const folder = findFolder(context.folders, note.folderId)
          return(
            <div className='NotePageNav'>
              <CircleButton
                tag='button'
                role='link'
                onClick={() => this.props.history.goBack()}
                className='NotePageNav__back-button'
              >
                <FontAwesomeIcon icon='chevron-left' />
                <br />
                Back
              </CircleButton>
              {folder && (
                <h3 className='NotePageNav__folder-name'>
                  {folder.name}
                </h3>
              )}
            </div>
          )
        }}
      </NotefulContext.Consumer>
    )
  }
}

export default NotePageNav;
