const UserModel = require('../models/user-model')
const bcrypt = require('bcryptjs')
const uuid = require('uuid')
const mailService = require('../services/mail-service')
const tokenService = require('../services/token-service')
const UserDto = require('../dtos/user-dto')
const ApiError = require('../exceptions/api-error')

class UserService {
	async registration(email, password) {
		const candidateUser = await UserModel.findOne({ email })
		if (candidateUser) {
			// throw new Error(`Пользователь с почтовым адресом ${email} уже существует`)
			throw ApiError.BadRequest(
				`Пользователь с почтовым адресом ${email} уже существует`
			)
		}

		const hashedPassword = await bcrypt.hash(password, 12)
		const activationLink = uuid.v4()

		const newUser = await UserModel.create({
			email,
			password: hashedPassword,
			activationLink
		})

		const mailError = await mailService.sendActivationMail(
			email,
			`${process.env.API_URL}/api/activate/${activationLink}`
		)
		if (mailError) {
			console.error(mailError)
		}

		const userDto = new UserDto(newUser) // id, email, isActivated
		const tokens = tokenService.generatePairOfTokens({ ...userDto })

		await tokenService.saveToken(userDto.id, tokens.refreshToken)

		return { ...tokens, user: userDto }
	}

	async activate(activationLink) {
		const user = await UserModel.findOne({ activationLink })
		if (!user) {
			// throw new Error('Не корректная ссылка активации')
			throw ApiError.BadRequest('Некорректная ссылка активации')
		}
		user.isActivated = true
		await user.save()
	}

	async login(email, password) {
		const user = await UserModel.findOne({ email })
		if (!user) {
			// throw new Error(`Пользователь с почтовым адресом ${email} уже существует`)
			throw ApiError.BadRequest(
				`Пользователь с почтовым адресом ${email} не найден`
			)
		}

		const isPasswordsEqials = await bcrypt.compare(password, user.password)
		if (!isPasswordsEqials) {
			throw ApiError.BadRequest(`Неверный пароль`)
		}

		const userDto = new UserDto(user) // id, email, isActivated

		const tokens = tokenService.generatePairOfTokens({ ...userDto })
		await tokenService.saveToken(userDto.id, tokens.refreshToken)

		return { ...tokens, user: userDto }
	}

	async logout(refreshToken) {
		const token = await tokenService.removeToken(refreshToken)
		return token
	}

	async refresh(refreshToken) {
		if (!refreshToken) {
			throw ApiError.UnauthorizedError()
		}

		const userData = tokenService.validateRefreshToken(refreshToken)
		const tokenFromDb = await tokenService.findToken(refreshToken)
		if (!userData || !tokenFromDb) {
			throw ApiError.UnauthorizedError()
		}

		const user = await UserModel.findById(userData.id)
		const userDto = new UserDto(user) // id, email, isActivated

		const tokens = tokenService.generatePairOfTokens({ ...userDto })
		await tokenService.saveToken(userDto.id, tokens.refreshToken)

		return { ...tokens, user: userDto }
	}

	async getAllUsers() {
		const users = await UserModel.find()
		return users
	}
}

module.exports = new UserService()
