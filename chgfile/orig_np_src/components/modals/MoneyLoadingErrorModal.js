import React from 'react'
import { Text, View, StyleSheet } from 'react-native'
import { widthPercentageToDP, heightPercentageToDP, textStyles } from '@utils'
import { Icon } from '@components'
import { NavigationService } from '@navigation'

const MoneyLoadingErrorModal = ({}) => {
  return (
    <View
      style={{
        position: 'absolute',
        width: widthPercentageToDP('100'),
        height: heightPercentageToDP('100'),
        alignItems: 'center',
        justifyContent: 'center',
        alignContent: 'center',
        alignSelf: 'center',
        backgroundColor: 'rgba(0,0,0,0.7)',
      }}>
      <View
        style={{
          backgroundColor: 'white',
          marginBottom: heightPercentageToDP(30),
          width: widthPercentageToDP(80),
          paddingVertical: heightPercentageToDP(2),
          borderRadius: widthPercentageToDP(3),
        }}>
        <Icon
          type="Ionicons"
          name={'close'}
          size={widthPercentageToDP(5)}
          color="black"
          onPress={() => NavigationService.navigate('Profile')}
          style={{
            marginBottom: heightPercentageToDP(2),
            paddingHorizontal: widthPercentageToDP(4),
            alignSelf: 'flex-end',
          }}
        />
        <Text style={[styles.errorText, { color: 'black' }]}>
          We are very sorry. There was an error, any payment amount from will be reversed.
          Please try again later...
        </Text>
      </View>
    </View>
  )
}
const styles = StyleSheet.create({
  errorText: [
    textStyles.bigRegular,
    {
      color: 'white',
      alignContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      marginHorizontal: widthPercentageToDP(5),
    },
  ],
})
export { MoneyLoadingErrorModal }
