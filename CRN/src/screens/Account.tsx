
import { 
	Card,
	Button,
	Input,
	Avatar,
	Divider,
	ButtonGroup
} from '@ui-kitten/components';

import {useState} from 'react';
import { StyleSheet } from 'react-native';

/**
 * Account Screen, provides details about a user's
 * account as well functionality to change said info.
 * For the extent of this project we require practically
 * no PPI, and so it largely contains user settings
 */

export default function Account(){

	async function getUserInfo(){
		const user = await fetch(`${process.env.BASE_URL}`);
		if(!user) console.error('Account: Failed to fetch user info');
		return user;
	}

	/**
	 * @Note user object for modularity. Could be made global as
	 * part of a session provider context, but largely out of scope.
	 */
	const user = {
		username: 'Admin Tester',
		email: 'admin@admin.com',
		password: 'password',
	}
	/**
	 * @TODO the default hook initialization should be
	 * changed to relevant user info via fetched info
	 */
	const [value, setValue] = useState('');
	const [username, setUsername] = useState(user.username);
	const [email, setEmail] = useState(user.email);
	const [newPassword, setNewPassword] = useState(user.password);
	const [isEmailChanged, setEmailChanged] = useState(false);
	const [isPasswordChanged, setPasswordChanged] = useState(false);


	function handleChange(newValue: string){
		setValue(newValue);
	}

	function handleEmailChange(newValue: string){
		setValue(newValue);
	}

	function handlePasswordChange(newValue: string){
		setValue(newValue);
	}

	return(<>
		<Card style={styles.card}>
			<Avatar 
				style={styles.avatar}
				size='giant'
				source={require('../../assets/icon.png')}
			/>
			<Divider style={styles.divider}/>
			<Input 
				style={styles.input}
				defaultValue={email}
				onChangeText={()=>setEmailChanged(true)}
			/>
			{
			isEmailChanged?(
				<ButtonGroup style={styles.btn_group}>
					<Button 
						style={styles.btn}
						onPress={()=>handleEmailChange(email)}
						>Change Email</Button>
					<Button 
						style={styles.btn}
							onPress={()=>{
								setEmail(user.email);
								setEmailChanged(false);
							}}
						>Cancel</Button>
				</ButtonGroup>
			):(<></>)
			}
			<Divider style={styles.divider}/>
			<Input 
				style={styles.input}
				placeholder='Old Password'
				onChangeText={(newPassword)=>{
					setNewPassword(newPassword);
					setPasswordChanged(true);
				}}
			/>
			<Input 
				style={styles.input}
				placeholder='New Password'
			/>
			{
			isPasswordChanged?(
				<ButtonGroup style={styles.btn_group}>
					<Button 
						style={styles.btn}
						onPress={()=>handlePasswordChange(newPassword)}
						>Change Password</Button>
					<Button 
						style={styles.btn}
							onPress={()=>{
								setPasswordChanged(false);
							}}
						>Cancel</Button>
				</ButtonGroup>
			):(<></>)
			}
			<Divider style={styles.divider}/>
		</Card>
	</>);
}

/**
 * @Note style object for this screen.
 */
const styles = StyleSheet.create({
	card: {
		margin: 'auto',
		padding: 10,
		width: '75%',
		height: '50%',
	},
	input: {
		marginTop: 10,
		marginBottom: 10,
	},
	btn: {
		marginTop: 10,
		marginBottom: 10,
	},
	btn_group: {
		display: 'flex',
		justifyContent: 'space-between',
	},
	divider:{
		marginTop: 10,
		marginBottom: 10,
	},
	avatar: {
		margin: 'auto',
		marginTop: 10,
		marginBottom: 10,
	},
});
