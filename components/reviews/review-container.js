import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  FlatList,
  StatusBar,
  SafeAreaView,
  TextInput,
  ActivityIndicator
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import ReviewSignleView from './review-single-view';
import Icon from 'react-native-vector-icons/Ionicons';
import {Rating, AirbnbRating} from 'react-native-ratings';
import RNImagePicker from 'react-native-image-picker';
import {GetReviews, GetProfile} from '../../api/User/api';

class ReviewContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      StarImage: require('../../assets/star_zero_dummy.png'),
      showWriteComment: false,
      starSize: 30,
      userReview: {
        rating: 0,
        reviewText: '',
        reviewImgs: [],
      },
      reviews: [],
      isReviewLoading: true,
      hotelData: this.props.route.params.hotelData
        ? this.props.route.params.hotelData
        : this.props.route.params,
      checkInId: this.props.route.params.checkInId ? this.props.route.params.checkInId : 0
    };
  }

  async componentDidMount() {
    let params = {
      organizationID: this.state.hotelData.organizationID
    };
    console.log('Calling DidMount');
    let response = await GetReviews(params);
    console.log('GetReview response is:', response)
    if (response.success || response.data.length > 0) {
      this.setState({
        reviews: response.data,
      });
    }
    this.setState({isReviewLoading: false});
    this.props.navigation.addListener('focus', async () => {
      // The screen is focused
      let newReview = this.props.route.params.NewUserReview;
      if (newReview) {
        let newReviewList = [newReview].concat(this.state.reviews);
        this.setState({reviews: newReviewList});
      }
    });
    console.log(this.state.isReviewLoading)
  }

  render() {
    return (
      <View style={styles.container_main}>
        <Text style={{paddingTop: 25, paddingLeft: 15, fontSize: 17}}>
          Reviews on
        </Text>
        <Text style={{paddingTop: 0, paddingLeft: 15, fontSize: 22}}>
          {this.state.hotelData.organizationName}
        </Text>
        {this.state.isReviewLoading && (
          <ActivityIndicator style={{alignSelf: 'center', marginTop: 30}} size="large" color="#0074ff" />
        )}
        {!this.state.isReviewLoading && this.state.reviews.length <= 0 && (
          <Text style={styles.no_review_notice}>
            The hotel has no reviews yet. Be the first one to share your
            experience!
          </Text>
        )}
        <Container data={this.state.reviews} />
        <WriteReview
          parent={this}
          showWriteComment={() => this.showWriteComment(this.state.checkInId)}
          hideWriteComment={() => this.setState({showWriteComment: false})}
        />
      </View>
    );
  }

  showWriteComment(checkInId) {
    // this.setState({
    //   showWriteComment: true,
    //   StarImage: require('../../assets/star_45_dummy.png'),
    // });
    this.props.navigation.navigate('NewReview', {
      hotelData: this.state.hotelData,
      // userRating: rating,
      checkInId: checkInId
    });
  }
}

const WriteReview = (props) => {
  const hasCheckedIn = props.parent.props.route.params.hasCheckedIn;
  const navigation = props.parent.props.navigation;
  return (
    <View
      style={{
        width: hasCheckedIn ? 70 : '100%',
        height: hasCheckedIn ? 70 : 'auto',
        borderRadius: hasCheckedIn ? 35 : 0,
        position: hasCheckedIn ? 'absolute' : 'relative',
        bottom: hasCheckedIn ? 20 : 0,
        right: hasCheckedIn ? 10 : 0,
        backgroundColor: '#2b79ff',
      }}>
      {!hasCheckedIn && (
        <TouchableOpacity
          onPress={() => {
            !hasCheckedIn && navigation.goBack();
          }}
          style={{
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
            <Icon
              name="arrow-back"
              size={25}
              color="#fff"
              style={{alignSelf: 'center', marginRight: 10}}
            />
            <Text
              style={{
                fontSize: 18,
                alignSelf: 'center',
                color: '#fff',
                fontWeight: 'bold',
              }}>
              Check in first to share a review
            </Text>
          </View>
        </TouchableOpacity>
      )}

      {hasCheckedIn && !props.parent.state.showWriteComment && (
        <TouchableOpacity
          onPress={() => props.showWriteComment()}
          style={{
            width: '100%',
            height: 'auto',
            padding: 10,
            paddingTop: 20,
            paddingBottom: 20,
            elevation: 20,
          }}>
          {/* {!props.parent.state.showWriteComment && hasCheckedIn && (
            <Text style={{fontSize: 18, alignSelf: 'center', color: '#fff'}}>
              Rate this place
            </Text>
          )} */}
          <Image
            source={require('../../assets/pen_icon.png')}
            style={{width: 30, height: 30, alignSelf: 'center'}}
            resizeMode="cover"
          />
        </TouchableOpacity>
      )}
      {/* <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            marginTop: 10,
          }}> */}
      {/* <TouchableOpacity onPress={() => props.showWriteComment()}> */}
      {/* {props.parent.props.route.params &&
            props.parent.props.route.params.hasCheckedIn && (
              <AirbnbRating
                onFinishRating={(rating) => props.showWriteComment(rating)}
                type="heart"
                count={5}
                selectedColor="#00d5ff"
                showRating={false}
                size={30}
                defaultRating={1}
              />
            )} */}
      {/* </View> */}

      {/* Add comment box start */}
    </View>
  );
};

const Container = (props) => {
  // console.log('Data passed to container:', props);
  const renderItem = ({item}) => {
    // console.log('Data passed as Item:', item);
    if (item)
      return (
        <ReviewSignleView
          data={item}
          onPress={(hotelData) => showHotelReview(props, hotelData)}
        />
      );
  };
  return (
    <View style={[styles.container, props.style]}>
      <FlatList
        style={{paddingBottom: 25}}
        data={props.data}
        renderItem={renderItem}
        keyExtractor={(item) => item.reviewID.toString()}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};
function showHotelReview(props, hotelData) {
  // console.log('Hotel Clicked', value);
  props.navigation.navigate('HotelDataSingle', {hotelData});
}
const styles = StyleSheet.create({
  container: {
    paddingTop: 15,
    flex: 1,
    paddingLeft: 10,
    paddingRight: 10,
  },
  container_main: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
  },
  no_review_notice: {
    fontSize: 18,
    width: '70%',
    alignSelf: 'center',
    textAlign: 'center',
    marginTop: 40,
  },
});
export default ReviewContainer;
