import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Rating, AirbnbRating} from 'react-native-ratings';
import {SliderBox} from 'react-native-image-slider-box';
import moment from 'moment';
import {useState} from 'react';
import {TextInput} from 'react-native-gesture-handler';

function ReviewSignleView(props) {
  const [optionsVisible, setOptionsVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const reviewMediaURLs = props.data.reviewMediaUrls.includes(',')
    ? props.data.reviewMediaUrls.split(',')
    : [props.data.reviewMediaUrls];

  const hasMedia = !(reviewMediaURLs[0] === '');
  const reportOptions = [
    "It's misleading",
    'False review',
    'Paid review',
    'Inappropriate content',
    'Intended to defame',
  ];

  const submitReport = async() => {
    let data = {
      reviewID: props.data.reviewID,
      reviewUserID: props.data.userID,
      reportUserID: 35,
      reportReason: reportReason
    }
    console.log('Report is:', data)
    // let response = await AddReviewReport(data);
    // if(response.success){
    //   setModalVisible(false);
    // }
    setModalVisible(false)
  }

  return (
    // <TouchableOpacity>
    <View>
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View
          style={{
            backgroundColor: '#00000080',
            height: '100%',
          }}>
          <View style={styles.modal}>
            <Text style={[styles.padding_medium, {fontSize: 18}]}>
              Report this review
            </Text>
            {/* <Text style={{textAlign: 'center'}}>Report to admin</Text> */}
            <View
              style={[
                styles.padding_medium,
                {flexDirection: 'row', flexWrap: 'wrap'},
              ]}>
              {reportOptions.map((option, index) => {
                const isSelected = option === reportReason;
                return (
                  <TouchableOpacity key={index} style={isSelected ? styles.reportOptions_selected : styles.reportOptions} onPress={() => setReportReason(option)}>
                    <Text style={isSelected ? styles.reportOptions_text_selected : styles.reportOptions_text}>{option}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            <TouchableOpacity
              onPress={() => submitReport()}
              style={{
                backgroundColor: '#2b79ff',
                marginTop: 20,
                width: '100%',
                height: 'auto',
                padding: 10,
                paddingLeft: 15,
                paddingTop: 20,
                paddingBottom: 15,
              }}>
              {/* {!props.parent.state.showWriteComment && hasCheckedIn && (
          <Text style={{fontSize: 18, alignSelf: 'center', color: '#fff'}}>
            Rate this place
          </Text>
        )} */}

              <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                <Text
                  style={{
                    fontSize: 18,
                    alignSelf: 'center',
                    color: '#fff',
                    fontWeight: 'bold',
                  }}>
                  Submit report
                </Text>
                <Icon
                  name="arrow-forward"
                  size={25}
                  color="#fff"
                  style={{alignSelf: 'center', marginRight: 10}}
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <TouchableOpacity
        style={styles.container}
        onLongPress={() => setOptionsVisible(true)}>
        <View style={styles.user_Container}>
          <Image
            style={styles.user_Img}
            source={{
              uri: props.data.imageURL,
            }}
          />
          <View style={styles.user_Name_container}>
            <Text style={styles.user_Name}>
              {props.data.firstName + ' ' + props.data.lastName}
            </Text>
            <Text>
              Checked in on{' '}
              {moment(props.data.checkInDate).format('d MMM, yyyy')}
            </Text>
          </View>
          <View
            style={{
              position: 'absolute',
              right: 5,
              alignSelf: 'center',
              flexDirection: 'row',
            }}>
            <Text
              style={{
                alignSelf: 'center',
                paddingTop: 3,
                fontSize: 18,
                fontWeight: 'bold',
              }}>
              {props.data.reviewRating}
            </Text>
            <AirbnbRating
              count={1}
              defaultRating={1}
              size={20}
              showRating={false}
              selectedColor="#f2900f"
            />
          </View>
        </View>
        <View
          style={{
            width: '100%',
            height: 2,
            backgroundColor: '#e0e0e0',
            marginTop: 10,
          }}
        />
        <Text
          style={{
            fontSize: 15,
            lineHeight: 25,
            marginTop: 15,
            padding: 10,
            paddingTop: 0,
          }}>
          {props.data.reviewText}
        </Text>
        {hasMedia && <SliderBox images={reviewMediaURLs} />}

        {optionsVisible ? (
          <View style={{flexDirection: 'row'}}>
            {props.data.isEditable && (
              <TouchableOpacity
                onPress={() =>
                  props.navigation.navigate('NewReview', {
                    currentReview: props.data,
                  })
                }
                style={{
                  backgroundColor: '#0390fc',
                  borderRadius: 5,
                  marginTop: 15,
                  padding: 8,
                  paddingLeft: 15,
                  paddingRight: 15,
                }}>
                <Text style={{fontSize: 16, color: '#fff', fontWeight: 'bold'}}>
                  Edit
                </Text>
              </TouchableOpacity>
            )}

            {!props.data.isEditable && (
              <TouchableOpacity
                onPress={() => setModalVisible(true)}
                style={{
                  flexDirection: 'row',
                  padding: 8,
                  paddingLeft: 15,
                  paddingRight: 15,
                  marginTop: 15,
                  marginLeft: props.data.isEditable ? 5 : 0,
                }}>
                <Text
                  style={{
                    fontSize: 16,
                    color: '#0390fc',
                    textAlign: 'center',
                    fontWeight: 'bold',
                  }}>
                  Report this
                </Text>
                <Text style={{textAlign: 'center', fontSize: 16}}>
                  {' '}
                  if something's wrong
                </Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <Text style={{color: '#757575', marginTop: 10}}>
            Tap and hold for options
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  padding_medium: {
    marginTop: 15,
    marginLeft: 20,
    marginRight: 20,
  },
  modal: {
    width: '100%',
    position: 'absolute',
    bottom: 0,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    justifyContent: 'flex-start',
  },
  reportOptions_text: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#000'
  },
  reportOptions_text_selected: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'white'
  },
  reportOptions: {
    padding: 8,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 25,
    borderColor: '#8c8c8c',
    borderWidth: 2,
    marginTop: 10,
    marginRight: 8,
  },
  reportOptions_selected: {
    padding: 8,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 25,
    borderColor: '#2b79ff',
    backgroundColor: '#2b79ff',
    borderWidth: 2,
    marginTop: 10,
    marginRight: 8,
  },
  container: {
    width: '100%',
    backgroundColor: 'white',
    padding: 15,
    paddingLeft: 10,
    borderRadius: 8,
    marginTop: 10,
    marginBottom: 15,
    borderColor: '#abe0ff',
    borderWidth: 1,
    elevation: 5,
  },
  user_Container: {
    flexDirection: 'row',
    flex: 0,
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

export default ReviewSignleView;
