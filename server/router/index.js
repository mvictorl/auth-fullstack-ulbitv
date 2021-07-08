const Router = require('express').Router
const userCtrl = require('../controllers/user-controller')
const { body } = require('express-validator')
const authMiddleware = require('../middlewares/auth-middleware')

const router = new Router()

router.post(
	'/registration',
	body('email').isEmail(),
	body('password').isLength({ min: 3, max: 32 }),
	userCtrl.registration
)

router.post('/login', userCtrl.login)
router.post('/logout', userCtrl.logout)
router.get('/activate/:link', userCtrl.activate)
router.get('/refresh', userCtrl.refresh)
router.get('/users', authMiddleware, userCtrl.getUsers)

module.exports = router
