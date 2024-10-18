import axios from 'axios'
import persisterUtil from '../utils/persister.util'

const sessionToken = localStorage.getItem('token') as string

export const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL
})

httpClient.interceptors.response.use((response) => {
  return response
}, (error) => {
  if (error.status === 401) {
    localStorage.clear()
    window.location.href = '/auth/sign-in'
  }

  return Promise.reject(error)
})


export const setToken = (token: string, isFirstTime = false) => {
  const tokenInLocalStorage = persisterUtil.get('token')

  if (!tokenInLocalStorage && !isFirstTime) {
    persisterUtil.set('token', token)
  }

  httpClient.defaults.headers.common.Authorization = 'Bearer ' + token
}

setToken(sessionToken, true)
