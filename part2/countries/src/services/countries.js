import axios from 'axios';

const COUNTRY_BASE_URL = 'https://studies.cs.helsinki.fi/restcountries/api/';

const getAllNames = () => {
    const response = axios
    .get(`${COUNTRY_BASE_URL}all`)
    .then(response => {
        const names = response.data.map(country => country.name.common)
        return names
    })
    return response
}

const getCountry = (name) => {
    const response = axios
    .get(`${COUNTRY_BASE_URL}name/${name.toLowerCase()}`)
    .then(response => {
        const country = response.data
        return country
    })
    return response
}

export default { getAllNames, getCountry };

