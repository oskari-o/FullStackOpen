import axios from 'axios'
const baseUrl = 'http://localhost:3001/api/blogs'

let token = null

const setToken = (newToken) => {
  token = `bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then((response) => response.data)
}

const create = async (newObject) => {
  const config = {
    headers: { authorization: token },
  }

  const response = await axios.post(baseUrl, newObject, config)
  console.log(response.data)
  return response.data
}

const update = async (newObject) => {
  const config = {
    headers: { authorization: token },
  }

  const response = await axios.put(
    `${baseUrl}/${newObject.id}`,
    newObject,
    config
  )
  console.log(response.data)
  return response.data
}

const deleteBlog = async (id) => {
  const config = {
    headers: { authorization: token },
  }

  const response = await axios.delete(`${baseUrl}/${id}`, config)
  console.log(response)
}

export default { setToken, getAll, create, update, deleteBlog }
