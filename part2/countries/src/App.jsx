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

const SingleCountryDisplay = ({ countryName, countryObject }) => {
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
        <h3>languages</h3>
        <ul>
          {Object.values(countryObject.languages).map(language => <li key={language}>{language}</li>)}
        </ul>
        <img src={countryObject.flags.png} alt="flag" width="200" height="200"></img>
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

const CountryDisplay = ({ countryNames, updateCountry, country, setShowSingleCountry }) => {
  if (countryNames.length > 10) {
    return (
      <div>
        Too many matches, specify another filter
      </div>
    )
  } else if (countryNames.length == 1) {
    updateCountry(countryNames[0])
    return <SingleCountryDisplay countryName={countryNames[0]} countryObject={country}/>
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
  const [showSingleCountry, setShowSingleCountry] = useState('Finland')

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
        console.log('Country Already updated') // delete
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
      />
    </div>
  )
}

export default App
