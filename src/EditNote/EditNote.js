import React, { Component } from 'react'
import NotefulForm from '../NotefulForm/NotefulForm'
import NotefulContext from '../NotefulContext'
import config from '../config'
import ValidationError from '../ValidationError'
import { findNote, findCurrFolder } from '../notes-helpers'
import './EditNote.css'

export default class AddNote extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      content: '',
      folder: '',
      nameValid: false,
      contentValid: false,
      folderValid: false,
      formValid: false,
      validationMessages: {
        name: '',
        content: '',
        folder: ''
      }
    }
  }

  static contextType = NotefulContext;

  static defaultProps = {
    folders: [],
  }

  updateName(name) {
    this.setState({ name }, () => this.validateName(name))
  }

  updateContent(content) {
    this.setState({ content }, () => this.validateContent(content))
  }

  updateFolder(folder) {
    this.setState({ folder }, () => this.validateFolder(folder))
  }

  validateName(fieldValue) {
    const fieldErrors = {...this.state.validationMessages}
    let hasError = false

    fieldValue = fieldValue.trim();
    if(fieldValue.length === 0) {
      fieldErrors.name = 'Name is required';
      hasError = true
    } else {
      fieldErrors.name = ''
      hasError = false
    }

    this.setState({
      validationMessages: fieldErrors,
      nameValid: !hasError
    }, this.formValid)
  }

  validateContent(fieldValue) {
    const fieldErrors = {...this.state.validationMessages}
    let hasError = false

    fieldValue = fieldValue.trim();
    if(fieldValue.length === 0) {
      fieldErrors.content = 'Content is required';
      hasError = true
    } else {
      fieldErrors.content = ''
      hasError = false
    }

    this.setState({
      validationMessages: fieldErrors,
      contentValid: !hasError
    }, this.formValid)
  }

  validateFolder(fieldValue) {
    const fieldErrors = {...this.state.validationMessages}
    let hasError = false

    if(fieldValue === '...') {
      fieldErrors.content = 'Folder selection is required';
      hasError = true
    } else {
      fieldErrors.folder = ''
      hasError = false
    }

    this.setState({
      validationMessages: fieldErrors,
      folderValid: !hasError
    }, this.formValid)
  }

  // validateForm = (name, content, folder) => {
  //   this.validateName(name)
  //   this.validateContent(content)
  //   this.validateFolder(folder)
  // }

  formValid() {
    this.setState({
      formValid: this.state.nameValid && this.state.contentValid && this.state.folderValid
    })
  }

  getCurrFold = (folders, note) => {
    const folder = folders.filter(folder => 
      folder.id !== note.folder_id
      )
    return folder.name
  }

  handleSubmit = e => {
    e.preventDefault();
    const { name, content, folder } = this.state
    const date = new Date();

    // this.validateForm(name, content, folder)

    const note = {
      name: name,
      date_modified: date.toISOString(),
      folder_id: parseInt(folder),
      content: content
    }
    console.log(note)

    fetch(`http://localhost:8000/notes/${this.props.match.params.noteId}`, {
      method: 'PATCH',
      body: JSON.stringify(note),
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
        this.setState({
          name: '',
          content: '',
          folder: ''
        })
        this.context.updateNote(data)
        this.props.history.push('/')
      })
      .catch(error => {
        console.log(error)
      })

  }

  render() {
    const { folders } = this.context;
    const { noteId } = this.props.match.params;
    const note = findNote(this.context.notes, noteId);
    const currentFolder = findCurrFolder(folders, note.folder_id)
    console.log(this.state)
    return (
      <section className='AddNote'>

        <h2>Edit note</h2>

        <NotefulForm onSubmit={this.handleSubmit}>

          <div className='field'>
            <label htmlFor='note-name-input'>
              Name
            </label>

            <input type='text' placeholder={note.name} id='note-name-input' onChange={e => this.updateName(e.target.value)} />

            <ValidationError 
              hasError={!this.state.nameValid}
              message={this.state.validationMessages.name}
            />       
          </div>

          <div className='field'>
            <label htmlFor='note-content-input'>
              Content
            </label>

            <textarea id='note-content-input' placeholder={note.content} onChange={e => this.updateContent(e.target.value)}/>

            <ValidationError 
              hasError={!this.state.contentValid}
              message={this.state.validationMessages.content}
            />
          </div>

          <div className='field'>
            <label htmlFor='note-folder-select'>
              Folder
            </label>

            <select id='note-folder-select' onChange={e => this.updateFolder(e.target.value)}>
              <option value='' disabled selected>{currentFolder.name}</option>
              {folders.map(folder =>
                <option key={folder.id} value={folder.id}>
                  {folder.name}
                </option>
              )}
            </select>

            <ValidationError 
              hasError={!this.state.folderValid}
              message={this.state.validationMessages.folder}
            />
          </div>
          <div className='buttons'>
            <button type='submit' disabled={!this.state.formValid}>
              Edit note
            </button>
          </div>
        </NotefulForm>
      </section>
    )
  }
}
