import React from 'react'
import { Text, View, StyleSheet, Pressable } from 'react-native'
import { widthPercentageToDP, heightPercentageToDP, textStyles } from '@utils'
import { Icon } from '@components'

const CustomAdsSubscriptionModal = ({ setModalOpen }) => {
  return (
    <Pressable onPress={() => setModalOpen(false)}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Icon
            type="Ionicons"
            name={'close'}
            size={styles.closeIcon.fontSize}
            color={styles.closeIcon.color}
            onPress={() => setModalOpen(false)}
            style={styles.closeIcon}
          />
          <Text style={styles.loadingText}>
            🏆 Congratulations! We are unlocking your exclusive ad-free account. Ads will
            disappear in a couple of minutes. 🔥
          </Text>
        </View>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  modalContainer: {
    position: 'absolute',
    width: widthPercentageToDP('100'),
    height: heightPercentageToDP('70'),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.65)',
  },
  modalContent: {
    borderRadius: widthPercentageToDP('2'),
    width: widthPercentageToDP('80'),
    backgroundColor: 'white',
  },
  closeIcon: {
    marginTop: heightPercentageToDP(1),
    paddingRight: widthPercentageToDP(2),
    alignSelf: 'flex-end',
  },
  loadingText: [
    textStyles.normalRegular,
    {
      color: 'black',
      textAlign: 'center',
      paddingHorizontal: widthPercentageToDP(10),
      paddingTop: widthPercentageToDP(3),
      paddingBottom: widthPercentageToDP(7),
      alignContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
      justifyContent: 'center',
    },
  ],
})

export { CustomAdsSubscriptionModal }
