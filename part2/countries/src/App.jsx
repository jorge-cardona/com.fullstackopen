import { useState, useEffect } from 'react'
import Country from './components/Country'
import countryService from './services/countries'

function App() {
  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState("")
  const [showIndex, setShowIndex] = useState("")

  useEffect(() => {
    countryService.getCountries().then(returnedCountries  => {
      setCountries(returnedCountries)
    })
  }, [])

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const countriesToShow = filter
                        ? countries.filter(
                            country => country.name.common.toLowerCase().includes(filter.toLowerCase())
                          )
                        : countries
  
  return (
    <div>
      find countries:
      <input value={filter}
             onChange={handleFilterChange}/>
      {countriesToShow.length == 1 ? <Country country={countriesToShow[0]} /> :
       countriesToShow.map((country, index) =>
        <div key={country.cca2 || index}>
          {country.name.common}
          <button onClick={() => setShowIndex(showIndex == country.cca2 ? "" : country.cca2)}>
            {showIndex == country.cca2 ? 'hide' : 'show'}
          </button>
          {showIndex == country.cca2 && <Country country={country} />}
        </div>
      )}
    </div>
  )
}

export default App
