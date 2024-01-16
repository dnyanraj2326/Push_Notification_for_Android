import {Platform, StyleSheet, Text, Linking, View,PermissionsAndroid} from 'react-native';
import React, {useEffect} from 'react';
import messaging from '@react-native-firebase/messaging';
import notifee, {AndroidImportance} from '@notifee/react-native';
import {NavigationContainer} from '@react-navigation/native';
import AppNavigations from './src/navigation/AppNavigations';
import NavigationServices from './src/navigation/NavigationServices';

const App = () => {

  useEffect(() => {
    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
    fcmToken();
    const unsubscribeForgoundNotification = messaging().onMessage(async msg => {
      onDisplayNotification(msg);
      console.log('Forground Msg', msg);
      NavigationServices.navigate('setting');
    });
    const unsubscribeBackground = messaging().setBackgroundMessageHandler(
      async msg => {
        console.log('Background Msg', msg.data);
        if (msg && msg.data) {
          setTimeout(() => {
            NavigationServices.navigate(msg?.data?.routeName);
          }, 3000);
        }
      },
    );
  }, []);

  const fcmToken = async () => {
    let token = await messaging().getToken();
    console.log("token",token)
  };

  let onDisplayNotification = async msg => {
    if (Platform.OS == 'ios') {
      await notifee.requestPermission();
    }
    const channelId = await notifee.createChannel({
      id: msg?.messageId,
      name: msg?.from,
      sound: 'defult',
      importance: AndroidImportance.HIGH,
    });

    await notifee.displayNotification({
      title: msg?.notification?.title,
      body: msg?.notification?.body,
      android: {
        channelId,
        largeIcon: msg?.notification?.android?.imageUrl,
      },
      pressAction: {
        id: 'default',
      },
    });
  };
  return (
    <View style={styles.container}>
      <NavigationContainer
        ref={ref => NavigationServices.setTopLevelNavigator(ref)}>
        <AppNavigations />
      </NavigationContainer>
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
