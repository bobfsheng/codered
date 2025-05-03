import React from 'react'
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native'
import {
  widthPercentageToDP,
  heightPercentageToDP,
  textStyles,
  actuatedNormalize,
} from '@utils'
import { Icon } from '@components'
import { NavigationService } from '@navigation'

const MoneyLoadedModal = ({ valueToAdd }) => {
  return (
    <View style={styles.loadingContainer}>
      <View
        style={{
          backgroundColor: 'white',
          width: widthPercentageToDP(80),
          // height: heightPercentageToDP(48),
          paddingVertical: heightPercentageToDP(2),
          alignSelf: 'center',
          marginTop: heightPercentageToDP(10),
          borderRadius: 5,
        }}>
        <Icon
          type="Ionicons"
          name={'close'}
          size={widthPercentageToDP(5)}
          color="black"
          onPress={() => NavigationService.navigate('Profile')}
          style={{
            marginBottom: heightPercentageToDP(2),
            paddingRight: widthPercentageToDP(5),
            alignSelf: 'flex-end',
          }}
        />
        {/* <Image source={loadingSuccess} style={styles.loadingSuccessImage} /> */}
        <Text style={styles.successText}>
          Congratulations!{' '}
          <Text style={[styles.explanationTextBold, { color: 'black' }]}>
            $ {valueToAdd}
          </Text>{' '}
          is on your way to your account! This may take a up to a few minutes. Have fun
          investing 🔥
        </Text>
        <TouchableOpacity
          style={styles.containerSuccess}
          onPress={() =>
            NavigationService.navigate(
              'Invest',
              {
                screen: 'InvestTab',
              },
              // (setMoneyLoaded(false))
            )
          }>
          <Text
            style={[
              textStyles.bigBold,
              { color: 'white', fontSize: actuatedNormalize(13) },
            ]}>
            Invest
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}
const styles = StyleSheet.create({
  successText: [
    textStyles.normalRegular,
    {
      color: 'black',
      marginHorizontal: widthPercentageToDP(3),
      fontSize: actuatedNormalize(11.5),
      alignSelf: 'center',
      textAlign: 'center',
    },
  ],

  loadingContainer: {
    height: heightPercentageToDP(100),
    width: '100%',
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.82)',
  },

  containerSuccess: {
    backgroundColor: 'black',
    width: widthPercentageToDP(60),
    height: heightPercentageToDP(5),
    marginTop: heightPercentageToDP(2),
    alignSelf: 'center',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
  },
  loadingText: [
    textStyles.normalRegular,
    {
      color: 'white',
      alignContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
      justifyContent: 'center',
    },
  ],
  errorText: [
    textStyles.bigRegular,
    {
      color: 'white',
      // marginTop: heightPercentageToDP(10),
      // position: 'absolute',
      alignContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      marginHorizontal: widthPercentageToDP(5),
    },
  ],
  moneyContainer: {
    width: widthPercentageToDP(60),
    height: heightPercentageToDP(23),
    alignContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    position: 'absolute',
    marginTop: heightPercentageToDP(20),
    borderRadius: 5,
  },
})
export { MoneyLoadedModal }
