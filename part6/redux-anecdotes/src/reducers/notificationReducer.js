import { createSlice } from '@reduxjs/toolkit'

const initialState = ''

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    updateNotification(state, action) {
      return action.payload
    },
    clearNotification(state, action) {
      state, action
      return ''
    }
  }
})

export const setNotification = (message, time) => {
  return async dispatch => {
    dispatch(updateNotification(message))
    setTimeout(() => {
      dispatch(clearNotification())
    }, time * 1000)
  }
}

export const { updateNotification, clearNotification } = notificationSlice.actions
export default notificationSlice.reducer