const nodemailer = require('nodemailer')

class MailService {
	constructor() {
		this.transporter = nodemailer.createTransport({
			// On mail server (mail box) switch on IMAP
			host: process.env.SMTP_HOST,
			port: process.env.SMTP_PORT,
			secure: false,
			auth: {
				user: process.env.SMTP_USER,
				pass: process.env.SMTP_PASSWORD
			}
		})
	}

	async sendActivationMail(to, link) {
		try {
			await this.transporter.sendMail({
				from: process.env.SMTP_USER,
				to,
				subject: 'Активация аккаунта на ' + process.env.API_URL,
				text: '',
				html: `
					<div>
						<h1>Для активации аккаунта на ${process.env.API_URL} перейдите по ссылке ниже:</h1>
						<a href="${link}">${link}</a>
					</div>
				`
			})
			return 0
		} catch (e) {
			return e
		}
	}
}

module.exports = new MailService()
