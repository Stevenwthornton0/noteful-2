import React from 'react'
import './NotefulForm.css'

export default function NotefulForm(props) {
  const { className, ...otherProps } = props
  return (
    <form
      onSubmit={props.onSubmit}
      className={['Noteful-form', className].join(' ')}
      action='POST'
      {...otherProps}
    />
  )
}
