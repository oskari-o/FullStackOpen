import { useState } from 'react'

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]
   
  const [selected, setSelected] = useState(0)

  // Scores stores a dictionary with keys from 0 to anecdotes.length - 1. Each key holds the number of votes the corresponding anecdote has received.
  const [scores, setScores] = useState(0)

  const storeScore = () => {
    if (scores[selected] === undefined) 
      {setScores({...scores, [selected]: 1})} 
    else 
      {setScores({...scores, [selected]: scores[selected] + 1})}
  }

  const maxScoreAnecdote = () => {
    var maxIndex = 0
    const keyValuePairs = Object.entries(scores)
    if (keyValuePairs.length != 0) {
      maxIndex = keyValuePairs.reduce((a, b) => a[1] > b[1] ? a : b)[0]
    }
    return (
      anecdotes[maxIndex]
    )
  }

  return (
    <div>
      <h1>Anecdote of the day</h1>
      <p>
        {anecdotes[selected]}
      </p>
      <p>
        has {scores[selected] || 0} votes
      </p>
      <button onClick={storeScore}>vote</button>
      <button onClick={() => setSelected(Math.floor(Math.random() * anecdotes.length))}>next anecdote</button>
      <h1>Anecdote with most votes</h1>
      <p>
        {maxScoreAnecdote()}
      </p>
    </div>
  )
}

export default App