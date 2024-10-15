import axios from 'axios'

const sessionToken = localStorage.getItem('token') as string

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL
})

axiosInstance.interceptors.response.use((response) => {
  return response
}, (error) => {
  return Promise.reject(error)
})  

export const setToken =  (token: string) => {
  axiosInstance.defaults.headers.common.Authorization = 'Bearer ' + token
}

setToken(sessionToken)
