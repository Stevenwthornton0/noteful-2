import React from 'react'
import { NavLink, Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import CircleButton from '../CircleButton/CircleButton'
import { countNotesForFolder } from '../notes-helpers'
import PropTypes from 'prop-types'
import './NoteListNav.css'
import NotefulContext from '../NotefulContext';

export default function NoteListNav(props) {
  return (
    <NotefulContext.Consumer>
      {(context) => {
        return (
          <div className='NoteListNav'>
            <ul className='NoteListNav__list'>
              {context.folders.map(folder =>
                <li key={folder.id}>
                  <NavLink
                    className='NoteListNav__folder-link'
                    to={`/folder/${folder.id}`}
                  >
                    <span className='NoteListNav__num-notes'>
                      {countNotesForFolder(context.notes, folder.id)}
                    </span>
                    {folder.name}
                  </NavLink>
                </li>
              )}
            </ul>
            <div className='NoteListNav__button-wrapper'>
              <CircleButton
                tag={Link}
                to='/add-folder'
                type='button'
                className='NoteListNav__add-folder-button'
              >
                <FontAwesomeIcon icon='plus' />
                <br />
                Folder
              </CircleButton>
            </div>
          </div>
        ) 
      }}
    </NotefulContext.Consumer>
  )
}

NoteListNav.defaultProps = {
  folders: []
}

NoteListNav.propTypes = {
  folders: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
  }))
}
