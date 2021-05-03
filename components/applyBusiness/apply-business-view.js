import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Button,
  Text,
  Image,
  TouchableOpacity,
  Linking,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons';
import RNImagePicker from 'react-native-image-picker';

class ApplyBusinessView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasAgreed: true,
      isDataSubmitSuccess: false,
      confirmSubmit: false,
      hotelInfo: {
        hotelName: '',
        houseNo: '',
        streetAddress: '',
        zipCode: '',
        ownerName: '',
        ownerContact: '',
        hotelImages: [],
      },
    };
  }

  processSubmission = () => {
    !this.state.isDataSubmitSuccess
      ? this.setState({
          isDataSubmitSuccess: true,
        })
      : this.setState({
          confirmSubmit: true,
        });
  };

  render() {
    // const navigation = this.props.route.params.navigation;
    return (
      <View
        style={{
          backgroundColor: '#fff',
          height: '100%',
          width: '100%',
        }}>
        {/* <View
          style={{
            height: '100%',
            width: '80%',
            justifyContent: 'center',
            alignSelf: 'center',
          }}> */}
        <ScrollView>
          <Text
            style={{
              fontSize: 26,
              color: '#0074ff',
              fontWeight: 'bold',
              padding: 20,
              paddingTop: 25,
            }}>
            {!this.state.hasAgreed
              ? 'Do you own an amazing business?'
              : 'Please complete the form below'}
          </Text>
          {!this.state.hasAgreed ? (
            <Disclaimer />
          ) : (
            <CompanyFields parent={this} />
          )}
        </ScrollView>
        {/* </View> */}

        <TouchableOpacity
          style={{
            backgroundColor: '#0074ff',
            justifyContent: 'center',
            marginTop: 10,
            borderRadius: 8,
            margin: 20,
            marginBottom: 10,
          }}
          onPress={() => this.processSubmission()}>
          {!this.state.isDataSubmitSuccess ? (<Text
            style={{
              alignSelf: 'center',
              fontSize: 20,
              color: '#fff',
              padding: 16,
              fontWeight: 'bold',
            }}>Submit Now
          </Text>
          ) : (
            <ActivityIndicator size="large" color="#fff" style={{padding: 11}}/>
          )}
        </TouchableOpacity>
      </View>
      
    );
  }
}

const CompanyFields = (props) => {
  return (
    <View style={styles.fieldContainer}>
      <TextInput style={styles.input} placeholder="Name of business" />
      <TextInput style={styles.input} placeholder="House no." />
      <TextInput style={styles.input} placeholder="Street Address" />
      <TextInput style={styles.input} placeholder="Zip Code" />
      <TextInput
        editable={false}
        style={styles.input}
        placeholder="District: Dhaka (Only Dhaka available)"
      />
      <TextInput style={styles.input} placeholder="Owner name" />
      <TextInput style={styles.input} placeholder="Owner contact no." />
      <ImageContainer parent={props.parent} />
    </View>
  );
};

const ImageContainer = (props) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        marginTop: 5,
        paddingTop: 10,
        width: '90%',
      }}>
      {props.parent.state.hotelInfo.hotelImages.map((img, index) => {
          return(<Image key={index}
            source={img}
            style={{width: '25%', height: '100%', borderRadius: 10, marginRight: 5}}></Image>)
        })}
      <TouchableOpacity
        onPress={() => showImagePicker(props.parent)}
        style={{
          backgroundColor: '#ebebeb',
          width: '25%',
          borderRadius: 10,
        }}>
        <Icon
          name="images"
          color="#0074ff"
          size={28}
          style={{alignSelf: 'center', paddingTop: 10}}
        />
        <Icon
          name="add"
          color="#0074ff"
          size={28}
          style={{alignSelf: 'center', paddingTop: 2, paddingBottom: 5}}
        />
      </TouchableOpacity>
    </View>
  );
};

showImagePicker = (props) => {
  var prevImageState = props.state.hotelInfo.hotelImages;
  const options = {
    title: 'Select your pictures',
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
        prevImageState.push(response)
        // console.log('Previously added', prevImageState)
        props.setState((prevState) => ({
          userinfo: {
            ...prevState.hotelInfo,
            hotelImages: prevImageState,
          },
        }));
      }
    }
  });
};

const Disclaimer = () => {
  return (
    <View>
      <Text style={{padding: 20, paddingTop: 0, fontSize: 18, lineHeight: 26}}>
        Get your business listed in our app and react global audience. Expand
        your customer base and many more!
      </Text>
      <Text
        style={{
          marginLeft: 20,
          marginRight: 20,
          marginBottom: 30,
          padding: 25,
          fontSize: 18,
          backgroundColor: '#e4e4e4',
        }}>
        <Text style={{fontWeight: 'bold'}}>
          Terms and Conditions for Company Listing
        </Text>
        {'\n'}
        {'\n'}
        <Text style={{fontWeight: 'bold'}}>Introduction</Text>
        {'\n'}
        {'\n'}
        Standard Terms and Conditions written on this webpage shall manage your
        use of our website, Webiste Name accessible at Website.com. These Terms
        will be applied fully and affect to your use of this Website. By using
        this Website, you agreed to accept all terms and conditions written in
        here. You must not use this Website if you disagree with any of these
        Website Standard Terms and Conditions. Minors or people below 18 years
        old are not allowed to use this Website.
      </Text>
    </View>
  );
};

const styles = {
  fieldContainer: {
    width: '100%',
    alignItems: 'center',
  },
  input: {
    backgroundColor: '#f2f2f2',
    height: 45,
    borderRadius: 8,
    paddingLeft: 12,
    fontSize: 17,
    marginTop: 15,
    width: '90%',
  },
};
export default ApplyBusinessView;
