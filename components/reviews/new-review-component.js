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
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import ReviewSignleView from './review-single-view';
import Icon from 'react-native-vector-icons/Ionicons';
import {Rating, AirbnbRating} from 'react-native-ratings';
import RNImagePicker from 'react-native-image-picker';
import {AddReview, UploadMedia} from '../../api/User/api';

class NewReview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      StarImage: require('../../assets/star_zero_dummy.png'),
      showWriteComment: false,
      starSize: 30,
      userReview: this.props.route.params.currentReview,
      hotelData: this.props.route.params.hotelData,
      isAddingReview: false,
      currentReview: this.props.route.params.currentReview,
      reviewHasImage: false,
      newCheckInId: this.props.route.params.checkInId,
    };
  }
  removeImage(index, reviewState) {
    const currentReview = this.state.userReview.reviewMediaUrls;
    const newReview = this.state.userReview.reviewImgs;
    var prevImageState = reviewState == 'current' ? currentReview : newReview;
    prevImageState.splice(index, 1);

    // console.log('Previously added', prevImageState)
    if (reviewState === 'current') {
      console.log('Removing from current.');
      this.setState((prevState) => ({
        userReview: {
          ...prevState.hotelInfo,
          reviewMediaUrls: prevImageState,
          reviewImgs: newReview,
        },
      }));
    } else {
      console.log('Removing from new.');

      this.setState((prevState) => ({
        userReview: {
          ...prevState.hotelInfo,
          reviewImgs: prevImageState,
          reviewMediaUrls: currentReview,
        },
      }));
    }
    let currentHasImages = currentReview && currentReview.length > 0;
    let newHasImages = newReview && newReview.length > 0;
    let hasReviewImg = currentHasImages || newHasImages;

    console.log('HasReviews after removing image is:', hasReviewImg);
    this.setState({reviewHasImage: hasReviewImg});
    if (currentReview) {
      console.log('No reviews left in currentReview');
      if (currentReview.length <= 0) {
        this.setState({reviewHasImage: false});
      }
    }
    if (newReview) {
      console.log('No reviews left in newReview');
      if (newReview.length <= 0) {
        this.setState({reviewHasImage: false});
      }
    } else {
      this.setState({reviewHasImage: true});
    }
  }

  componentDidMount() {
    // let reviewMediaURL = '';
    // let currentReview = this.state.currentReview;
    // if (currentReview.reviewMediaUrls !== '') {
    //   reviewMediaURL = this.state.currentReview.reviewMediaUrls.includes(',')
    //     ? this.state.userReview.reviewMediaUrls.split(',')
    //     : [this.state.userReview.reviewMediaUrls];

    //   this.setState((prevState) => ({
    //     currentReview: {
    //       ...prevState.currentReview,
    //       reviewMediaUrls: reviewMediaURL,
    //     },
    //   }));
    // }

    let response = this.ifNewOrCurrentReview();
  }

  ifNewOrCurrentReview() {
    const currentReview = this.state.currentReview;
    const newReview = this.state.userReview;

    if (currentReview && currentReview.reviewMediaUrls.length > 0) {
      this.setState({reviewHasImage: true});
      if (currentReview.reviewMediaUrls.includes(',')) {
        currentReview.reviewMediaUrls = currentReview.reviewMediaUrls.split(
          ',',
        );
      } else {
        if (!Array.isArray(currentReview.reviewMediaUrls)) {
          currentReview.reviewMediaUrls = [currentReview.reviewMediaUrls];
        }
      }
    }
    if (currentReview) {
      this.setState({userReview: currentReview});
      return 'current';
    }
    return 'new';
  }

  async addReview() {
    this.setState({isAddingReview: true});
    // const newReview = this.state.userReview.reviewImgs;
    // if(newReview && newReview.length > 0){

    // }

    let base64Array = [];
    //console.log('Image data in state:', this.state.userReview.reviewImgs);
    this.state.userReview.reviewImgs &&
      this.state.userReview.reviewImgs.map((x) => {
        base64Array.push({base64: x.byte64.data});
      });

    let response_default = {
      success: true,
      data: this.state.userReview.reviewMediaUrls
        ? this.state.userReview.reviewMediaUrls.toString()
        : '',
    };
    //console.log('Base64 array length is:', base64Array[0].length);
    let response =
      base64Array.length > 0
        ? await UploadMedia(base64Array)
        : response_default;

    console.log('UploadMedia response is:', response.data);
    const hotelData = this.state.hotelData;
    let reviewData = {
      checkInId: this.state.newCheckInId,
      reviewID: this.state.userReview.reviewID
        ? this.state.userReview.reviewID
        : 0,
      organizationID: hotelData
        ? hotelData.organizationID
        : this.state.userReview.organizationID,
      reviewText: this.state.userReview.reviewText,
      userID: this.state.userReview.userID ? this.state.userReview.userID : 0,
      reviewRating: this.state.userReview.rating
        ? this.state.userReview.rating
        : this.state.userReview.reviewRating,
      reviewMediaURLs:
        response === response_default
          ? response.data
          : response_default.data === ''
          ? response.data.toString()
          : response_default.data + ',' + response.data.toString(),
    };
    if (hotelData) {
      reviewData.accessToken = hotelData.accessToken;
    }
    else if(this.state.currentReview){
      reviewData.userID = this.state.currentReview.userID;
    }
    // console.log('The returned URL is:', response.data.toString());

    if (response.success) {
      console.log('MediaUpload success');

      if(reviewData.accessToken) delete reviewData.userID;
      let reviewResponse = await AddReview(reviewData);
      console.log('AddReview response is:', reviewResponse.data);
      if (reviewResponse.success) {
        console.log('Added review successfully');
        if (this.state.currentReview) {
          this.props.navigation.navigate('Profile');
        } else {
          this.props.navigation.navigate('HotelReviewSingle', {
            NewUserReview: reviewResponse.data,
          });
        }
      }
    }
    this.setState({isAddingReview: false});
  }
  setRatingText(e) {
    this.setState((prevState) => ({
      userReview: {
        ...prevState.userReview,
        reviewText: e,
      },
    }));
  }
  setRating(rating) {
    this.setState((prevState) => ({
      userReview: {
        ...prevState.userReview,
        rating: rating,
      },
    }));
  }

  render() {
    const currentReview = this.state.currentReview;
    let hasImages = this.state.reviewHasImage;

    // console.log('After adding, new ImageArray is:', this.state.userReview.reviewImgs)
    return (
      <View style={styles.container}>
        <TextInput
          onChangeText={(e) => this.setRatingText(e)}
          style={{
            backgroundColor: '#f2f2f2',
            height: 100,
            fontSize: 16,
            padding: 10,
            textAlignVertical: 'top',
            marginTop: 15,
          }}
          value={currentReview ? this.state.userReview.reviewText : null}
          multiline
          placeholder="Share your experience..."
        />
        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 1, flexDirection: 'row'}}>
            <TouchableOpacity
              onPress={() => showImagePicker(this)}
              style={{
                width: '100%',
                backgroundColor: '#ebebeb',
                borderRadius: 8,
                justifyContent: 'center',
                alignItems: 'center',
                paddingLeft: 15,
                paddingRight: 15,
                padding: 10,
                marginTop: 10,
              }}>
              <Icon
                name="images"
                color="#0074ff"
                size={28}
                style={{alignSelf: 'center', paddingTop: 2}}
              />
            </TouchableOpacity>
          </View>
        </View>
        {hasImages && (
          <ImageContainer
            images={this.state.userReview.reviewMediaUrls}
            images2={this.state.userReview.reviewImgs}
            removeImage={(index, reviewState) =>
              this.removeImage(index, reviewState)
            }
          />
        )}
        <View
          style={{
            position: 'absolute',
            bottom: 10,
            left: 8,
            right: 8,
          }}>
          <TouchableOpacity
            style={{
              borderColor: '#e4e4e4',
              borderWidth: 1,
              borderRadius: 25,
              padding: 10,
              elevation: 5,
              backgroundColor: '#fff',
              width: '60%',
              flexDirection: 'row',
              justifyContent: 'center',
              alignSelf: 'center',
              marginBottom: 10,
            }}>
            {/* <Text style={{alignSelf: 'center', marginRight: 10, fontWeight: 'bold', fontSize: 18}}>Give stars</Text> */}
            <AirbnbRating
              onFinishRating={(rating) => this.setRating(rating)}
              count={5}
              showRating={false}
              size={25}
              defaultRating={currentReview ? currentReview.reviewRating : 1}
            />
          </TouchableOpacity>

          <TouchableOpacity
            disabled={this.state.isAddingReview}
            style={[
              styles.button_reviews,
              {backgroundColor: this.state.isAddingReview ? '#fff' : '#0074ff'},
            ]}
            onPress={() => this.addReview()}>
            {this.state.isAddingReview ? (
              <ActivityIndicator size="large" color="#0074ff" />
            ) : (
              <Text
                style={{
                  fontSize: 17,
                  color: '#fff',
                  // fontWeight: 'bold',
                  marginRight: 5,
                }}>
                Add Review
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
const ImageContainer = (props) => {
  const ImageWithButtons = (propsNew) => {
    const isUrl = typeof propsNew.img === 'string';
    return (
      <View key={propsNew.index}>
        <Image
          source={isUrl ? {uri: propsNew.img} : propsNew.img.byte64}
          style={{
            width: '100%',
            height: 250,
            borderRadius: 10,
            marginRight: 10,
          }}
          resizeMode="cover"
        />
        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => propsNew.removeImage(propsNew.index)}>
          <Icon name="close" color="black" size={30} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <ScrollView>
      <View style={{paddingBottom: 140}}>
        {props.images
          ? props.images.map((img, index) => {
              return (
                <ImageWithButtons
                  key={index}
                  index={index}
                  img={img}
                  removeImage={() => props.removeImage(index, 'current')}
                />
              );
            })
          : null}
        {props.images2
          ? props.images2.map((img, index) => {
              return (
                <ImageWithButtons
                  key={index}
                  index={index}
                  img={img}
                  removeImage={() => props.removeImage(index, 'new')}
                />
              );
            })
          : null}
      </View>
    </ScrollView>
  );
};
const showImagePicker = (props) => {
  var prevImageState =
    props.state.userReview && props.state.userReview.reviewImgs
      ? props.state.userReview.reviewImgs
      : [];
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
        // props.addImage(response);
        prevImageState.push({byte64: response});
        // console.log('Previously added', prevImageState)
        props.setState((prevState) => ({
          userReview: {
            ...prevState.userReview,
            reviewImgs: prevImageState,
          },
          reviewHasImage: true,
        }));
      }
    }
  });
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    padding: 10,
    paddingLeft: 15,
    paddingTop: 10,
    paddingBottom: 20,
    backgroundColor: '#fff',
  },
  button_reviews: {
    padding: 15,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 8,
    marginTop: 10,
    width: '100%',
  },
  deleteBtn: {
    height: 50,
    width: 50,
    borderRadius: 25,
    elevation: 10,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginTop: -20,
  },
});

export default NewReview;
