import { Expedient, User } from '@expedients/shared'
import { httpClient } from '../config/httpClient'
import { AxiosRequestConfig } from 'axios'

export async function signIn(data: { email: string; password: string }): Promise<{ user: User; token: string }> {
  return await httpClient.post(`/auth/sign-in`, { ...data }).then(res => res.data)
}

export async function getExpedients(params: any = {}) {
  return httpClient.get(`/expedients`, { params }).then(res => res.data)
}

export async function getExpedient(id: string) {
  return httpClient.get(`/expedients/${id}`).then(res => res.data)
}

export async function createExpedient(data: Expedient) {
  return httpClient.post(`/expedients`, { ...data }).then(res => res.data)
}

export async function createExpedientReview(data: { description: string; createdAt: string; expedientId: string }) {
  return httpClient.post(`/reviews`, { ...data }).then(res => res.data)
}

export async function deleteExpedientReview(id: string) {
  return httpClient.delete(`/reviews/${id}`).then(res => res.data)
}

export async function getUsers() {
  return httpClient.get(`/users`).then(res => res.data)
}

export async function getDocument(id: string) {
  return httpClient.get(`/documents/${id}`).then(res => res.data)
}

export async function createDocument(formData: FormData, config: AxiosRequestConfig) {
  return httpClient.post(`/documents`, formData, config).then(res => res.data)
}

export async function updateDocument(formData: FormData, config: AxiosRequestConfig) {
  return httpClient.patch(`/documents/${formData.get('expedientId')}`, formData, config).then(res => res.data)
}

export async function downloadDocument(url: string): Promise<Blob> {
  return httpClient.get(url, { responseType: 'blob', headers: { 'Authorization': undefined } }).then(res => res.data)
}
