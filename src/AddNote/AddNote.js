import React, { Component } from 'react'
import NotefulForm from '../NotefulForm/NotefulForm'
import NotefulContext from '../NotefulContext'
import config from '../config'
import ValidationError from '../ValidationError'
import './AddNote.css'

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

  handleSubmit = e => {
    e.preventDefault();
    const { name, content, folder } = this.state
    const date = new Date();

    // this.validateForm(name, content, folder)

    const note = {
      id: Math.random().toString(36).substr(2, 9),
      name: name,
      modified: date.toISOString(),
      folderId: folder,
      content: content
    }

    fetch(config.API_ENDPOINT_NOTES, {
      method: 'POST',
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
        return res.json()
      })
      .then(data => {
        this.setState({
          name: '',
          content: '',
          folder: ''
        })
        this.context.addNote(data)
        this.props.history.push('/')
      })
      .catch(error => {
        console.log(error)
      })

  }

  render() {
    const { folders } = this.context
    return (
      <section className='AddNote'>
        <h2>Create a note</h2>
        <NotefulForm onSubmit={this.handleSubmit}>
          <div className='field'>
            <label htmlFor='note-name-input'>
              Name
            </label>
            <input type='text' id='note-name-input' onChange={e => this.updateName(e.target.value)} />
            <ValidationError 
              hasError={!this.state.nameValid}
              message={this.state.validationMessages.name}
            />            
          </div>
          <div className='field'>
            <label htmlFor='note-content-input'>
              Content
            </label>
            <textarea id='note-content-input' onChange={e => this.updateContent(e.target.value)}/>
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
              <option value={null}>...</option>
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
              Add note
            </button>
          </div>
        </NotefulForm>
      </section>
    )
  }
}
