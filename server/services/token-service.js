// require('dotenv').config()
const jwt = require('jsonwebtoken')
const TokenModel = require('../models/token-model')

class TokenService {
	generatePairOfTokens(payload) {
		const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
			expiresIn: '15m'
		})
		const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
			expiresIn: '15d'
		})

		return {
			accessToken,
			refreshToken
		}
	}

	async saveToken(userId, refreshToken) {
		// ONE token on one user!!!
		const tokenData = await TokenModel.findOne({ user: userId })
		if (tokenData) {
			tokenData.refreshToken = refreshToken
			return tokenData.save()
		}

		const newToken = await TokenModel.create({
			user: userId,
			refreshToken
		})
		return newToken
	}

	async removeToken(refreshToken) {
		const tokenData = await TokenModel.deleteOne({ refreshToken })
		return tokenData
	}

	async findToken(refreshToken) {
		const tokenData = await TokenModel.findOne({ refreshToken })
		return tokenData
	}

	validateRefreshToken(token) {
		try {
			const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET)
			return userData
		} catch (e) {
			return null
		}
	}

	validateAccessToken(token) {
		try {
			const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET)
			return userData
		} catch (e) {
			return null
		}
	}
}

module.exports = new TokenService()
