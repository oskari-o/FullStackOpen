import {useDispatch} from 'react-redux'
import {createAnecdote} from '../reducers/anecdoteReducer'
import {setNotification} from '../reducers/notificationReducer'

const AnecdoteForm = () => {
  const dispatch = useDispatch()

  const createNew = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    console.log('create', content)
    dispatch(createAnecdote(content))
    dispatch(setNotification(`you created '${content}'`, 5))
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
