import React, { Component } from 'react'
import NotefulForm from '../NotefulForm/NotefulForm'
import config from '../config'
import NotefulContext from '../NotefulContext'
import './AddFolder.css'
import ValidationError from '../ValidationError';

export default class AddFolder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      nameValid: false,
      validationMessages: {
        name: ''      
      }
    }
  }

  static contextType = NotefulContext;

  updateName(name) {
    this.setState({ name }, () => this.validateName(name))
  }

  validateName = fieldValue => {
    const fieldErrors = {...this.state.validationMessages}
    let hasError = false
    fieldValue = fieldValue.trim();

    if(fieldValue.length === 0) {
      fieldErrors.name = 'Name is required'
      hasError = true
    } else {
      fieldErrors.name = ''
      hasError = false
    }

    this.setState({
      nameValid: !hasError,
      validationMessages: fieldErrors
    })
  }

  handleSubmit = e => {
    e.preventDefault();
    const { name } = this.state

    const folder = {
      name: name
    }

    fetch(config.API_ENDPOINT_FOLDERS, {
      method: 'POST',
      body: JSON.stringify(folder),
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
          name: ''
        })
        this.context.addFolder(data)
        this.props.history.push('/')
      })
      .catch(error => {
        console.log(error)
      })
  }

  render() {
    return (
      <section className='AddFolder'>
        <h2>Create a folder</h2>
        <NotefulForm onSubmit={this.handleSubmit}>
          <div className='field'>
            <label htmlFor='folder-name-input'>
              Name
            </label>
            <input type='text' id='folder-name-input' onChange={e => this.updateName(e.target.value)}/>
            <ValidationError
              hasError={!this.state.nameValid}
              message={this.state.validationMessages.name} />
          </div>
          <div className='buttons'>
            <button type='submit' disabled={!this.state.nameValid}>
              Add folder
            </button>
          </div>
        </NotefulForm>
      </section>
    )
  }
}
