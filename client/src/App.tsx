import { observer } from 'mobx-react-lite'
import React, { FC } from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { useContext } from 'react'
import { Context } from '.'
import LoginForm from './components/LoginForm'
import { IUser } from './models/IUser'
import UserService from './services/UserService'
// // Redirect by 401 response error
// import { useHistory } from 'react-router-dom'

const App: FC = () => {
	const { store } = useContext(Context)
	const [userList, setUserList] = useState<IUser[]>([])
	// // Redirect by 401 response error
	// const history = useHistory()

	useEffect(() => {
		if (localStorage.getItem('token')) {
			store.checkAuth()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	// Get User List
	async function getUsers() {
		try {
			const response = await UserService.fetchUsers()
			if (response?.data) {
				setUserList(response.data)
			}
		} catch (e) {
			console.error(e)
		}
	}
	//

	if (store.isLoading) {
		return <div>Loading...</div>
	}

	if (!store.isAuth) {
		return (
			<div>
				<LoginForm />
				<button onClick={getUsers}>Get user list</button>
			</div>
		)
	}

	return (
		<div className="App">
			{/* Authorization check */}
			<h1>
				{store.isAuth
					? `User are authorized (${store.user.email})`
					: `Need authorisation`}
			</h1>

			{/* Activation check */}
			<h1>
				{store.user.isActivated
					? 'Account is activated'
					: 'Account activation required'}
			</h1>

			<button onClick={() => store.logout()}>Logout</button>
			<div>
				<button onClick={getUsers}>Get user list</button>
			</div>
			{userList.map(user => (
				<div key={user.email}>{user.email}</div>
			))}
		</div>
	)
}

export default observer(App)
