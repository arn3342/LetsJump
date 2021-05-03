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

const SearchItem = (props) => {
  if (typeof props.data != 'undefined') {
    return (
      <TouchableOpacity
        onPress={() => props.onPress()}
        style={[
          props.style,
          {
            paddingTop: 7,
            paddingBottom: 7,
            paddingLeft: 15,
            paddingRight: 15,
            borderWidth: 2,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 30,
            marginRight: 5,
            marginTop: 15,
            flexDirection: 'row',
            flex: 0,
          },
        ]}>
        {props.data.icon && (
          <Image
            source={props.data.icon}
            style={{
              height: 20,
              width: 20,
              marginRight: 10,
            }}
          />
        )}
        <Text style={{fontSize: 15}}>{props.data.title}</Text>
      </TouchableOpacity>
    );
  }
};
const DummySearchItems = [
  {
    title: 'Burger',
    icon: require('../../assets/burger_icon.png'),
  },
  {
    title: 'Pizza',
    icon: require('../../assets/pizza_icon.png'),
  },
  {
    title: 'Coffee',
    icon: require('../../assets/coffee_icon.png'),
  },
  {
    title: 'Meal',
    icon: require('../../assets/meal_icon.png'),
  },
  {
    title: 'Meal',
    icon: require('../../assets/meal_icon.png'),
  },
];
class QuickSearchBox extends Component {
  constructor(props) {
    super(props);

    this.state = {
      quickSearch: {
        currentIndex: '',
      },
    };
  }

  performQuickSearch = (index) => {
    this.setState((prevState) => ({
      quickSearch: {
        ...prevState.quickSearch,
        currentIndex:
          this.state.quickSearch.currentIndex !== index ? index : '',
      },
    }));
  };

  render() {
    return (
      <View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={[styles.flexBox]}>
            {DummySearchItems.map((item, index) => {
              return (
                <SearchItem
                  onPress={() => this.performQuickSearch(index)}
                  key={index}
                  data={item}
                  index={index}
                  style={{
                    borderColor:
                      this.state.quickSearch.currentIndex === index
                        ? '#0390fc'
                        : '#dbdbdb',
                    borderWidth:
                      this.state.quickSearch.currentIndex === index
                        ? 4
                        : 2,
                  }}
                />
              );
            })}
          </View>
          {this.state.quickSearch.currentIndex !== '' && (
            <Text
              style={{
                marginTop: 10,
              }}>
              Tap again to clear search
            </Text>
          )}
        </ScrollView>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  flexBox: {
    flexDirection: 'row',
    flex: 0
  },

});
export default QuickSearchBox;
