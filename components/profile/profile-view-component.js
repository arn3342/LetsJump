import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import ReviewSignleView from '../reviews/review-single-view';
import ProfileReviewSignleView from './profile-review-single-view';
import {GetReviews} from '../../api/User/api';
import Icon from 'react-native-vector-icons/Ionicons';

class ProfileView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showWriteComment: false,
      starSize: 30,
      userReview: {
        rating: 0,
        reviewText: '',
        reviewImgs: [],
      },
      reviews: [],
      isReviewLoading: true,
      user: this.props.route.params,
      //   ? this.props.route.params.hotelData
      //   : this.props.route.params,
    };
  }
  async componentDidMount() {
    console.log('Profile is:', this.state.user);
    let params = {
      accessToken: this.state.user.accessToken,
    };
    console.log('Calling DidMount');
    let response = await GetReviews(params);
    console.log('GetReview response is:', response);
    if (response.success || response.data.length > 0) {
      response.data.splice(0, 0, this.state.user)
      // console.log('Review response with userProfile is:', userProfileArray)
      this.setState({
        reviews: response.data,
      });
    }
    console.log('Reviews are:', response.data);
    this.setState({isReviewLoading: false});
    // this.props.navigation.addListener('focus', async () => {
    //   // The screen is focused
    //   let newReview = this.props.route.params.NewUserReview;
    //   if (newReview) {
    //     let newReviewList = [newReview].concat(this.state.reviews);
    //     this.setState({reviews: newReviewList});
    //   }
    // });
    console.log(this.state.isReviewLoading);
  }
  render() {
    return (
      <View
        style={{
          height: '100%',
          width: '100%',
          alignItems: 'center',
          backgroundColor: 'white',
        }}>
        {this.state.isReviewLoading ? (<ActivityIndicator style={{alignSelf: 'center', marginTop: 30}} size="large" color="#0074ff" />)
        : 
        (<Container
          navigation={this.props.navigation}
          data={this.state.reviews}
          user={this.state.user}
        />)}
      </View>
    );
  }
}

const UserProfile = (props) => {
  const profile = props.profile;
  return (
    <View
      style={{
        width: '100%',
        height: 'auto',
        backgroundColor: '#fff',
        paddingBottom: 0,
        marginTop: 10,
      }}>
      <View
        style={{
          width: '100%',
          alignItems: 'center',
          flexDirection: 'row',
          padding: 15,
        }}>
        <Image
          style={{
            height: 70,
            width: 70,
            borderRadius: 35,
            borderWidth: 2,
            borderColor: '#fff',
          }}
          source={{uri: profile.imageUrl}}
        />
        <View>
          <Text
            style={{
              fontSize: 23,

              marginLeft: 10,
              color: '#000',
            }}>
            {profile.firstName}
          </Text>
          <Text
            style={{
              fontSize: 16,
              marginLeft: 10,
              color: '#000',
            }}>
            Lives near khilgaon
          </Text>
        </View>
        {/* <View style={styles.border_horizontal} /> */}
      </View>
      <View
        style={{
          flexDirection: 'row',
          marginTop: 5,
          width: '90%',
          alignSelf: 'center',
          backgroundColor: '#fff',
          shadowColor: '#000',
          shadowOffset: {width: 0, height: 2},
          shadowOpacity: 0.5,
          shadowRadius: 2,
          elevation: 15,
          borderRadius: 5,
        }}>
        <View
          style={{
            borderRadius: 5,
            width: '50%',
            backgroundColor: '#1f9aff',
            paddingBottom: 25,
            padding: 15,
            paddingTop: 25,
          }}>
          <Icon name="trophy-outline" color="#fff" size={20} />
          <Text style={{fontSize: 34, fontWeight: 'bold', color: '#fff'}}>
            {profile.points}
          </Text>
          <Text style={{fontSize: 18, color: '#fff', fontWeight: 'bold'}}>
            points earned
          </Text>
        </View>
        <View
          style={{
            borderRadius: 5,
            width: '50%',
            padding: 15,
          }}>
          <Text style={styles.overviewText_title}>{props.reviews.length}</Text>
          <Text style={styles.overviewText}>reviews</Text>
          <Text style={styles.overviewText_title}>{props.reviews.length}</Text>
          <Text style={styles.overviewText}>check-ins</Text>
        </View>
      </View>

      <Text
        style={{
          width: '100%',
          padding: 10,
          textAlign: 'center',
          fontSize: 24,
          color: '#70d4ff',
        }}>
        • • •
      </Text>
    </View>
  );
};

const Container = (props) => {
  // console.log('Data passed to container:', props);
  const renderItem = ({item, index}) => {
    // console.log('Data passed as Item:', item);
    const profileRendered = false;
    console.log('Item is:', item)
    if (item){
      console.log('New index is:', index)
      if(index === 0){
        return <UserProfile profile={props.user} reviews={props.data}/>
      }
      else { 
        
        return <ReviewSignleView navigation={props.navigation} data={item} />;}
    }
  };
  return (
    <View style={[styles.container, props.style]}>
      <FlatList
        style={{paddingBottom: 25}}
        data={props.data}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  profileBtn: {
    padding: 5,
    paddingRight: 8,
    paddingLeft: 8,
    borderColor: '#098ee0',
    borderWidth: 2,
    borderRadius: 5,
    marginRight: 10,
  },
  overviewText: {
    fontSize: 18,
    color: '#1f9aff',
    fontWeight: 'bold',
  },
  overviewText_title: {
    fontSize: 24,
    color: '#1f9aff',
    fontWeight: 'bold',
  },
  container: {
    paddingTop: 5,
    flex: 1,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 10,
  },
  border_horizontal: {
    width: '90%',
    alignSelf: 'center',
    height: 1,
    backgroundColor: '#d1d1d1',
    marginTop: 20,
  },
  border_vertical: {
    width: 1,
    alignSelf: 'center',
    height: '90%',
    backgroundColor: '#d1d1d1',
  },
});

export default ProfileView;
