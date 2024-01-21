import { useSelector, useDispatch } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'
import { setNotification} from '../reducers/notificationReducer'

const AnecdoteList = () => {
  const anecdotes = useSelector(state => {
    return state.anecdotes
      .filter(anecdote => anecdote.content.toLowerCase().includes(state.filter.toLowerCase()))
      .sort((a, b) => b.votes - a.votes)
  })
  const dispatch = useDispatch()

  const vote = (anecdote) => {
    console.log('vote', anecdote)
    dispatch(voteAnecdote(anecdote))
    dispatch(setNotification(`you voted '${anecdote.content}'`, 1))
  }

  return(
    <>
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </>
  )
}

export default AnecdoteList