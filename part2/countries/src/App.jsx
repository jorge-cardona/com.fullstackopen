import { useState, useEffect } from 'react'
import Countries from './components/Countries'
import countryService from './services/countries'

function App() {
  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState("")

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
      <Countries countries={countriesToShow} />
    </div>
  )
}

export default App
