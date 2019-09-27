import config from './config'


export const getNotes = () => {
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
}