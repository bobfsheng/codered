import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { heightPercentageToDP, textStyles, widthPercentageToDP } from '@utils'
import { Icon } from '@components'
import { CustomModal } from '@components'

const GiftModal = ({ visible, handleCloseModal }) => {
  const handleModalClose = () => {
    handleCloseModal()
  }

  return (
    <CustomModal
      visible={visible}
      handleCloseModal={handleModalClose}
      mainContainerStyle={styles.mainContainer}
      subContainerStyle={styles.subContainer}
      overlayStyle={styles.overlay}
      animation="fade"
      transparent={true}>
      <View style={styles.closeIcon}>
        <Icon
          type="AntDesign"
          name="close"
          size={widthPercentageToDP(4)}
          color="black"
          onPress={handleModalClose}
          style={{ padding: heightPercentageToDP(1) }}
        />
      </View>
      <View style={styles.contentContainer}>
        <Text style={[textStyles.regularSemiBold, styles.text]}>
          You already watched the rewarded video or there was an error loading. Please try
          again later. 😊
        </Text>
      </View>
    </CustomModal>
  )
}

const styles = StyleSheet.create({
  mainContainer: {},
  subContainer: {},
  overlay: {},
  closeIcon: {
    alignSelf: 'flex-end',
  },
  contentContainer: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingBottom: heightPercentageToDP(5),
    paddingTop: heightPercentageToDP(3),
    paddingHorizontal: widthPercentageToDP(5),
  },
  text: {
    textAlign: 'center',
    color: 'black',
  },
})

export { GiftModal }
