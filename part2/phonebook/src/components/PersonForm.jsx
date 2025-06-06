const PersonForm = ( {formHandler, name, nameHandler, number, numberHandler} ) => {
  return (
    <div>
      <form onSubmit={formHandler}>
        <div>
          name: <input value={name}
                       onChange={nameHandler}/>
        </div>
        <div>
          number: <input value={number}
                         onChange={numberHandler}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    </div>
  )
}

export default PersonForm