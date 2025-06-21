import { useState, useEffect } from 'react'
import Country from './components/Country'
import countryService from './services/countries'

function App() {
  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState("")
  const [index, setIndex] = useState("")
  const [weather, setWeather] = useState(null)

  useEffect(() => {
    countryService.getCountries().then(returnedCountries  => {
      setCountries(returnedCountries)
    })
  }, [])

  useEffect(() => {
    if (countriesToShow.length === 1) {
      const [country] = countriesToShow
      countryService.getWeather(country.capital, country.cca2).then(returnedWeather =>
        setWeather(returnedWeather))
    } 
  }, [countriesToShow])

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const countriesToShow = filter
                        ? countries.filter(
                            country => country.name.common.toLowerCase().includes(filter.toLowerCase())
                          )
                        : countries

  const showWeather = (capital, cca2) => {
    return countryService.getWeather(capital, cca2).then(returnedWeather => ({
      temp: returnedWeather.main.temp,
      icon: returnedWeather.weather[0].icon,
      description: returnedWeather.weather[0].description,
      speed: returnedWeather.wind.speed}
    ))
  }
    
  return (
    <div>
      find countries:
      <input value={filter}
             onChange={handleFilterChange}/>
      {countriesToShow.length == 1 ? <Country country={countriesToShow[0]} weather={showWeather(countriesToShow[0].capital, countriesToShow[0].cca2)} /> :
       countriesToShow.map((country) =>
        <div key={country.cca2}>
          {country.name.common}
          <button onClick={() => setIndex(index == country.cca2 ? "" : country.cca2)}>
            {index == country.cca2 ? 'hide' : 'show'}
          </button>
          {index == country.cca2 && <Country country={country} />}
        </div>
      )}
    </div>
  )
}

export default App
