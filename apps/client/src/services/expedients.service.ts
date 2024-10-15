import { axiosInstance } from '../config/axios'

export const useExpedients = async () => {
  return axiosInstance.get('/expedients')
  // try {
  //   const { data } = await axiosInstance.get('/expedients')

  //   return data
  // } catch (error) {
  //   return Promise.reject(error)
  // }
}
