import { httpClient } from '../config/httpClient'

export async function getExpedients(params: any = {}) {
  return httpClient.get(`/expedients`, { params }).then(res => res.data)
}

export async function getExpedient(id: string) {
  return httpClient.get(`/expedients/${id}`).then(res => res.data)
}

export async function createExpedientReview(data: { description: string; expedientId: string }) {
  return httpClient.post(`/reviews`, { ...data }).then(res => res.data)
}

export async function getUsers() {
  return httpClient.get(`/users`).then(res => res.data)
}
