import {Linking, Text} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from '../screens/Home';
import Setting from '../screens/Setting';
import messaging from '@react-native-firebase/messaging';
// import { createStackNavigator } from '@react-navigation/stack';

const Stack = createNativeStackNavigator();
const NAVIGATION_IDS = ['home', 'setting'];

function buildDeepLinkFromNotificationData(data) {
  // console.log("on click data",data)
  const navigationId = data?.navigationId;
  Linking?.addEventListener('url', (({url})=> console.log("url",url)));
  if (!NAVIGATION_IDS.includes(navigationId)) {
    console.warn('Unverified navigationId', navigationId)
    return null;
  }
  if (navigationId === 'home') {
    return 'myapp://home';
  }

  if (navigationId === 'setting') {

    return 'myapp://setting';
  }

  // const chatId = data?.chatId;
  // if (navigationId === 'login') {
  //   return `myapp://login/${chatId}`
  // }
  // console.warn('Missing postId')
  return null
}


const linking = {
  prefixes: ["myapp://"],
  config: {
  initialRouteName: "setting",
  screens: {
          home: 'home',
          setting: 'setting',
  },
  },
  async getInitialURL() {
      const url = await Linking.getInitialURL();
      if (typeof url === 'string') {
        return url;
      }
      //getInitialNotification: When the application is opened from a quit state.
      const message = await messaging().getInitialNotification();
      const deeplinkURL = buildDeepLinkFromNotificationData(message?.data);
      if (typeof deeplinkURL === 'string') {
        return deeplinkURL;
      }
    },
    subscribe(listener) {
      const onReceiveURL = ({url}) => listener(url);
  
      // Listen to incoming links from deep linking
      const linkingSubscription = Linking.addEventListener('url', onReceiveURL);
  
      //onNotificationOpenedApp: When the application is running, but in the background.
      const unsubscribe = messaging().onNotificationOpenedApp(remoteMessage => {
        const url = buildDeepLinkFromNotificationData(remoteMessage.data)
        if (typeof url === 'string') {
          listener(url)
        }
      });
  
      return () => {
        linkingSubscription.remove();
        unsubscribe();
      };
    },
};

const AppNavigations = () => {
  return (
    <Stack.Navigator
      linking={linking}
      fallback={<Text style={{fontSize: 20, color: 'red'}}>Loading...</Text>}>
      <Stack.Screen name="home" component={Home} />
      <Stack.Screen name="setting" component={Setting} />
    </Stack.Navigator>
  );
};

export default AppNavigations;
