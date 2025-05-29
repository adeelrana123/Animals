import {StyleSheet, Text, TouchableOpacity, View, useWindowDimensions} from 'react-native';
import React, { useContext, useMemo } from 'react';
import { AppDataContext } from '../context/AppDataContext';
import { useNavigation } from '@react-navigation/native';
import Entypo from 'react-native-vector-icons/Entypo';
interface headerProps {
  title: string
}

export const Header = (props : headerProps) => {
 const navigation= useNavigation()
  const {appTheme}=useContext(AppDataContext);
  const {title} = props;
  const {width: deviceWidth, height: deviceHeight} = useWindowDimensions();
  const styles = useMemo(()=>{
    return StyleSheet.create({
      container: {
        width: '100%',
        // justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: appTheme.Primary,
        elevation: 10,
        flexDirection:"row",
        paddingLeft:20,
        justifyContent:"space-between"
      },
      title: {
        fontSize: 22,
        color:appTheme.white,
        fontWeight: 'bold',
       
      },
    });
  },[appTheme])
  return (
    <View style={[styles.container, { height: "10%" }]}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
          <Entypo name="chevron-thin-left" size={26}  style={{marginRight:20,color:appTheme.white,}} />
        </TouchableOpacity>
      <Text style={styles.title}>
        {title}
      </Text>
      <View style={{ width: 40 }} >
        <Entypo name="chevron-thin-left" size={22} style={{color:appTheme.Primary,}}/>
        </View>
    </View>
  );
};
