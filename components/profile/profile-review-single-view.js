import React from 'react';
import {StyleSheet, View, Text, Image, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Rating, AirbnbRating} from 'react-native-ratings';
import {SliderBox} from 'react-native-image-slider-box';

const ProfileReviewSignleView = (props) => {
  return (
    // <TouchableOpacity>
    <TouchableOpacity style={styles.container}>
      <View style={styles.user_Container}>
        <View style={styles.user_Name_container}>
          <Text style={styles.user_Name}>{props.data.hotelName}</Text>
          <Text>Checked in on {props.data.checkInDate}</Text>
        </View>
      </View>
      <View
        style={{
          width: '95%',
          alignSelf: 'center',
          height: 2,
          backgroundColor: '#e0e0e0',
          marginTop: 10,
          marginBottom: 15,
        }}
      />
      <View
        style={{
          flexDirection: 'row',
          marginLeft: 10,
          paddingLeft: 10,
          paddingRight: 10,
        }}>
        <Text style={{alignSelf: 'center', fontSize: 18, fontWeight: 'bold'}}>
          {props.data.reviewText}
        </Text>
        <Rating
          style={{marginLeft: 10, marginTop: 1}}
          type="heart"
          count={5}
          imageSize={20}
          startingValue={props.data.reviewPoint}
          readonly
        />
      </View>
      <Text
        style={{
          fontSize: 15,
          lineHeight: 25,
          marginTop: 15,
          padding: 20,
          paddingTop: 0,
        }}>
        {props.data.reviewBody}
      </Text>
        <SliderBox images={props.data.reviewImgs} />
      {/* {props.data.reviewImgs && props.data.reviewImgs.map((img, index) => { return(<Image source={{uri: img}} key={index} style={{width: '15%', resizeMode: 'stretch', height: 50, marginLeft: 10}}/>)})} */}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#fff',
    paddingTop: 15,
    paddingBottom: 15,
    borderRadius: 15,
    marginTop: 10,
    marginBottom: 5,
  },
  user_Container: {
    flexDirection: 'row',
    flex: 0,
    paddingLeft: 10,
    paddingRight: 10,
  },
  user_Name_container: {
    paddingLeft: 10,
    alignSelf: 'center',
  },
  user_Name: {
    color: '#6b6b6b',
    fontSize: 17,
    fontWeight: 'bold',
  },
  user_Img: {
    width: 45,
    height: 45,
    borderRadius: 22,
  },
});

export default ProfileReviewSignleView;
