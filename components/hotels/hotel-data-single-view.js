import React from 'react';
import {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
// import { SliderBox } from "react-native-image-slider-box";
import {SliderBox} from 'react-native-image-slider-box';
import HotelContainer from './hotel-container';
import { AddCheckIn, AddFavorite,GetFavorite } from '../../api/User/api';

class HotelDataSingleView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checkedIn: false,
      isCheckingIn: false,
      isCurrentlyFavorite: false,
      isFavoriteProcessing: false,
      hotelData: this.props.route.params,
      checkInId: 0
    };
  }
  analyzeReview = (value, expectedReturnType) => {
    value = parseInt(value);
    if (expectedReturnType === 'color') {
      return value >= 4.5
        ? '#ff3c36'
        : value >= 4 && value < 4.5
        ? 'green'
        : value >= 3.5 && value < 4
        ? '#ff842b'
        : '#ff842b';
    } else {
      return value >= 4.5
        ? 'Joss'
        : value >= 4 && value < 4.5
        ? 'Good'
        : value >= 3.5 && value < 4
        ? 'Ok'
        : 'Good';
    }
  };

  async componentDidMount(){
    this.setState({ isFavoriteProcessing: true })
    console.log('Hotel single view PROPS are:', this.props.route.params)
    let data = {
      organizationID: this.state.hotelData.organizationID,
      accessToken: this.state.hotelData.accessToken
    }
    let response = await GetFavorite(data)
    console.log('Favorite GET response is:', response.data)
    if(response.success){
      this.setState({ 
        isCurrentlyFavorite: response.data.includes('exist') ? true : false, 
        isFavoriteProcessing: false 
      })
    }
  }
  setFavorite = async() => {
    this.setState({ isFavoriteProcessing: true })
    let data = {
      organizationID: this.state.hotelData.organizationID,
      accessToken: this.state.hotelData.accessToken,
      isCurrentlyFavorite: this.state.isCurrentlyFavorite
    }
    let response = await AddFavorite(data)
    console.log('Favorite response is:', response.data)
    if(response.success){
      this.setState({ isCurrentlyFavorite: !this.state.isCurrentlyFavorite, isFavoriteProcessing: false })
    }
  }

  render() {
    const hotelData = this.props.route.params;
    const navigation = this.props.navigation;
    let isFavorite = false;
    return (
      <View style={styles.container}>
        {/* <Image
          style={styles.image_hotel}
          source={{
            uri: hotelData.imageSource,
          }} */}
        <SliderBox images={hotelData.mediaPath} />
        <View
          style={{
            width: '100%',
            marginTop: -35,
            marginBottom: -20,
            paddingRight: 10,
          }}>
          <TouchableOpacity
            style={this.state.isCurrentlyFavorite ? styles.favoruiteBtn_checked : styles.favoruiteBtn}
            onPress={() => this.setFavorite()}>
            {this.state.isFavoriteProcessing ? (<ActivityIndicator size="large" color="blue"/>) :
            (<Icon
              style={{alignSelf: 'center'}}
              name={this.state.isCurrentlyFavorite ? "heart" : "heart-outline"}
              size={30}
              color={this.state.isCurrentlyFavorite ? "#fff" : "#ff3c26"}
            />)}
          </TouchableOpacity>
        </View>
        <ScrollView>
          <View style={styles.container_data}>
            <View style={styles.container_row}>
              {/* Name and location container */}
              <View>
                <Text style={styles.hotel_name}>
                  {hotelData.organizationName}
                </Text>
                {/* Location box */}
                <View style={styles.box_location}>
                  <Icon
                    name="location"
                    color="red"
                    size={15}
                    style={{alignSelf: 'center', paddingTop: 2}}
                  />
                  <Text style={styles.text_regular}>{hotelData.location}</Text>
                </View>
              </View>
              {/* End Name and location container */}
            </View>
            {/* End Location Box */}

            <Text style={styles.hotel_desc}>{hotelData.shortDescription}</Text>
            {/* <ImageContainer style={{height: '11%', marginTop: 15}} /> */}
            <CurrentReviewBox
              style={{marginTop: 20}}
              avgReview={hotelData.avgReview}
              reviewText={this.analyzeReview(hotelData.avgReview, '')}
              hotelData={this.state.hotelData}
              navigation={navigation}
            />
            <Text
              style={{
                marginTop: 10,
                color: '#999999',
                fontSize: 16,
                marginTop: 15,
              }}>
              Facilities
            </Text>
            <View
              style={{
                marginTop: 10,
                flexDirection: 'row',
                width: '100%',
                flexWrap: 'wrap',
              }}>
              {Object.entries(hotelData).map((facility, index) => {
                if (facility[0].includes('has') && facility[1] === true) {
                  return (
                    <Text
                      key={index}
                      style={{
                        marginBottom: 10,
                        borderColor: '#0074ff',
                        borderWidth: 2,
                        borderRadius: 5,
                        alignSelf: 'baseline',
                        fontSize: 16,
                        color: '#0074ff',
                        fontWeight: 'bold',
                        padding: 5,
                        paddingLeft: 10,
                        paddingRight: 10,
                        marginRight: 10,
                      }}>
                      {facility[0].split('has')[1]}
                    </Text>
                  );
                }
              })}
            </View>
          </View>
        </ScrollView>
        <BottomButtons
          state={this.state}
          setCheckingIn={() => this.setCheckIn()}
          navigation={navigation}
          hotelData={this.state.hotelData}
          checkInId={this.state.checkInId}
        />
      </View>
    );
  }

  setCheckIn = async() => {
    this.setState({
      isCheckingIn: true,
    });
    const hotelData = this.state.hotelData
    let checkInData = {
      accessToken: hotelData.accessToken,
      organizationID: hotelData.organizationID,
      checkInDate: new Date()
    }
    let response = await AddCheckIn(checkInData);
    if(response.success){
      this.setState({  checkedIn: true, checkInId: response.data })
    }
    console.log('CheckIN response is:', response.data)
  };
}
const Facilities = (props) => {
  return (
    <Text
      key={index}
      style={{
        marginBottom: 10,
        borderColor: '#0074ff',
        borderWidth: 2,
        borderRadius: 5,
        alignSelf: 'baseline',
        fontSize: 16,
        color: '#0074ff',
        fontWeight: 'bold',
        padding: 5,
        paddingLeft: 10,
        paddingRight: 10,
        marginRight: 10,
      }}>
      {facility.split('has')[1]}
    </Text>
  );
};
const CurrentReviewBox = (props) => {
  return (
    <View style={[styles.container_currentReview, props.style]}>
      <View style={styles.container_currentReview_small}>
        <Text style={styles.currentReview_title}>Reviews</Text>
        <Text style={styles.currentReview_value}>{props.avgReview}</Text>
      </View>
      <View style={styles.container_currentReview_small}>
        <Text style={styles.currentReview_title}>Place is</Text>
        <Text style={styles.currentReview_value}>{props.reviewText}</Text>
      </View>
      <TouchableOpacity
        style={styles.button_reviews}
        onPress={() => props.navigation.navigate('HotelReviewSingle', props.hotelData)}>
        <Text
          style={{
            fontSize: 17,
            color: '#fff',
            // fontWeight: 'bold',
            marginRight: 5,
          }}>
          Reviews
        </Text>
        <Icon
          name="arrow-forward"
          color="#fff"
          size={18}
          style={{alignSelf: 'center', paddingTop: 2}}
        />
      </TouchableOpacity>
    </View>
  );
};
const BottomButtons = (props) => {
  const setCheckingIn = () => {
    // props.state.setState({
    //   checkedIn: true
    // })
    console.log(props.state);
  };
  return (
    <View
      style={{
        flexDirection: 'row',
        height: '10%',
        paddingTop: 10,
        marginBottom: 15,
        width: '95%',
        alignSelf: 'center',
      }}>
      <TouchableOpacity
        onPress={() =>
          props.state.checkedIn
            ? props.navigation.navigate('HotelReviewSingle', {
                hotelData: props.hotelData,
                hasCheckedIn: true,
                checkInId: props.checkInId
              })
            : props.setCheckingIn()
        }
        style={{
          backgroundColor: props.state.isCheckingIn ? '#0074ff' : '#fff',
          borderColor: '#0074ff',
          borderWidth: 2,
          width: '100%',
          borderRadius: 10,
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row',
        }}>
        <Text
          style={{
            fontSize: 20,
            color: props.state.checkedIn ? '#fff' : '#0074ff',
            fontWeight: 'bold',
          }}>
          {props.state.checkedIn
            ? 'Joss ? Rate it!'
            : props.state.isCheckingIn
            ? ''
            : 'Check In'}
        </Text>

        {!props.state.isCheckingIn && (
          <Icon
            name="arrow-forward"
            color="#0074ff"
            size={28}
            style={{alignSelf: 'center', paddingTop: 2, paddingLeft: 10}}
          />
        )}
        {props.state.isCheckingIn && !props.state.checkedIn && (
          <ActivityIndicator size="large" color="#fff" />
        )}
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  favoruiteBtn: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
    elevation: 5,
    justifyContent: 'center',
    alignSelf: 'flex-end',
  },
  favoruiteBtn_checked: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ff3c26',
    elevation: 5,
    justifyContent: 'center',
    alignSelf: 'flex-end',
  },
  container: {
    backgroundColor: '#fff',
    overflow: 'hidden',
    height: '100%',
    width: '100%',
  },
  container_data: {
    backgroundColor: '#fff',
    overflow: 'hidden',
    height: '100%',
    width: '100%',
    padding: 20,
    paddingBottom: 5,
  },
  container_currentReview: {
    width: '100%',
    // backgroundColor: 'red',
    marginTop: 10,
    flexDirection: 'row',
  },
  container_currentReview_small: {
    width: '33%',
  },
  currentReview_title: {
    color: '#999999',
    fontSize: 16,
  },
  currentReview_value: {
    fontSize: 20,
    color: '#0074ff',
    fontWeight: 'bold',
  },
  container_row: {
    flex: 0,
    flexDirection: 'row',
  },
  button_gallery: {
    width: '35%',
    padding: 5,
    height: '75%',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    flex: 0,
    backgroundColor: '#deedff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#0074ff',
  },
  button_reviews: {
    width: '33%',
    padding: 5,
    height: '90%',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    flex: 0,
    borderRadius: 5,
    backgroundColor: '#0074ff',
  },
  container_hotelInfo: {
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    width: '60%',
    padding: 20,
    paddingTop: 10,
    paddingBottom: 0,
  },
  tags: {
    paddingTop: 10,
  },
  hotel_name: {
    fontSize: 22,
    fontFamily: 'Feather',
    lineHeight: 26,
  },
  hotel_desc: {
    fontSize: 17,
    fontFamily: 'Feather',
    lineHeight: 26,
    paddingTop: 15,
    color: '#707070',
  },
  flexBox: {
    flexDirection: 'row',
    flex: 0,
  },
  container_name: {
    backgroundColor: '#fff',
    width: '90%',
    marginTop: -40,
    marginBottom: 15,
    elevation: 5,
  },
  image_hotel: {
    height: '32%',
    width: '100%',
  },
  image_small: {
    height: '100%',
    width: 80,
    marginLeft: 5,
  },
  box_location: {
    paddingTop: 4,
    paddingBottom: 4,
    flex: 0,
    flexDirection: 'row',
  },
  text_regular: {
    fontSize: 17,
    paddingLeft: 5,
  },
});
export default HotelDataSingleView;
