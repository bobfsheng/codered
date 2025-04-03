import { heightPercentageToDP, widthPercentageToDP } from '@utils'
import React from 'react'
import { Animated, TouchableWithoutFeedback, View, StyleSheet } from 'react-native'
import Modal from 'react-native-modal'

const BottomSheetModal = ({
  isVisible,
  children,
  handleCloseModal,
  mainContainerStyle,
  subContainerStyle,
  overlayStyle,
  ...props
}) => {
  return (
    <Modal
      isVisible={isVisible}
      {...props}
      animationIn="slideInRight"
      animationOut="slideOutRight">
      <View style={[styles.mainContainer, mainContainerStyle]}>
        <TouchableWithoutFeedback onPress={handleCloseModal}>
          <Animated.View style={[styles.modalOverlay, overlayStyle, { opacity: 1 }]} />
        </TouchableWithoutFeedback>
        <View style={[styles.subContainer, subContainerStyle]}>{children}</View>
      </View>
    </Modal>
  )
}

export { BottomSheetModal }

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subContainer: {
    borderRadius: 5,
    width: widthPercentageToDP(100),
    height: heightPercentageToDP(100),
    backgroundColor: 'black',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
})
