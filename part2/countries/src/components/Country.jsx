const Country = ( {country} ) => {
  const {name, capital, area, languages, flags, alt} = country
  
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
    </div>
  )
}

export default Country