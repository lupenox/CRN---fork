
import { 
	Card,
	Button,
	Input,
	Avatar,
	Divider,
	ButtonGroup,
	Layout,
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

	// //SAVE FOR ENDPOINTS
	// async function getUserInfo(){
	// 	const user = await fetch(`${process.env.BASE_URL}`);
	// 	if(!user) console.error('Account: Failed to fetch user info');
	// 	return user;
	// }

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
	const [username, setUsername] = useState(user.username);
	const [newUsername, setNewUsername] = useState('');

	const [email, setEmail] = useState(user.email);
	const [newEmail, setNewEmail] = useState('');

	const [password, setPassword] = useState(user.password);
	const [oldPassword, setOldPassword] = useState('');
	const [newPassword, setNewPassword] = useState('');

	const [isEmailChanged, setEmailChanged] = useState(false);
	const [isPasswordChanged, setPasswordChanged] = useState(false);
	const [isUsernameChanged, setUsernameChanged] = useState(false);


	function handleEmailChange(){
		setEmail(newEmail);
		setEmailChanged(false);
	}

	function handlePasswordChange(){
		if(password === oldPassword){
			setPassword(newPassword);
			setPasswordChanged(false);
		}
	}

	function handleUsernameChange(){
		setUsername(newUsername);
		setUsernameChanged(false);
	}

	return(
		<Layout style={{flex: 1}}>
			<Card style={styles.card}>
				<Avatar 
					style={styles.avatar}
					size='giant'
					source={require('../../assets/icon.png')}
				/>
				<Input 
					style={styles.input}
					defaultValue={username}
					onChangeText={(typedUsername)=>{
						setNewUsername(typedUsername);
						setUsernameChanged(true);
					}}
				/>
				{
					isUsernameChanged?(
						<ButtonGroup style={styles.btn_group}>
							<Button 
								style={styles.btn}
								onPress={()=>handleUsernameChange()}
							>Change Email</Button>
							<Button 
								style={styles.btn}
								onPress={()=>{
									setUsername(user.username);
									setUsernameChanged(false);
								}}
							>Cancel</Button>
						</ButtonGroup>
					):(<></>)
				}
				<Divider style={styles.divider}/>
				<Input 
					style={styles.input}
					defaultValue={email}
					onChangeText={(typedEmail)=>{
						setNewEmail(typedEmail);
						setEmailChanged(true);
					}}
				/>
				{
					isEmailChanged?(
						<ButtonGroup style={styles.btn_group}>
							<Button 
								style={styles.btn}
								onPress={()=>handleEmailChange()}
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
					onChangeText={(typedOldPassword)=>{
						setOldPassword(typedOldPassword)
						setPasswordChanged(true);
					}}
				/>
				<Input 
					style={styles.input}
					placeholder='New Password'
					onChangeText={(typedPassword)=>{
						setNewPassword(typedPassword);
						setPasswordChanged(true);
					}}
				/>
				{
					isPasswordChanged?(
						<ButtonGroup style={styles.btn_group}>
							<Button 
								style={styles.btn}
								onPress={()=>handlePasswordChange()}
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
		</Layout>
	);
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
