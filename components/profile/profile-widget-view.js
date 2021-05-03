import React from 'react';
import {StyleSheet, View, Text, Image, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const default_profile_image = require('../../assets/man_face.png');

const ProfileWidget = (props) => {
  console.log('Profile Widget: Profile passed from Main is:', props.profile)
  let profile = props.profile;
  return (
    <View>
      <View onLayout={props.onLayout} style={styles.container}>
        <TouchableOpacity style={{width: '88%'}} onPress={() => props.navigation.navigate('Profile', profile)}>
          <View style={styles.container_profile}>
            <Image
              style={styles.profile_image}
              source={profile !== undefined ? {uri: profile.imageUrl} : default_profile_image }
            />
            <View style={styles.container_name}>
              <Text style={styles.name}>{profile !== undefined && profile.firstName + ' ' + profile.lastName}</Text>
              <View
                style={[
                  styles.container,
                  {padding: 0, paddingTop: 5, borderBottomWidth: 0},
                ]}>
                <Image
                  style={styles.rewardIcon}
                  source={require('../../assets/reward_icon.png')}
                />
                <Text
                  style={{
                    fontWeight: 'bold',
                    color: '#38a9ff',
                    paddingLeft: 5,
                    paddingBottom: 5,
                  }}>
                  {profile !== undefined && profile.points}
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button_gift}
          onPress={() => props.navigation.navigate('Offers')}>
          <Icon name="gift-outline" color="#fff" size={30} />
        </TouchableOpacity>
      </View>
      <View
        style={{
          height: 2,
          backgroundColor: '#efefef',
          width: '100%',
          marginTop: 10,
          alignSelf: 'center',
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 0,
    flexDirection: 'row',
    paddingTop: 25,
  },
  container_profile: {
    flex: 0,
    flexDirection: 'row',
    width: '88%',
  },
  container_name: {
    paddingTop: 0,
    paddingLeft: 15,
  },
  profile_image: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  name: {
    fontSize: 18,
    fontWeight: '300',
  },
  rewardIcon: {
    height: 20,
    width: 15,
  },
  button_gift: {
    alignSelf: 'center',
    padding: 8,
    backgroundColor: '#17a6ff',
    borderRadius: 50
  },
});
export default ProfileWidget;
