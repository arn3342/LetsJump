import React, {Component} from 'react';
import {
  Animated,
  Easing,
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
import Icon from 'react-native-vector-icons/Ionicons';

//#region Tab Button - Search
class SearchTabButton extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isActive: false,
    };
  }

  showSearch = () => {
    this.props.navigation.navigate('Search')
    // this.animateButton();
  }
  render() {
    // const state = this.props.navigation.dangerouslyGetState();
    // let currentRoute = state.routes[state.index];

    // while (currentRoute.state) {
    //   currentRoute = currentRoute.state.routes[currentRoute.state.index];
    //   // console.log('Route is now', actualRoute.name);
    // }
    return (
      <TouchableOpacity
        style={styles.floating_button}
        onPress={() => this.props.showSearch()}>
        <View
          style={[
            styles.roundButton,
            {
              backgroundColor: 'white',
            },
          ]}>
          <Icon
            name="search"
            color='#0390fc'
            size={30}
            style={{alignSelf: 'center'}}
          />
        </View>
      </TouchableOpacity>
    );
  }
}
const styles = StyleSheet.create({
  floating_button:{
    position: 'absolute',
    bottom: 20,
    right: 10,
    alignSelf: 'center'
  },
  roundButton: {
    height: 70,
    width: 70,
    borderRadius: 35,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 10,
    borderColor: '#0390fc',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default SearchTabButton;
