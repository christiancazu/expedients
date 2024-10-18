import axios from 'axios'

const sessionToken = localStorage.getItem('token') as string

export const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL
})

httpClient.interceptors.response.use((response) => {
  return response
}, (error) => {
  return Promise.reject(error)
})  

export const setToken =  (token: string) => {
  httpClient.defaults.headers.common.Authorization = 'Bearer ' + token
}

setToken(sessionToken)
