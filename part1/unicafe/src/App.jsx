import { useState } from 'react'

const Button = (props) => {
  const onClick = props.onClick
  const text = props.text
  return (
    <>
      <button onClick={onClick}>{text}</button>
    </>
  )
}

const StaticLine = (props) => {
  const text = props.text
  const value = props.value
  return (
    <p>{text} {value}</p>
  )
}

const Row = (props) => {
  const text = props.text
  const value = props.value
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  )
}

const Statistics = (props) => {
  const good = props.good
  const neutral = props.neutral
  const bad = props.bad
  if ( good !=  0 || neutral != 0 || bad != 0 ) {
    return (
      <div>
        <h2>statistics</h2>
        <table>
          <tbody>
          <Row text="good" value={good} />
          <Row text="neutral" value={neutral} />
          <Row text="bad" value={bad} />
          <Row text="all" value={good + neutral + bad} />
          <Row text="average" value={(good * 1 + neutral * 0 + bad * -1) /
                                     (good + neutral + bad)} />
          <Row text="possitive" value={good / (good + neutral + bad) * 100 + "%"} />
          </tbody>
        </table>
      </div>
    )
  }
  return (
    <div>
      <h2>statistics</h2>
      <p>No feedback given</p>
    </div>
  )
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <h1>give feedback</h1>
      <Button onClick={() => setGood(good + 1)} text="good" />
      <Button onClick={() => setNeutral(neutral + 1)} text="neutral" />
      <Button onClick={() => setBad(bad + 1)} text="bad" />
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App