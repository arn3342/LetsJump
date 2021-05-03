import React, {Component} from 'react';
import RNImagePicker from 'react-native-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  Platform,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import moment from 'moment';

import {GetProfile, UpdateProfile} from '../../api/User/api';

class RegistrationView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedDate: '',
      datePickerMode: 'date',
      showDatePicker: false,
      placeholders: {
        location: 'Where do you live ?',
        name: 'What should i call you ?',
      },
      userinfo: {
        name: '',
        profilepicture: '',
      },
      userDetails: this.props.route.params.data,
    };
  }

  async componentDidMount() {
    let user = {
      accessToken: this.props.route.params.data,
    };
    // let profile = await GetProfile(user);
    // this.setState({
    //   userDetails: profile.data,
    // });
    // this.setState(prevState => ({
    //   userDetails: {
    //     ...prevState.accessToken,
    //     accessToken: prevImageState,
    //   },
    // }));
  }
  //#region Registration management
  processRegistration = async () => {
    let response = await UpdateProfile(this.state.userDetails);
    if (response.success) {
      console.log('Process registration success response: ', response.data)
      this.props.navigation.reset({
        index: 0,
        routes: [{name: 'Main', params: {data: response.data}}],
      });
    }
  };

  onNameFocused = (condition) => {
    switch (condition) {
      case 'name':
        this.setState((prevState) => ({
          placeholders: {
            ...prevState.placeholders,
            name: 'Type your full name',
          },
        }));
        break;
      case 'location':
        this.setState((prevState) => ({
          placeholders: {
            ...prevState.placeholders,
            location: 'Just add your area name',
          },
        }));
        break;
    }
  };
  onNameBlur = (condition) => {
    switch (condition) {
      case 'name':
        this.setState((prevState) => ({
          placeholders: {
            ...prevState.placeholders,
            name: 'What should i call you ?',
          },
        }));
        break;
      case 'location':
        this.setState((prevState) => ({
          placeholders: {
            ...prevState.placeholders,
            location: 'Where do you live ?',
          },
        }));
        break;
    }
  };
  //#endregion

  //#region Date-time management

  onDateChange = (event, selectedDate) => {
    var currentDate = selectedDate || this.state.selectedDate;
    this.setState({
      showDatePicker: Platform.OS === 'ios',
      selectedDate: currentDate,
    });
    this.updateUserData(
      'dob',
      moment(new Date(this.state.selectedDate)).format('d MMM, yyyy'),
    );
  };

  showMode = (currentMode) => {
    this.setState({
      showDatePicker: true,
      datePickerMode: currentMode,
    });
  };

  showDatepicker = () => {
    this.setState({
      datePickerMode: 'date',
      showDatePicker: true,
    });
  };

  showTimepicker = () => {
    this.setState({
      mode: 'time',
    });
  };

  //#endregion

  //#region Image management
  showImagePicker = () => {
    const options = {
      title: 'Select your picture',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    RNImagePicker.showImagePicker(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        // const source = {uri: response.uri};
        if (response.uri) {
          this.setState((prevState) => ({
            userinfo: {
              ...prevState.userinfo,
              profilepicture: response,
            },
          }));
        }
      }
    });
  };

  //#endregion

  //#region Input management
  updateUserData = (property, value) => {
    this.setState((prevState) => ({
      userDetails: {
        ...prevState.userDetails,
        [property]: value,
      },
    }));
  };

  //#endregion
  render() {
    return (
      <View style={styles.mainContainer}>
        <TouchableOpacity onPress={this.showImagePicker}>
          <Image
            source={
              this.state.userDetails.imageUrl === undefined
                ? require('../../assets/upload-avatar.png')
                : {uri: this.state.userDetails.imageUrl}
            }
            style={styles.avatar}
          />
        </TouchableOpacity>
        <Text style={styles.heading}>Let's get introduced!</Text>

        <View style={styles.socialLoginContainer}>
          <TextInput
            style={styles.input}
            onFocus={() => this.onNameFocused('name')}
            onBlur={() => this.onNameBlur('name')}
            placeholder={this.state.placeholders.name}
            placeholderTextColor="#919191"
            onChangeText={(text) => this.updateUserData('name', text)}
            value={
              this.state.userDetails.lastName
                ? this.state.userDetails.firstName +
                  ' ' +
                  this.state.userDetails.lastName
                : this.state.userDetails.firstName
            }
          />
          <Text
            onPress={() => this.showDatepicker()}
            style={[
              styles.input,
              {textAlignVertical: 'center', color: '#919191'},
            ]}>
            {typeof this.state.selectedDate === 'string'
              ? 'When is your birthday ?'
              : moment(new Date(this.state.selectedDate)).format('d MMM, yyyy')}
          </Text>
          {this.state.showDatePicker && (
            <DateTimePicker
              testID="dateTimePicker"
              value={
                typeof this.state.selectedDate === 'string'
                  ? new Date()
                  : this.state.selectedDate
              }
              mode={this.state.datePickerMode}
              is24Hour={true}
              display="default"
              onChange={(e, date) => this.onDateChange(e, date)}
            />
          )}
          <View style={styles.input_container}>
            <TextInput
              style={{fontSize: 17, width: '85%'}}
              onFocus={() => this.onNameFocused('location')}
              onBlur={() => this.onNameBlur('location')}
              placeholder={this.state.placeholders.location}
              placeholderTextColor="#919191"
              onChangeText={(text) => this.updateUserData('areaName', text)}
              value={
                this.state.userDetails.areName
                  ? undefined
                  : this.state.userDetails.areName
              }
            />
          </View>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={this.processRegistration}>
          {!this.state.inProgress && (
            <Text style={styles.button_text}>Let's Go!</Text>
          )}
          {this.state.inProgress && (
            <ActivityIndicator style={{margin: 5}} size="large" color="#fff" />
          )}
        </TouchableOpacity>
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
    width: '85%',
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
    width: '100%',
  },
  input_container: {
    backgroundColor: '#f2f2f2',
    height: 45,
    borderRadius: 8,
    paddingLeft: 12,
    fontSize: 17,
    marginTop: 15,
    width: '100%',
    flexDirection: 'row',
  },
  //#endregion
  //#region Buttons
  button: {
    backgroundColor: '#26acff',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
    width: '85%',
  },
  button_social: {
    backgroundColor: '#ff4545',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
    width: '40%',
    height: 45,
    flexDirection: 'row',
    flex: 1,
  },
  button_text: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'sans-serif',
    padding: 10,
  },
  //#endregion

  //#region Icons
  avatar: {
    height: 110,
    width: 110,
    borderRadius: 55,
  },
  logo_social: {
    height: 25,
    width: 25,
    marginRight: 2,
  },
});
//#endregion
export default RegistrationView;
