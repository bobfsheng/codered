import React from 'react'
import { Text, View, StyleSheet, ActivityIndicator } from 'react-native'
import { widthPercentageToDP, heightPercentageToDP, textStyles, colors } from '@utils'
import { Icon } from '@components'

const LoadingPurchaseModal = ({}) => {
  return (
    <View
      style={{
        position: 'absolute',
        width: widthPercentageToDP('100'),
        height: heightPercentageToDP('100'),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.85)',
      }}>
      <ActivityIndicator
        size="small"
        color={colors.primary}
        style={{ marginBottom: heightPercentageToDP(25) }}
      />
      <Text style={styles.errorText}>
        It will take a couple minutes to transfer the funds to your account! 🏆
      </Text>
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

export { LoadingPurchaseModal }
