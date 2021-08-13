import axios from 'axios'
import { AuthResponse } from '../models/response/AuthResponse'

export const API_URL = 'http://localhost:5000/api'

const $api = axios.create({
	withCredentials: true,
	baseURL: API_URL
})

$api.interceptors.request.use(config => {
	config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`
	console.log('Request', config)

	return config
})

// Update access token by refresh token
$api.interceptors.response.use(
	config => config,
	async error => {
		const originalRequest = error.config
		if (
			error.response.status === 401 &&
			error.config &&
			!error.config._isRetry
		) {
			originalRequest._isRetry = true
			try {
				const response = await axios.get<AuthResponse>(`${API_URL}/refresh`, {
					withCredentials: true
				})
				localStorage.setItem('token', response.data.accessToken)
				return $api.request(originalRequest)
			} catch (e) {
				console.error('USER NOT AUTHORIZE')
			}
		}
		localStorage.removeItem('token')
		window.location.href = 'http://localhost:3000/'
		// throw error
		return Promise.reject(error)
	}
)
// $api.interceptors.response.use(
// 	config => {
// 		return config
// 	},
// 	async error => {
// 		if (error.response.status === 401 && error.config) {
// 			console.log('error.config', error.config)
// 			const originalRequest = error.config

// 			if (!error.config._isRetry) {
// 				console.log('Первый раз...')
// 				originalRequest._isRetry = true
// 				try {
// 					const response = await axios.get<AuthResponse>(`${API_URL}/refresh`, {
// 						withCredentials: true
// 					})
// 					localStorage.setItem('token', response.data.accessToken)
// 					return $api.request(originalRequest)
// 				} catch (e) {
// 					console.error('Not authorized...', e)
// 				}
// 			} else {
// 				console.log('Второй раз...')
// 				window.location.href = 'http://localhost:3000/login'
// 			}

// 			return Promise.reject(error)
// 		}
// 	}
// )

export default $api
