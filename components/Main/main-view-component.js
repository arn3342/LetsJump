import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  StatusBar,
  Button,
  Text,
  Animated,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import SearchTabButton from '../Search/search-component-view';
import ProfileWidget from '../profile/profile-widget-view';
import HotelContainer from '../hotels/hotel-container';
import QuickSearchBox from '../Search/quick-search-component-view';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {NavigationContainer} from '@react-navigation/native';
import { GetHotels, GetProfile } from '../../api/User/api';
const AnimatedText = Animated.createAnimatedComponent(Text);

//#region Different components
const SearchBox = (props) => {
  return (
    <View style={[styles.input, styles.flexbox]}>
      <TextInput
        style={{width: '80%'}}
        autoFocus={true}
        returnKeyType="search"
        placeholder="Search joss places"
        onSubmitEditing={(event) => props.filterSearch(event.nativeEvent.text)}
      />
      <TouchableOpacity
        style={{justifyContent: 'center', height: '100%', position: 'absolute', right: 0, paddingLeft: 10, paddingRight: 10, backgroundColor: '#038dff'}}
        onPress={() => props.CancelSearch()}>
        <Icon
          name="close"
          color="#fff"
          size={26}
          style={{alignSelf: 'center'}}
        />
      </TouchableOpacity>
    </View>
  );
};
//#endregion

const AddBusinessButton = (props) => {
  return(
    <TouchableOpacity style={{backgroundColor: '#0074ff', justifyContent: 'center', marginTop: 10, borderRadius: 8}} onPress={() => props.navigation.navigate('ApplyBusiness')}>
      <Text style={{alignSelf: 'center', fontSize: 17, color: '#fff', padding: 12, fontWeight: 'bold'}}>Have a business? List it now!</Text>
    </TouchableOpacity>
  )
}

const Drawer = createDrawerNavigator();

class MainView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listHeight: 0,
      welcomeSize: new Animated.Value(0),
      searchVisible: false,
      accessToken: this.props.route.params.data.accessToken ? this.props.route.params.data.accessToken : '',
      user: {
        profile: undefined
      },
      hotelList: [],
      filterHotelList: undefined,
      isLoading: true
    };
  }

  async componentDidMount(){
    let profileResponse = await GetProfile({accessToken: this.state.accessToken});
    if (profileResponse.success){
      console.log('Profile retrieved after login: ', profileResponse.data)
      this.setState(prevState => ({
        user: {
          ...prevState.user,
          profile: profileResponse.data
        }
      }))
    }
    else{
      console.log('Profile retrieved failed after login: ', profileResponse.data)
    }

    let hotelListResponse = await GetHotels({})
    if(hotelListResponse.success){
      this.setState({
        hotelList: hotelListResponse.data,
        isLoading: false
      })
    }
    else{
      console.log('Hotel list retrieved failed. Error: ', hotelListResponse.data)
    }
  }
  //#region Navigation views

  filterSearch = async(query) => {
    this.setState({ isLoading: true })
    let hotelListResponse = await GetHotels({ searchtags: query })
    if(hotelListResponse.success){
      this.setState({
        filterHotelList: hotelListResponse.data,
        isLoading: false
      })
    }
    else{
      console.log('Hotel list filter retrieved failed. Error: ', hotelListResponse.data)
    }
  }
  clearSearch(){
    this.setState({ filterHotelList: undefined })
  }
  showSearch = (show = true) => {
    this.setState({
      searchVisible: show,
    });
    show === false && this.clearSearch();
  };
  //#endregion
  render() {
    this.state.accessToken && console.log('Data passed from Login: ', this.state.accessToken)
    this.state.user.profile && console.log('Data passed from Registration: ', this.props.route.params.data)
    return (
      <View style={styles.container_main}>
        {!this.state.searchVisible && (<ProfileWidget profile={this.state.user.profile} navigation={this.props.navigation} />)}
        {this.state.searchVisible ? (
          <View>
            <SearchBox filterSearch={(query) => this.filterSearch(query)} CancelSearch={() => this.showSearch(false)} />
            <AddBusinessButton navigation={this.props.navigation}/>
            <QuickSearchBox />
          </View>
        ) : (<Text style={styles.text_welcome}>
          Check out joss places!
        </Text>

        )}
        {/* Start: Hotel list area*/}
        {!this.state.isLoading ? (<HotelContainer
          accessToken={this.state.accessToken}
          navigation={this.props.navigation}
          hotelList={this.state.filterHotelList ? this.state.filterHotelList : this.state.hotelList}
          style={{marginTop: 0}}
          onListScroll={this.onListScroll}
        />) : 
        (<ActivityIndicator style={{marginTop: 10}} size="large" color="blue"/>)}
        
        {/* End: Hotel list area*/}
        {!this.state.searchVisible && (
          <SearchTabButton showSearch={() => this.showSearch()} />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container_main: {
    backgroundColor: '#fff',
    padding: 15,
    paddingTop: 0,
    paddingBottom: 0,
    flex: 1,
  },
  text_welcome: {
    marginTop: 15,
    fontFamily: 'Foundation',
    paddingLeft: 5,
    color: '#0d324d',
    fontSize: 18,
    lineHeight: 22,
  },
  input: {
    backgroundColor: '#f2f2f2',
    height: 45,
    borderRadius: 8,
    paddingLeft: 12,
    fontSize: 17,
    marginTop: 15,
    
  },
  flexbox: {
    flexDirection: 'row',
  },
});
//#endregion
export default MainView;