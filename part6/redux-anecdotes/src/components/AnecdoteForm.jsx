import {useDispatch} from 'react-redux'
import {createAnecdote} from '../reducers/anecdoteReducer'
import {setNotification, clearNotification} from '../reducers/notificationReducer'
import anecdoteService from '../services/anecdotes'

const AnecdoteForm = () => {
  const dispatch = useDispatch()

  const createNew = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    console.log('create', content)
    anecdoteService
      .createNew(content)
      .then(anecdote => {
        dispatch(createAnecdote(anecdote))
        dispatch(setNotification(`you created '${content}'`))
        setTimeout(() => {
          dispatch(clearNotification())
        }, 5000)
      })
  }

  return (
    <>
      <h2>create new</h2>
      <form onSubmit={createNew}>
        <div><input name="anecdote"/></div>
        <button type="submit">create</button>
      </form>
    </>
  )
}

export default AnecdoteForm
