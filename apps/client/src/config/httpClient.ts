import axios from 'axios'
import persisterUtil from '../utils/persister.util'
import { message } from 'antd'

const sessionToken = localStorage.getItem('token') as string

export const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api'
})

httpClient.interceptors.response.use((response) => {
  return response
}, (error) => {
  if (error?.code === 'ERR_NETWORK') {
    message.error('No hay conexión con el servidor')
  }

  if (error.status === 401) {
    persisterUtil.purgeSession()
    message.error('La sessión ha finalizado, ingrese nuevamente')
    window.location.href = '/auth/sign-in'
  }

  if (error.status === 422) {
    message.error('Ha sucedido un error al procesar la petición')
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
