import { useState } from 'react'

const Button = ({ state, setState, text }) => {
  const onClick = () => {setState(state + 1)}
  return (
    <button onClick={onClick}>
      {text}
    </button>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <h1>Give feedback</h1>
      <Button state={good} setState={setGood} text="good"/>
      <Button state={neutral} setState={setNeutral} text="neutral"/>
      <Button state={bad} setState={setBad} text="bad"/>
      <h1>Statistics</h1>
      <p>good {good}</p>
      <p>neutral {neutral}</p>
      <p>bad {bad}</p>
    </div>
  )
}

export default App