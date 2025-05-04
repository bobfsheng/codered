import React, { useState } from 'react'
import { View, Text, SafeAreaView, StyleSheet, Pressable,TouchableWithoutFeedback, 
  Keyboard } from 'react-native'
import { DotIndicator } from 'react-native-indicators'
import { CustomInputLabel } from '@components'
import { useUserSelector } from '@store'
import { userActions, useReduxDispatch } from '@store'
import AnimatedLinearGradient from 'react-native-animated-linear-gradient'
import {
  actuatedNormalize,
  colors,
  heightPercentageToDP,
  textStyles,
  widthPercentageToDP,
} from '@utils'
import { EasyCryptoInvestScreen } from './EasyCryptoInvestScreen'
const InvestCryptoTab = ({ route }) => {
  const stockTicker = route?.params?.stockTicker
  const { buying_power, cash } = useUserSelector(state => state)
  const [orderSide, setOrderSide] = useState('buy')
  const handleChangeTabs = condition => {
    setorderSide(condition)
  }
  const dispatch = useReduxDispatch()
  // useEffect(() => {
  //   setorderSide(!route?.params?.easy)
  // }, [route?.params?.easy])
  return (
    <Pressable style={styles.safeAreaContainer} onPress={Keyboard.dismiss} accessible={false}>
       <AnimatedLinearGradient customColors={styles.redvestColors} speed={1000}>

    <SafeAreaView style={styles.safeAreaContainer}>

      <View style={styles.topBarContainer}>
        <View style={styles.topBarRow}>
          <Pressable
            style={{ flex: 3 }}
            onPress={() =>
              dispatch(userActions.setInformation({ infoId: 8 }))
            }>
            <CustomInputLabel text="Buying Power" big info />
          </Pressable>
          <View style={{ flex: 2, alignItems: 'flex-end' }}>
            {buying_power == 0 ? (
              <DotIndicator color="white" size={actuatedNormalize(3)} />
            ) : (
              <Text style={[styles.topBarRowText, { fontSize: parseFloat(buying_power)?.toFixed(0).length > 7 ? actuatedNormalize(12) : actuatedNormalize(16)}]}>   ${' '} 
                {isNaN(buying_power)
                  ? ' '
                  : parseFloat(buying_power)
                      ?.toFixed(0)
                      ?.toString()
                      ?.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              </Text>
            )}
          </View>
        </View>
        <View style={styles.topBarRow}>
          <Pressable
            style={{ flex: 3 }}
            onPress={() =>
              dispatch(userActions.setInformation({ infoId: 9 }))
            }>
            <CustomInputLabel text="Cash Available" info />
          </Pressable>
          <View style={{ flex: 2, alignItems: 'flex-end' }}>
            {cash == 0 ? (
              <DotIndicator color="white" size={actuatedNormalize(3)} />
            ) : (
              <Text style={[styles.topBarRowText, { fontSize: parseFloat(cash)?.toFixed(0).length > 9 ? actuatedNormalize(12) : actuatedNormalize(15)}]}>
                ${' '}
                {isNaN(cash)
                  ? ' '
                  : parseFloat(cash)
                      ?.toFixed(0)
                      ?.toString()
                      ?.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              </Text>
            )}
          </View>
        </View>
      </View>
      <View style={styles.tabsMainContainer}>
      <Pressable
          onPress={() => {
            setOrderSide('buy')
          }}>
          <View
            style={[
              styles.tabContainer,
              { backgroundColor: orderSide == 'buy' ? colors.white : 'transparent' },
            ]}>
            <Text
              style={[
                styles.tabText,
                { color: orderSide == 'buy' ? colors.offBlack : colors.mediumGrey },
              ]}>
              BUY
            </Text>
          </View>
        </Pressable>
        <Pressable
          onPress={() => {
            setOrderSide('sell')
          }}>
          <View
            style={[
              styles.tabContainer,
              { backgroundColor: orderSide == 'sell' ? colors.white : 'transparent' },
            ]}>
            <Text
              style={[
                styles.tabText,
                { color: orderSide == 'sell' ? colors.offBlack : colors.mediumGrey },
              ]}>
             SELL
            </Text>
          </View>
        </Pressable>
      </View>
      <View style={{ flex: 1 }}>
       
          <EasyCryptoInvestScreen stockTicker={stockTicker} />
       
      </View>
      {/* </Pressable> */}
    </SafeAreaView>
    </AnimatedLinearGradient>
      </Pressable>

  )
}
const styles = StyleSheet.create({
  safeAreaContainer: { flex: 1, 
    // position:'absolute',
    height:heightPercentageToDP(100)

    // backgroundColor: 'black' 
  },
  topBarContainer: {
    marginTop: widthPercentageToDP(4),
    backgroundColor: '#212121',
    height: heightPercentageToDP(10),
    width: widthPercentageToDP(90),
    borderRadius: heightPercentageToDP(1),
    justifyContent: 'center',
    alignSelf: 'center',
  },
  topBarRow: {
    flexDirection: 'row',
    marginHorizontal: widthPercentageToDP(5),
    marginVertical: 5,
  },
  topBarRowText: [
    textStyles.bigRegular,
    {
      color: 'white',
     
    },
  ],
  tabsMainContainer: {
    marginHorizontal: heightPercentageToDP(1),
    marginVertical: heightPercentageToDP(3),
    flexDirection: 'row',
  },
  tabContainer: {
    paddingVertical: widthPercentageToDP(3),
    borderRadius: widthPercentageToDP(12),
    minWidth: widthPercentageToDP(24),
    alignItems: 'center',
    marginHorizontal: heightPercentageToDP(1),
  },
  redvestColors: [
    //  '#B3D59F',
     '#80A471',
     '#AFC07E',
     '#79A471',
     '#7198A4',
     '#2383C8',
     '#644B99',
    ],
  tabText: [
    textStyles.smallBold,
    {
      color: 'black',
    },
  ],
})
export { InvestCryptoTab }
