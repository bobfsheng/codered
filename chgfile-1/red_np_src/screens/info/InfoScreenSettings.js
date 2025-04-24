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

const InfoScreenSettings = ({ route }) => {
  const { selectedScreen } = route?.params || {}
  const initialState = {
    title: '',
    info: '',
    pic: '',
  }
  const [selectedInfo, setSelectedInfo] = useState(initialState)

  useLayoutEffect(() => {
    const findSelectedInfo = infoText?.find(info => info.title === selectedScreen)
    setSelectedInfo(findSelectedInfo || initialState)
  }, [selectedScreen])

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
            },
          ]}>
          {selectedInfo?.info || 'No information found.'}
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
    width: widthPercentageToDP(70),
    height: heightPercentageToDP(50),
    alignSelf: 'center',
    marginTop: heightPercentageToDP(10),
  },
})

export { InfoScreenSettings }
