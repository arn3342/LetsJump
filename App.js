import 'react-native-gesture-handler';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import LoginView from './components/Login/login-view-component';
import RegistrationView from './components/Registration/registration-view-component';
import MainView from './components/Main/main-view-component';
import OfferView from './components/offers/offers-view-component';
import HotelDataSingleView from './components/hotels/hotel-data-single-view';
import ReviewContainer from './components/reviews/review-container';
import { createDrawerNavigator } from '@react-navigation/drawer';
import ApplyBusinessView from './components/applyBusiness/apply-business-view';
import ProfileView from './components/profile/profile-view-component';
import NewReview from './components/reviews/new-review-component';

const Stack = createStackNavigator();
const config = {
  animation: 'spring',
  config: {
    stiffness: 1000,
    damping: 500,
    mass: 3,
    overshootClamping: true,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 0.01,
  },
};



const App = () => {
  return (
    <NavigationContainer>
      
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen
          options={{
            transitionSpec: {
              open: config,
              close: config,
            },
          }}
          name="Login"
          component={LoginView}
        />
        <Stack.Screen name="Registration" component={RegistrationView} />
        <Stack.Screen name="Main" component={MainView}>
        </Stack.Screen>
        <Stack.Screen name="Offers" component={OfferView}/>
        <Stack.Screen name="HotelDataSingle" component={HotelDataSingleView}/>
        <Stack.Screen name="HotelReviewSingle" component={ReviewContainer}/>
        <Stack.Screen name="ApplyBusiness" component={ApplyBusinessView}/>
        <Stack.Screen name="Profile" component={ProfileView}/>
        <Stack.Screen name="NewReview" component={NewReview}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
