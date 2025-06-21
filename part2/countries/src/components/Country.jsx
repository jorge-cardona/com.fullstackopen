const Country = ( {country, weather} ) => {
  if (!weather) {
    return <div>loading ...</div>
  }
  const {name, capital, area, languages, flags, alt} = country
  const {temp, icon, description, speed} = weather
  
  return(
    <div>
      <h1>{name.common}</h1>
      <p>Capital {capital}</p>
      <p>Area    {area}</p>
      <h2>Languages</h2>
      <ul>
        {Object.values(languages).map((language, index) =>
          <li key={index}>{language}</li>
        )}
      </ul>
      <img src={flags.png} alt={alt}/>
      <h2>Weather in {capital}</h2>
      <p>Temperature {temp} Celsius</p>
      <img src={`https://openweathermap.org/img/wn/${icon}@2x.png`}  alt={description}/>
      <p>Wind {speed} m/s</p>
    </div>
  )
}

export default Country