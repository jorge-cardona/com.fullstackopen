import { useState } from "react"

const Hello = ({ name, age }) => {
  
  const bornYear = () => new Date().getFullYear() - age
  return (
    <div>
      <p>
        Hello {name}, you are {age} years old
      </p>
      <p>
        So you were probably born in {bornYear()}
      </p>
    </div>
  )
}

const Footer = () => {
  return (
    <div>
      greeting app created by <a href="https://github.com/mluukkai">mluukkai</a>
    </div>
  )
}

const Display = ({ counter }) => <div>{counter}</div>

const Button = (props) => (
  // console.log('props value is', props)
  // const { onClick, text } = props
  // return (
  //   <button onClick={onClick}>{text}</button>
  // )
  <button onClick={props.onClick}>
    {props.text}
  </button>
)

const History = (props) => {
  if (props.allClicks.length === 0) {
    return (
      <div>
        the app is used by pressing the buttons
      </div>
    )
  }
  return (
    <div>
      button press history: {props.allClicks.join(' ')}
    </div>
  )
}

const App = () => {
//   const friends = [
//     { name: 'Peter', age: 4 },
//     { name: 'Maya', age:10 },
//   ]

//   return (
//     <div>
//       <p>{friends[0].name} {friends[0].age}</p>
//       <p>{friends[1].name} {friends[1].age}</p>
//     </div>
//   )

  // const friends = [ 'Peter', 'Maya' ]

  // return (
  //   <div>
  //     <p>{friends}</p>
  //   </div>
  // )

// const App = () => {
//   const now = new Date()
//   const a = 10
//   const b = 20

//   return React.createElement(
//     'div',
//     null,
//     React.createElement(
//       'p', null, 'Hello world, it is  ', now.toString()
//     ),
//     React.createElement(
//       'p', null, ' plus ', b, ' is ', a + b
//     )
//   )

  // const name = 'Peter'
  // const age = 10

  // return (
  //   <div>
  //     <h1>Grettings</h1>
  //     <Hello name="Maya" age={26 + 10} />
  //     <Hello name={name} age={age} />
  //   </div>
  // )

  // const [ counter, setCounter ] = useState(0)
  // console.log('rendering with counter value', counter)

  // const handleClick = () => {
  //   console.log('clicked')
  // }

  // setTimeout(
  //   () => setCounter(counter + 1),
  //   1000
  // )

  // console.log('rendering ...', counter)

  // const increaseByOne = () => {
  //   console.log('increasing, value before', counter)
  //   setCounter(counter + 1)
  // }
  // const decreaseByOne = () => {
  //   console.log('decreasing, value before', counter)
  //   setCounter(counter - 1)
  // }
  // const setToZero = () => {
  //   console.log('resetting to zero, value before', counter)
  //   setCounter(0)
  // }

  // return (
  //   <div>
  //     <Display counter={counter} />
  //     <Button onClick={increaseByOne}
  //             text='plus' />
  //     <Button onClick={setToZero}
  //             text='zero' />
  //     <Button onClick={decreaseByOne}
  //             text='minus' />
  //   </div>
  // )

  // const [left, setLeft] = useState(0)
  // const [right, setRight] = useState(0)

  // const [left, setLeft] = useState(0)
  // const [right, setRight] = useState(0)
  // const [allClicks, setAll] = useState([])
  // const [total, setTotal] = useState(0)

  // const handleLeftClick = () => {
  //   setAll(allClicks.concat('L'))
  //   const updatedLeft = left + 1
  //   setLeft(updatedLeft)
  //   setTotal(updatedLeft + right)
  // }

  // const handleRightClick = () => {
  //   setAll(allClicks.concat('R'))
  //   const updatedRight = right + 1
  //   setRight(updatedRight)
  //   setTotal(left + updatedRight)
  // }

  // return (
  //   <div>
  //     {left}
  //     <Button onClick={handleLeftClick} text='left' />
  //     <Button onClick={handleRightClick} text='right' />
  //     {right}
  //     <History allClicks={allClicks} />
  //   </div>
  // )

  const [value, setValue] = useState(10)

  const setToValue = (newValue) => {
    console.log('value now', newValue)
    setValue(newValue)
  }

  return (
    <div>
      {value}
      <Button onClick={() => setToValue(1000)} text="thousand" />
      <Button onClick={() => setToValue(value + 1)} text="increment" />
      <Button onClick={() => setToValue(0)} text="reset" />
    </div>
  )
}

export default App