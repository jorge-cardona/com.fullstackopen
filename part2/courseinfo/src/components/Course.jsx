const Header = ( {name} ) => {
  return (
    <div>
      <h2>{name}</h2>
    </div>
  )
}

const Part = ( {name, exercises} ) => {
  return (
    <div>
      <p>
        {name} {exercises}
      </p>
    </div>
  )
}

const Content = ( {parts} ) => {
  return (
    <div>
      { parts.map((part) => (
        <Part key={part.id} name={part.name} exercises={part.exercises} />
      )) }
    </div>
  )
}

const Total = ( {parts} ) => {
  return (
    <div>
      <p>Number of exercises {parts.reduce((accum, part) => accum + part.exercises, 0)}</p>
    </div>
  )
}

const Course = ( { course } ) => {
  return (
    <div>
      <Header name={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  )
}

export default Course