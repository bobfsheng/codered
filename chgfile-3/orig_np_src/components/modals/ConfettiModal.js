import React from 'react'
import { View, StyleSheet, Pressable, Image } from 'react-native'
import ConfettiCannon from 'react-native-confetti-cannon'
import { widthPercentageToDP, heightPercentageToDP, colors, textStyles } from '@utils'
import lockedmodal from '../../assets/images/onboarding/Coin-6.gif'

const ConfettiModal = ({ modalVisible, setModalVisible }) => {
  const handleModalPress = () => {
    setModalVisible(!modalVisible)
  }

  return (
    <View style={styles.modalOverlay}>
      <ConfettiCannon
        count={80}
        explosionSpeed={400}
        origin={{ x: widthPercentageToDP(5), y: heightPercentageToDP(-50) }}
        fallSpeed={500}
        fadeOut={true}
        colors={['#78AC43', '#9ECB90', '#9EC07E', '#B2D0CE', '#C1D9BD']}
      />
      <Pressable onPress={handleModalPress}>
        <Image source={lockedmodal} style={styles.modalImage} />
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  modalOverlay: {
    height: heightPercentageToDP(100),
    width: widthPercentageToDP(100),
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalImage: {
    marginBottom: heightPercentageToDP(35),
    width: widthPercentageToDP(350),
    height: heightPercentageToDP(100),
    resizeMode: 'contain',
  },
})

export { ConfettiModal }