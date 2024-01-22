import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useContext } from 'react'

import NotificationContext from './NotificationContext'

import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'

import { getAll, createNew, update } from './requests'

const App = () => {
  const [notification, notificationDispatch] = useContext(NotificationContext)

  const displayNotification = (message, duration) => {
    notificationDispatch({type: "SET", payload: message})
    setTimeout(() => {
      notificationDispatch({type: "CLEAR"})
    }, duration * 1000)
  }

  const queryClient = useQueryClient()

  const newAnecdoteMutation = useMutation({
    mutationFn: createNew,
    onSuccess: (newAnecdote) => {
      const anecdotes = queryClient.getQueryData(['anecdotes'])
      queryClient.setQueryData(['anecdotes'], anecdotes.concat(newAnecdote))
    },
    onError: (error) => {
      console.log(error)
      displayNotification('too short anecdote, must have length 5 or more', 5)
    }
  })

  const updateMutation = useMutation({
    mutationFn: update,
    onSuccess: (updatedAnecdote) => {
      const anecdotes = queryClient.getQueryData(['anecdotes'])
      queryClient.setQueryData(
        ['anecdotes'], 
        anecdotes.map(a => a.id === updatedAnecdote.id ? updatedAnecdote : a)
      )
    }
  })

  const addAnecdote = (content) => {
    console.log('add anecdote')
    newAnecdoteMutation.mutate(content)
    displayNotification(`anecdote ${content} created`, 5)
  }

  const handleVote = (anecdote) => {
    updateMutation.mutate({...anecdote, votes: anecdote.votes + 1})
    displayNotification(`you voted ${anecdote.content}`, 5)
  }

  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAll,
    refetchOnWindowFocus: false
  })

  if ( result.isLoading ) {
    return <div>loading data...</div>
  }

  if ( result.isError ) {
    return <div>anecdote service is not available due to problems in server</div>
  }

  const anecdotes = result.data

  return (
    <div>
      <h3>Anecdote app</h3>
    
      <Notification />
      <AnecdoteForm addAnecdote={addAnecdote} />
    
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
