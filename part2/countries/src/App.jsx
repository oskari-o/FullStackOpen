import { useState, useEffect } from 'react'
import countryService from './services/countries'

const SearchField = ({ searchTerm, handleSearchTermChange }) => {
  return (
    <div>
      find countries <input 
        placeholder="Search..." 
        value={searchTerm} 
        onChange={handleSearchTermChange}
        />
    </div>
  )
}

const WeatherDisplay = ({ capitalName, weather, updateWeather }) => {
  if (weather === null || weather !== null && (weather.capital !== capitalName)) {
    updateWeather(capitalName)
    return (
      <>
        <h2>Weather in {capitalName}</h2>
        <p>Loading ...</p>
      </>
    )
  } else {
    return (
      <>
        <h2>Weather in {weather.capital}</h2>
        <p>temperature: {weather.temperature} Celcius</p>
        <img src={weather.weatherIconUrl} alt="weather icon"></img>
        <p>wind: {weather.windSpeed} m/s</p>
      </>
    )
  }
}

const SingleCountryDisplay = ({ countryName, countryObject, weather, updateWeather }) => {
  if (countryObject === null) {
    return (
      <>
        <h1>{countryName}</h1>
        <p>Loading ...</p>
      </>
    )
  } else {
    return (
      <>
        <h1>{countryName}</h1>
        <p>capital {countryObject.capital}</p>
        <p>area {countryObject.area}</p>
        <h3>languages:</h3>
        <ul>
          {Object.values(countryObject.languages).map(language => <li key={language}>{language}</li>)}
        </ul>
        <img src={countryObject.flags.png} alt="flag" width="200" height="200"></img>
        <WeatherDisplay
          capitalName={countryObject.capital}
          weather={weather}
          updateWeather={updateWeather}
        />
      </>
    )
  }
}

const CountryListElement = ({ countryName, setShowSingleCountry }) => {
  return (
    <div>
      {countryName}
      <button onClick={() => setShowSingleCountry(countryName)}>show</button>
    </div>
  )
}

const CountryDisplay = ({ countryNames, updateCountry, country, setShowSingleCountry, weather, updateWeather }) => {
  if (countryNames.length > 10) {
    return (
      <div>
        Too many matches, specify another filter
      </div>
    )
  } else if (countryNames.length == 1) {
    updateCountry(countryNames[0])
    return (
      <SingleCountryDisplay 
        countryName={countryNames[0]} 
        countryObject={country}
        weather={weather}
        updateWeather={updateWeather}
      />
    )
  } else if (countryNames.length == 0) {
    return (
      <div>
        No matches
      </div>
    )
  } else {
    return (
      <div>
        {countryNames.map(name => 
        <CountryListElement 
          key={name}
          countryName={name}
          setShowSingleCountry={setShowSingleCountry}
        />)}
      </div>
    )
  } 
}

function App() {

  const [countries, setCountries] = useState([])
  const [search, setSearch] = useState('')
  const [country, setCountry] = useState(null)
  const [showSingleCountry, setShowSingleCountry] = useState('')
  const [weather, setWeather] = useState(null)

  const handleSearchTermChange = (event) => {
    setSearch(event.target.value)
    setShowSingleCountry('')
  }

  useEffect(() => {
    countryService.getAllNames()
      .then(names => {
        setCountries(names)
        console.log("Country list loaded") // delete
      })
  }, [])

  const updateCountry = (countryName) => {
    if (!(country === null)) {
      if (country.name.common === countryName) {
        return
      } 
    }
    countryService
    .getCountry(countryName)
    .then(countryObject => {
      setCountry(countryObject)
      console.log(countryObject) // delete
    })
  }
  
  const updateWeather = (capital) => {
    countryService
    .getWeather(capital)
    .then(weatherObject => {
      setWeather(weatherObject)
      console.log(weatherObject) // delete
    })
  }

  const filteredCountryNames = (showSingleCountry !== "") ? 
    [showSingleCountry] : 
    countries.filter(country => country.toLowerCase().includes(search.toLowerCase()))

  return (
    <div>
      <SearchField 
        searchTerm={search}
        handleSearchTermChange={handleSearchTermChange}
      />
      <CountryDisplay 
        countryNames={filteredCountryNames}
        updateCountry={updateCountry}
        country={country}
        setShowSingleCountry={setShowSingleCountry}
        weather={weather}
        updateWeather={updateWeather}
      />
    </div>
  )
}

export default App
