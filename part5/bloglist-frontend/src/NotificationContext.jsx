import { createContext, useReducer } from 'react'

const messageReducer = (state, action) => {
  switch (action.type) {
    case 'SET':
      return action.payload
    case 'CLEAR':
      return null
    default:
      return state
  }
}

const messageTypeReducer = (state, action) => {
  switch (action.type) {
    case 'SET':
      return action.payload
    default:
      return state
  }
}

const NotificationContext = createContext()

export const NotificationContextProvider = (props) => {
  const [message, messageDispatch] = useReducer(messageReducer, null)
  const [messageType, messageTypeDispatch] = useReducer(
    messageTypeReducer,
    'info'
  )

  return (
    <NotificationContext.Provider
      value={[message, messageDispatch, messageType, messageTypeDispatch]}
    >
      {props.children}
    </NotificationContext.Provider>
  )
}

export default NotificationContext
