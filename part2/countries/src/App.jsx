import { useState, useEffect } from 'react'
import Country from './components/Country'
import countryService from './services/countries'

function App() {
  const [countries, setCountries] = useState([])
  const [showCountries, setShowCountries] = useState([])
  const [filter, setFilter] = useState("")
  const [index, setIndex] = useState("")
  const [weather, setWeather] = useState(null)

  useEffect(() => {
    countryService.getCountries().then(returnedCountries  => {
      setCountries(returnedCountries)
    })
  }, [])

  useEffect(() => {
    setShowCountries(
      filter
      ? countries.filter(country => country.name.common.toLowerCase().includes(filter.toLowerCase()))
      : countries
    )
  }, [countries, filter])

  useEffect(() => {    
    if (showCountries.length === 1) {
      const [country] = showCountries
      countryService.getWeather(country.capital, country.cca2).then(returnedWeather =>
        setWeather({
          temp: returnedWeather.main.temp,
          icon: returnedWeather.weather[0].icon,
          description: returnedWeather.weather[0].description,
          speed: returnedWeather.wind.speed
        })
      )
    } 
  }, [showCountries])

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }
  
  return (
    <div>
      find countries:
      <input value={filter}
             onChange={handleFilterChange}/>
      {showCountries.length == 1 ? <Country country={showCountries[0]} weather={weather} /> :
       showCountries.map((country) =>
        <div key={country.cca2}>
          {country.name.common}
          <button onClick={() => setIndex(index == country.cca2 ? "" : country.cca2)}>
            {index == country.cca2 ? 'hide' : 'show'}
          </button>
          {index == country.cca2 && <Country country={country} weather={weather}/>}
        </div>
      )}
    </div>
  )
}

export default App
