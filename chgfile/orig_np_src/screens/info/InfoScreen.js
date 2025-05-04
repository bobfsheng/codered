import React, { useLayoutEffect, useState } from 'react'
import { View, Dimensions, StyleSheet, Text, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import {
  actuatedNormalize,
  colors,
  heightPercentageToDP,
  textStyles,
  widthPercentageToDP,
} from '@utils'
import { infoText } from '@constants/infoText'

const InfoScreen = ({ navigation, route }) => {
  const { screenS } = route?.params || {}
  const initialState = {
    title: '',
    info: '',
    pic: '',
  }
  const [selectedInfo, setSelectedInfo] = useState(initialState)

  useLayoutEffect(() => {
    const findSelectedInfo = infoText?.find(info => info.title === screenS)
    setSelectedInfo(findSelectedInfo || initialState)
  }, [screenS])

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <View>
        <Text
          style={[
            styles.screenTitle,
            textStyles.bigRegular,
            {
              fontSize: actuatedNormalize(14),
              color: 'white',
              marginBottom: heightPercentageToDP(10),
            },
          ]}>
          {selectedInfo?.info}
        </Text>
      </View>
      <View>
        <Image source={selectedInfo?.pic} style={styles.imageBelow} />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.darkBackground,
    minHeight: Math.round(Dimensions.get('window').height / 2),
    paddingHorizontal: widthPercentageToDP(5),
  },
  imageBelow: {
    resizeMode: 'contain',
    marginTop: heightPercentageToDP(10),
    width: widthPercentageToDP(80),
    height: heightPercentageToDP(60),
    alignSelf: 'center',
  },
})

export { InfoScreen }