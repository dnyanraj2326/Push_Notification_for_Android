import { StyleSheet, Text, View,TouchableOpacity } from 'react-native'
import React from 'react'

const Home = ({navigation}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={{padding:10,backgroundColor:"#000",margin:30}} onPress={() => navigation.navigate("setting")}>
        <Text style={{color:"#fff",textAlign:'center'}}>Go to Setting</Text>
      </TouchableOpacity>
    </View>
  )
}

export default Home

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:"center"
    }
})