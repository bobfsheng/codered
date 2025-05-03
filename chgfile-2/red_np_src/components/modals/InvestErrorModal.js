import React from 'react'
import { Pressable, View, Text, StyleSheet } from 'react-native'
import { colors, heightPercentageToDP, textStyles, widthPercentageToDP } from '@utils'
import { CustomModal, CustomButton } from '@components'
import { NavigationService } from '@navigation'

const InvestErrorModal = ({ visible, handleCloseModal, errorMessage }) => {
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
      <Pressable onPress={handleModalClose}>
        <View style={styles.contentContainer}>
          <View style={styles.innerContentContainer}>
            <Text style={[textStyles.regularSemiBold, styles.text]}>{errorMessage}</Text>
          </View>
        </View>
      </Pressable>
    </CustomModal>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    justifyContent: 'flex-start',
  },
  subContainer: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    width: '100%',
  },
  overlay: {},
  contentContainer: {
    alignContent: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    height: heightPercentageToDP(100),
    width: widthPercentageToDP(100),
  },
  innerContentContainer: {
    alignSelf: 'center',
    alignContent: 'center',
    alignItems: 'center',
    padding: widthPercentageToDP(10),
    borderRadius: 5,
    backgroundColor: 'white',
    borderColor: 'white',
    borderWidth: heightPercentageToDP(0.2),
  },
  text: {
    textAlign: 'center',
    color: 'black',
  },
})

export { InvestErrorModal }