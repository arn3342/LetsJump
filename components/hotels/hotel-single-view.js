import React from 'react';
import {StyleSheet, View, Text, Image, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Rating, AirbnbRating} from 'react-native-ratings';
const HotelSingleView = (props) => {
  return (
    // <TouchableOpacity>
    <TouchableOpacity
      style={styles.container}
      onPress={() => props.onPress(props.data)}>
      <Image
        style={styles.image_hotel}
        source={{
          uri: props.data.mediaPath[0],
        }}
      />
      {/* Hotel info start */}
      <View style={styles.container_hotelInfo}>
        <TouchableOpacity
          style={{width: '100%'}}
          onPress={() => props.onPress(props.data)}>
          <Text style={styles.hotel_name}>
            {props.data.organizationName}
          </Text>
          <View style={{flexDirection: 'row', marginTop: 5}}>
            <Icon
              style={{alignSelf: 'center'}}
              name="ios-location-sharp"
              size={18}
              color="#0074ff"
            />
            <Text
              style={{
                color: '#8c8c8c',
                fontSize: 15,
                alignSelf: 'center',
                marginLeft: 7,
              }}>
              {props.data.location}
            </Text>
          </View>
          <View style={{flexDirection: 'row', marginTop: 8}}>
            <Rating
              style={{alignSelf: 'center'}}
              type="star"
              count={5}
              imageSize={19}
              startingValue={props.data.avgReview}
              readonly
            />
            <Text
              style={{
                color: '#8c8c8c',
                fontSize: 15,
                alignSelf: 'center',
                marginLeft: 7,
                paddingTop: 2,
              }}>
              {props.data.totalReviews + ' reviews'}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  
  container: {
    backgroundColor: '#fff',
    overflow: 'hidden',
    elevation: 5,
    marginRight: 5,
    marginBottom: 20,
    flex: 0,
    borderColor: '#e4e4e4',
    borderWidth: 1,
    borderRadius: 10,
  },
  container_hotelInfo: {
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    padding: 20,
    paddingTop: 15,
    paddingBottom: 20,
    width: '100%',
  },
  tags: {
    paddingTop: 10,
  },
  hotel_name: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Feather',
    lineHeight: 26,
    color: '#454545',
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
    height: 160,
  },
  box_joss: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 4,
    paddingBottom: 4,
    fontSize: 15,
    flex: 0,
    flexDirection: 'row',
    backgroundColor: '#f0f0f0', //#f5f5f5
    marginTop: 20,
    borderRadius: 20,
    position: 'absolute',
    bottom: 10,
    left: 10,
  },
  joss_text: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ff3c36',
  },
});
export default HotelSingleView;
