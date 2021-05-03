import React from 'react';
import {StyleSheet, View, Text, Image, FlatList, StatusBar, SafeAreaView} from 'react-native';
import HotelSingleView from './hotel-single-view';

const HotelContainer = (props) => {
  console.log('Data passed to Hotelcontainer is:', props.accessToken)
  const renderItem = ({item}) => {
  item.accessToken = props.accessToken;
  return(
  <HotelSingleView data={item} onPress={(hotelData) => showHotelReview(props, hotelData)}/>)};
  return (
    <View style={[styles.container, props.style]}>
      <FlatList
        // onScroll={(event) => props.onListScroll(event)}
        style={{paddingBottom: 25}}
        data={props.hotelList}
        renderItem={renderItem}
        keyExtractor={(item) => String(item.organizationID)}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};
function showHotelReview(props, hotelData){
  // console.log('Hotel Clicked', value);
  const navigation = props.navigation;
  props.navigation.navigate('HotelDataSingle', hotelData);
}
const styles = StyleSheet.create({
  container: {
    paddingTop: 15,
    flex: 1,
  },
})
export default HotelContainer;