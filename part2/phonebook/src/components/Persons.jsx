const Person = ( {name, number} ) => <p><b>{name} - {number}</b></p>

const Persons = ( {persons, handler} ) => {
  return (
    <div>
        {persons.map(person =>
          <p key={person.id}>
            <b>{person.name} - {person.number}</b>
            <button onClick={() => handler(person.id, person.name)}>delete</button>
          </p>
        )}
      </div>
  )   
}

export default Persons