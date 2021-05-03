import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ToastAndroid,
  Alert,
} from 'react-native';

import { Login, Register, UpdateProfile } from '../../api/User/api';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import {
  LoginManager,
  GraphRequest,
  GraphRequestManager,
} from 'react-native-fbsdk';
import {GoogleSignin, statusCodes} from '@react-native-community/google-signin';
import Icon from 'react-native-vector-icons/EvilIcons';

GoogleSignin.configure({
  webClientId:
    '161582577353-pucfjs9t4h2l53icbva5ogm09lc5ersd.apps.googleusercontent.com',
  offlineAccess: true,
});

class LoginView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inProgress: false,
      User: {
        Email: '',
        Password: '',
        isSocialLogin: false,
      },
      UserDetails: {
        FirstName: '',
        LastName: '',
        ImageUrl: ''
      },
      userVerified: false,
    };
  }

  //#region Login management

  processLogin = async () => {
    this.setState({inProgress: true});
    let response = await Login(this.state.User);
    if (response.success) {
      console.log('Proceeding successfully...')
      this.props.navigation.reset({
        index: 0,
        routes:[{name: response.data.isProfileComplete === true ? 'Main' : 'Registration', params: {data: response.data}}]
      });

      //   this.props.navigation.navigate('Registration');
      //   this.props.navigation.reset({
      //     index: 0,
      //     routes: [{name: 'Registration'}],
      //   });
    } else if (this.state.User.isSocialLogin) {
      let response = await Register(this.state.User);
      if (response.success) {
        console.log('Social Sign Up Success response is:', response)
        this.setState((prevState) => ({
          UserDetails: {
            ...prevState.UserDetails,
            UserId: response.data.userID,
          },
        }));
        console.log('User initial profile details :', this.state.UserDetails)
        let updateResponse = await UpdateProfile(this.state.UserDetails)
        if (updateResponse.success){
          console.log('Profile created success response:', updateResponse.data)
        }

        this.props.navigation.reset({
          index: 0,
          routes:[{name: 'Registration', params: {data: updateResponse.data}}]
        });
      }
    } else {
      return Alert.alert(
        "Can't log in",
        'Email/Password incorrect',
        [{text: 'OK', onPress: () => this.setState({inProgress: false})}],
        {cancelable: false},
      );
    }
  };

  processLogin_Facebook = () => {
    const infoRequest = new GraphRequest(
      '/me',
      {
        parameters: {
          fields: {
            string: 'email,name,picture',
          },
        },
      },
      (err, res) => {
        if (err === null) {
          console.log('Facebook login Respone is :', res);
          let user = {
            Email: res.email,
            Password: 'null',
            isSocialLogin: true,
          };

          let userDetails = {
            FirstName: res.name.includes(' ') ? res.name.split(' ')[0] : res.name,
            LastName: res.name.includes(' ') ? res.name.split(' ')[1] : '',
            ImageUrl: res.picture.data.url
          }
          this.setState({
            User: user,
            UserDetails: userDetails
          })
          this.processLogin();
        }
      },
    );
    LoginManager.logInWithPermissions(['public_profile', 'email']).then(
      function (result, error) {
        new GraphRequestManager().addRequest(infoRequest).start();
      },
      function (error) {
        console.log('==> Login fail with error: ' + error);
      },
    );
  };

  processLogin_Google = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log('Google Sign In info is:', userInfo.user)
      let user = {
        Email: userInfo.user.email,
        Password: 'null',
        isSocialLogin: true,
      };
      let userDetails = {
        FirstName: userInfo.user.name.includes(' ') ? userInfo.user.name.split(' ')[0] : userInfo.user.name,
        LastName: userInfo.user.name.includes(' ') ? userInfo.user.name.split(' ')[1] : '',
        ImageUrl: userInfo.user.photo
      }
      this.setState({
        User: user,
        UserDetails: userDetails
      })
      this.processLogin();
      // this.navigateNext(true, userInfo.user);
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('User cancelled');
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('User in progress');

        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('No play service');

        // play services not available or outdated
      } else {
        console.log('new error is :', error.code);
        // some other error happened
      }
    }
  };

  updateState = (key, value) => {
    this.setState((prevState) => ({
      User: {
        ...prevState.User,
        [key]: value,
      },
    }));
  };

  //#endregion
  render() {
    return (
      <View style={styles.mainContainer}>
        <Image
          source={require('../../assets/app-icon.png')}
          style={styles.logo}
        />
        <Text style={styles.heading}>Log in to continue</Text>

        <TextInput
          style={styles.input}
          onChangeText={(val) => this.updateState('Email', val)}
          placeholder="Email or phone"
        />
        <TextInput
          style={styles.input}
          secureTextEntry
          onChangeText={(val) => this.updateState('Password', val)}
          placeholder="Password"
        />
        <View style={{width: '85%'}}>
          <TouchableOpacity disabled={this.state.inProgress} style={styles.button} onPress={this.processLogin}>
            {!this.state.inProgress && (
              <Text style={styles.button_text}>Log in</Text>
            )}
            {this.state.inProgress && (
              <ActivityIndicator
                style={{margin: 5}}
                size="large"
                color="#fff"
              />
            )}
          </TouchableOpacity>
          <TouchableOpacity disabled={this.state.inProgress}
            style={{
              backgroundColor: '#fff',
              marginTop: 15,
              paddingTop: 10,
              paddingBottom: 10,
            }}
            onPress={this.processLogin}>
            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
              <Text style={{color: '#000', fontSize: 18}}>
                Don't have an account?
              </Text>
              <Text
                style={[
                  styles.button_text,
                  {color: '#1977f3', padding: 0, marginLeft: 5},
                ]}>
                Sign Up Now
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <Text>Or continue with</Text>
        <View style={styles.socialLoginContainer}>
          <TouchableOpacity disabled={this.state.inProgress}
            style={[styles.button_social, {backgroundColor: '#1977f3'}]}
            onPress={() => this.processLogin_Facebook()}>
            <Icon
              name="sc-facebook"
              color="#fff"
              size={35}
              style={{alignSelf: 'center', padding: 15}}
            />
          </TouchableOpacity>

          <TouchableOpacity disabled={this.state.inProgress}
            style={[
              styles.button_social,
              {marginLeft: 15, backgroundColor: '#dd3236'},
            ]}
            onPress={() => this.processLogin_Google()}>
            <Icon
              name="sc-google-plus"
              color="#fff"
              size={35}
              style={{alignSelf: 'center', padding: 15}}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  //#region Containers
  mainContainer: {
    backgroundColor: 'white',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    alignSelf: 'center',
  },
  socialLoginContainer: {
    flexDirection: 'row',
  },
  //#endregion
  //#region Titles & inputs
  heading: {
    fontSize: 22,
    fontFamily: 'sans-serif-light',
    marginTop: 12,
  },
  input: {
    backgroundColor: '#f2f2f2',
    height: 45,
    borderRadius: 8,
    paddingLeft: 12,
    fontSize: 17,
    marginTop: 15,
    width: '85%',
  },
  //#endregion
  //#region Buttons
  button: {
    backgroundColor: '#26acff',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
    width: '100%',
  },
  button_social: {
    backgroundColor: '#ff4545',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },
  button_text: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'sans-serif',
    padding: 10,
    fontWeight: 'bold',
  },
  //#endregion

  //#region Icons
  logo: {
    height: 110,
    width: 110,
  },
  logo_social: {
    height: 25,
    width: 25,
    marginRight: 2,
  },
});

export default LoginView;
