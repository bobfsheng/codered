import React, { useEffect, useRef } from 'react'
import { Animated, Modal, TouchableWithoutFeedback, View, StyleSheet } from 'react-native'
import { colors, widthPercentageToDP } from '@utils'
const CustomModal = ({
  visible,
  handleCloseModal,
  children,
  mainContainerStyle,
  subContainerStyle,
  overlayStyle,
  animation,
  transparent,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start()
  }, [])
  const handleClose = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 10,
      useNativeDriver: true,
    }).start(() => handleCloseModal())
  }
  return (
    <Modal
      animationType={animation} // fade, none, slide
      transparent={transparent}
      visible={visible}
      onRequestClose={handleClose}>
      <View style={[styles.mainContainer, mainContainerStyle]}>
        <TouchableWithoutFeedback onPress={handleClose}>
          <Animated.View
            style={[styles.modalOverlay, overlayStyle, { opacity: fadeAnim }]}
          />
        </TouchableWithoutFeedback>
        <View style={[styles.subContainer, subContainerStyle]}>{children}</View>
      </View>
    </Modal>
  )
}
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subContainer: {
    backgroundColor: colors.white,
    borderRadius: 5,
    // borderWidth: heightPercentageToDP(0.2),
    backgroundColor: 'white',
    // borderColor: 'gray',
    width: widthPercentageToDP(90),
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
})
export { CustomModal }
