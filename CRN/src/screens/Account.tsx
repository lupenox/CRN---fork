import React from 'react';
import { StyleSheet, View } from 'react-native';
import { 
  Layout, 
  Text, 
  Icon, 
  Card,
  Avatar,
  Divider,
  Button
} from '@ui-kitten/components';
import { useAuth0 } from 'react-native-auth0'; 
import { AppHeader } from '../navigation/AppHeader';
import { useAppTheme } from '../theme/ThemeContext';

export default function Account() {
  const { resolvedTheme, setMode } = useAppTheme();
  const { user, clearSession } = useAuth0(); 

  const isDark = resolvedTheme === 'dark';

  const handleLogout = async () => {
    try {
      await clearSession();
    } catch (e) {
      console.error('Logout error:', e);
    }
  };

  return (
    <Layout style={{ flex: 1 }}>
      <AppHeader title="Account Settings" />
      
      <View style={styles.container}>
        {/* Profile Info */}
        <Card style={styles.card}>
          <View style={styles.profileHeader}>
            <Avatar 
              size="giant" 
              source={{ uri: user?.picture || 'https://via.placeholder.com/150' }} 
            />
            <View style={styles.profileInfo}>
              <Text category="h5">{user?.name || 'Campus Navigator'}</Text>
              <Text category="s1" appearance="hint">{user?.email || 'No email provided'}</Text>
            </View>
          </View>
        </Card>

        {/* Theme Settings */}
        <Text category="label" appearance="hint" style={styles.sectionLabel}>PREFERENCES</Text>
        <Card style={styles.settingsCard}>
          <View style={styles.settingRow}>
            <View style={styles.settingLabel}>
              <Icon 
                name={isDark ? "moon-outline" : "sun-outline"} 
                style={styles.icon} 
                fill={isDark ? "#fff" : "#000"} 
              />
              <Text category="s1" style={{ marginLeft: 10 }}>
                {isDark ? "Dark Mode" : "Light Mode"}
              </Text>
            </View>
            <Button 
              size="small" 
              appearance="outline" 
              onPress={() => setMode(isDark ? 'light' : 'dark')}
            >
              Toggle
            </Button>
          </View>
        </Card>

        <Divider style={styles.divider} />

        {/* Logout Button */}
        <Button status="danger" style={styles.logoutBtn} onPress={handleLogout}>
          Log Out
        </Button>
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1 },
  card: { marginBottom: 20 },
  profileHeader: { flexDirection: 'row', alignItems: 'center' },
  profileInfo: { marginLeft: 16 },
  sectionLabel: { marginBottom: 8, marginLeft: 4 },
  settingsCard: { marginBottom: 20, padding: 5 },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  settingLabel: { flexDirection: 'row', alignItems: 'center' },
  icon: { width: 24, height: 24 },
  divider: { marginVertical: 10 },
  logoutBtn: { marginTop: 'auto', marginBottom: 20 },
});
// import React from 'react';
// import { 
// 	Card,
// 	Input,
// 	Avatar,
// 	Divider,
// 	ButtonGroup,
// 	Layout,
// } from '@ui-kitten/components';

// import Button from '../components/Button';
// import { AppHeader } from '../navigation/AppHeader';
// import {useState} from 'react';
// import { StyleSheet } from 'react-native';

// /**
//  * Account Screen, provides details about a user's
//  * account as well functionality to change said info.
//  * For the extent of this project we require practically
//  * no PPI, and so it largely contains user settings
//  */

// export default function Account(){

// 	// //@Note
// 	// //@See user <Object> below
// 	// //EXAMPLE FOR ENDPOINT IMPLEMENTATION
// 	// async function getUserInfo(){
// 	// 	const user = await fetch(`${process.env.BASE_URL}`);
// 	// 	if(!user) console.error('Account: Failed to fetch user info');
// 	// 	return user;
// 	// }

// 	/**
// 	 * @Note user object for modularity. Could be made global as
// 	 * part of a session provider context, but largely out of scope.
// 	 */
// 	const user = {
// 		username: 'Admin Tester',
// 		email: 'admin@admin.com',
// 		password: 'password',
// 	}
// 	/**
// 	 * @TODO the default hook initialization should be
// 	 * changed to relevant user info via fetched info
// 	 */
// 	const [username, setUsername] = useState(user.username);
// 	const [newUsername, setNewUsername] = useState('');

// 	const [email, setEmail] = useState(user.email);
// 	const [newEmail, setNewEmail] = useState('');

// 	const [password, setPassword] = useState(user.password);
// 	const [oldPassword, setOldPassword] = useState('');
// 	const [newPassword, setNewPassword] = useState('');

// 	const [isEmailChanged, setEmailChanged] = useState(false);
// 	const [isPasswordChanged, setPasswordChanged] = useState(false);
// 	const [isUsernameChanged, setUsernameChanged] = useState(false);


// 	/*
// 	 * updates email to whatever has been typed.
// 	 * As a side-effect, whenever this function is called
// 	 * the open cancel and change buttons are closed
// 	 */
// 	function handleEmailChange(){
// 		setEmail(newEmail);
// 		setEmailChanged(false);
// 	}

// 	/*
// 	 * updates password to whatever has been typed.
// 	 * As a side-effect, whenever this function is called
// 	 * the open cancel and change buttons are closed
// 	 */
// 	function handlePasswordChange(){
// 		if(password === oldPassword){
// 			setPassword(newPassword);
// 			setPasswordChanged(false);
// 		}
// 	}

// 	/*
// 	 * updates username to whatever has been typed.
// 	 * As a side-effect, whenever this function is called
// 	 * the open cancel and change buttons are closed
// 	 */
// 	function handleUsernameChange(){
// 		setUsername(newUsername);
// 		setUsernameChanged(false);
// 	}

// 	return(
// 		<Layout level="2" style={{flex: 1}}>
// 		  <AppHeader title="Account" />
// 			<Card style={styles.card}>

// 				{/*
// 					@TODO change the avatar icon to something
// 					more fitting. We may want to support users
// 					uploading an image or just have a default
// 					for everyone
// 				*/}
// 				<Avatar 
// 					style={styles.avatar}
// 					size='giant'
// 					source={require('../../assets/icon.png')}
// 				/>
// 				<Input 
// 					style={styles.input}
// 					defaultValue={username}
// 					onChangeText={(typedUsername)=>{
// 						setNewUsername(typedUsername);
// 						setUsernameChanged(true);
// 					}}
// 				/>
// 				{
// 					/*
// 					 * Username button group. If a person were to edit the username
// 					 * the buttons for handling that changed will appear on the page.
// 					 */
// 					isUsernameChanged?(
// 						<ButtonGroup style={styles.btn_group}>
// 							<Button 
// 								style={styles.btn}
// 								onPress={()=>handleUsernameChange()}
// 							>Change Email</Button>
// 							<Button 
// 								style={styles.btn}
// 								onPress={()=>{
// 									setUsername(user.username);
// 									setUsernameChanged(false);
// 								}}
// 							>Cancel</Button>
// 						</ButtonGroup>
// 					):(<></>)
// 				}
// 				<Divider style={styles.divider}/>
// 				<Input 
// 					style={styles.input}
// 					defaultValue={email}
// 					onChangeText={(typedEmail)=>{
// 						setNewEmail(typedEmail);
// 						setEmailChanged(true);
// 					}}
// 				/>
// 				{
// 					/*
// 					 * Email button group. If a person were to edit the email 
// 					 * the buttons for handling that changed will appear on the page.
// 					 */
// 					isEmailChanged?(
// 						<ButtonGroup style={styles.btn_group}>
// 							<Button 
// 								style={styles.btn}
// 								onPress={()=>handleEmailChange()}
// 							>Change Email</Button>
// 							<Button 
// 								style={styles.btn}
// 								onPress={()=>{
// 									setEmail(user.email);
// 									setEmailChanged(false);
// 								}}
// 							>Cancel</Button>
// 						</ButtonGroup>
// 					):(<></>)
// 				}
// 				<Divider style={styles.divider}/>
// 				<Input 
// 					style={styles.input}
// 					placeholder='Old Password'
// 					onChangeText={(typedOldPassword)=>{
// 						setOldPassword(typedOldPassword)
// 						setPasswordChanged(true);
// 					}}
// 				/>
// 				<Input 
// 					style={styles.input}
// 					placeholder='New Password'
// 					onChangeText={(typedPassword)=>{
// 						setNewPassword(typedPassword);
// 						setPasswordChanged(true);
// 					}}
// 				/>
// 				{
// 					/*
// 					 * Password button group. If a person were to edit the password 
// 					 * the buttons for handling that changed will appear on the page.
// 					 * 
// 					 * @Note this group will behave differently onPress than the other groups
// 					 * For a password to change successfully, then they will need to type their
// 					 * old password correctly otherwise it will just remain open
// 					 */
// 					isPasswordChanged?(
// 						<ButtonGroup style={styles.btn_group}>
// 							<Button 
// 								style={styles.btn}
// 								onPress={()=>handlePasswordChange()}
// 							>Change Password</Button>
// 							<Button 
// 								style={styles.btn}
// 								onPress={()=>{
// 									setPasswordChanged(false);
// 								}}
// 							>Cancel</Button>
// 						</ButtonGroup>
// 					):(<></>)
// 				}
// 				{/* <Divider style={styles.divider}/> */}
// 				{/*
// 					@Note for any additional information
// 					current format is to separate by divider
// 					and then add your content
// 				*/}
// 			</Card>
// 		</Layout>
// 	);
// }

// /**
//  * @Note style object for this screen.
//  * The values are quite arbitrarily chosen
//  *
//  * @TODO fix styling to look more professional
//  * At the moment the spacing isn't necessarily
//  * the best between buttons or components 
//  *
//  * CurrentState: MVP
//  */
// const styles = StyleSheet.create({
// 	card: {
// 		margin: 'auto',
// 		padding: 10,
// 		width: '75%',
// 		height: '55%',
// 	},
// 	input: {
// 		marginTop: 10,
// 		marginBottom: 10,
// 	},
// 	btn: {
// 		marginTop: 10,
// 		marginBottom: 10,
// 	},
// 	btn_group: {
// 		display: 'flex',
// 		justifyContent: 'space-between',
// 	},
// 	divider:{
// 		marginTop: 10,
// 		marginBottom: 10,
// 	},
// 	avatar: {
// 		margin: 'auto',
// 		marginTop: 10,
// 		marginBottom: 10,
// 	},
// });
