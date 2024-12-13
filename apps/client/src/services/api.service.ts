import type { Expedient } from '@expedients/shared'
import axios, { type AxiosRequestConfig } from 'axios'
import { httpClient } from '../config/httpClient'
import type { CreateEvent, UserSession } from '../types'

export async function signIn(data: {
	email: string
	password: string
}): Promise<UserSession> {
	return await httpClient
		.post('/auth/sign-in', { ...data })
		.then((res) => res.data)
}

export async function verifyAccount(data: {
	password: string
	token: string
}): Promise<UserSession> {
	return await httpClient
		.post('/auth/verify-account', { ...data })
		.then((res) => res.data)
}

export async function getExpedients(params: any = {}) {
	return httpClient.get('/expedients', { params }).then((res) => res.data)
}

export async function getExpedient(id: string): Promise<Expedient> {
	return httpClient.get(`/expedients/${id}`).then((res) => res.data)
}

export async function createExpedient(expedient: Expedient) {
	return httpClient.post('/expedients', expedient).then((res) => res.data)
}

export async function updateExpedient({
	id,
	expedient,
}: { id: string; expedient: Expedient }): Promise<any> {
	return httpClient
		.patch(`/expedients/${id}`, expedient)
		.then((res) => res.data)
}

export async function getExpedientsEvents(): Promise<Expedient[]> {
	return httpClient.get('/expedients/events').then((res) => res.data)
}

export async function getExpedientEvents(
	expedientId: string,
): Promise<Expedient> {
	return httpClient
		.get(`/expedients/${expedientId}/events`)
		.then((res) => res.data)
}

export async function createExpedientReview(data: {
	description: string
	createdAt: string
	expedientId: string
}) {
	return httpClient.post('/reviews', { ...data }).then((res) => res.data)
}

export async function deleteExpedientReview(id: string) {
	return httpClient.delete(`/reviews/${id}`).then((res) => res.data)
}

export async function getUsers() {
	return httpClient.get('/users').then((res) => res.data)
}

export async function getDocument(id: string) {
	return httpClient.get(`/documents/${id}`).then((res) => res.data)
}

export async function createDocument(
	formData: FormData,
	config: AxiosRequestConfig,
) {
	return httpClient.post('/documents', formData, config).then((res) => res.data)
}

export async function updateDocument(
	formData: FormData,
	config: AxiosRequestConfig,
) {
	return httpClient
		.patch(`/documents/${formData.get('expedientId')}`, formData, config)
		.then((res) => res.data)
}

export async function downloadDocument(url: string): Promise<Blob> {
	return axios
		.get(url, { responseType: 'blob', headers: { Authorization: undefined } })
		.then((res) => res.data)
}

export async function subscribeNotifications(subscription: any): Promise<any> {
	return httpClient
		.post('notifications/subscribe', subscription)
		.then((res) => res.data)
}

export async function unsubscribeNotifications(): Promise<any> {
	return httpClient.post('notifications/unsubscribe').then((res) => res.data)
}

export async function createEvent(payload: CreateEvent): Promise<any> {
	return httpClient.post('events', payload).then((res) => res.data)
}

export async function deleteEvent(id: string): Promise<any> {
	return httpClient.delete(`events/${id}`).then((res) => res.data)
}
