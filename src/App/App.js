import React, { Component } from 'react'
import { Route, Link, Switch } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import NoteListNav from '../NoteListNav/NoteListNav'
import NotePageNav from '../NotePageNav/NotePageNav'
import NoteListMain from '../NoteListMain/NoteListMain'
import NotePageMain from '../NotePageMain/NotePageMain'
import EditNote from '../EditNote/EditNote'
import AddFolder from '../AddFolder/AddFolder'
import AddNote from '../AddNote/AddNote'
import config from '../config'
import ErrorBoundary from '../ErrorBoundary'
import NotefulContext from '../NotefulContext'
import { getNotesForFolder, findNote, findFolder } from '../notes-helpers'
import { getNotes } from '../api-requests'
import './App.css'

class App extends Component {
  state = {
    notes: [],
    folders: [],
  };

  setNotes = (notes) => {
    this.setState({
      notes
    })
  }

  setFolders = (folders) => {
    this.setState({
      folders
    })
  }

  addNote = note => {
    this.setState({
      notes: [...this.state.notes, note]
    })
  }

  addFolder = folder => {
    this.setState({
      folders: [...this.state.folders, folder]
    })
  }

  deleteNote = noteId => {
    const newNotes = this.state.notes.filter(n =>
      n.id !== noteId
      )
    this.setState({
      notes: newNotes
    })
  }

  updateNote = updatedNote => {
    const newNotes = this.state.notes.map(note => 
      (note.id === updatedNote.id)
        ? updatedNote
        : note  
    )
    this.setState({
      notes: newNotes
    })
  };

  componentDidMount() {
    fetch(config.API_ENDPOINT_NOTES, {
      method: 'GET',
      headers: {
        'content-type': 'application/json'
      }
    })
      .then(res => {
        if (!res.ok) {
          throw new Error(res.status)
        }
        return res.json()
      })
      // .then(data => console.log(data))
      .then(data => this.setNotes(data))
      .catch(err => console.log(err))

    fetch(config.API_ENDPOINT_FOLDERS, {
      method: 'GET',
      headers: {
        'content-type': 'application/json'
      }
    })
    .then(res => {
      if (!res.ok) {
        throw new Error(res.status)
      }
      return res.json()
    })
    // .then(data => console.log(data))
    .then(data => this.setFolders(data))
    .catch(err => console.log(err))
  }

  renderNavRoutes() {
    const contextValue = {
      notes: this.state.notes,
      folders: this.state.folders,
      deleteNote: this.deleteNote,
      updateNote: this.updateNote,
      addNote: this.addNote,
      addFolder: this.addFolder
    }
    return (
      <NotefulContext.Provider value={contextValue}>
        {['/', '/folder/:folderId'].map(path =>
          <Route
            exact
            key={path}
            path={path}
            render={routeProps =>
              <NoteListNav
                {...routeProps}
              />
            }
          />
        )}
        <Route
          path='/notes/:noteId'
          render={routeProps => {
            return (
              <NotePageNav
                {...routeProps}
              />
            )
          }}
        />
        <Route
          path='/add-folder'
          component={NotePageNav}
        />
        <Route
          path='/add-note'
          component={NotePageNav}
        />
      </NotefulContext.Provider>
    )
  }

  renderMainRoutes() {
    const contextValue = {
      notes: this.state.notes,
      folders: this.state.folders,
      deleteNote: this.deleteNote,
      addNote: this.addNote,
      addFolder: this.addFolder,
      updateNote: this.updateNote
    }
    return (
      <NotefulContext.Provider value={contextValue}>
        {['/', '/folder/:folderId'].map(path =>
          <Route
            exact
            key={path}
            path={path}
            render={routeProps => {
              return (
                <NoteListMain
                  {...routeProps}
                />
              )
            }}
          />
        )}
        <Route
          path='/notes/:noteId'
          render={routeProps => {
            return (
              <NotePageMain
                {...routeProps}
              />
            )
          }}
        />
        <Route
          path='/add-folder'
          component={AddFolder}
        />
        <Route
          path='/add-note'
          render={routeProps => {
            return (
              <AddNote
                {...routeProps}
              />
            )
          }}
        />
        <Route 
          path='/edit/:noteId'
          render={routeProps => {
            return (
              <EditNote 
                {...routeProps}
              />
            )
          }}
        />
      </NotefulContext.Provider>
    )
  }

  render() {
    return (
      <div className='App'>
        <nav className='App__nav'>
          <ErrorBoundary>
            {this.renderNavRoutes()}
          </ErrorBoundary>
        </nav>
        <header className='App__header'>
          <h1>
            <Link to='/'>Noteful</Link>
            {' '}
            <FontAwesomeIcon icon='check-double' />
          </h1>
        </header>
        <main className='App__main'>
          <ErrorBoundary>
            {this.renderMainRoutes()}
          </ErrorBoundary>
        </main>
      </div>
    )
  }
}

export default App
