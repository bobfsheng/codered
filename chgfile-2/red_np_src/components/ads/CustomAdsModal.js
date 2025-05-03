import React from 'react'
import {
  Platform,
  Modal,
  Text,
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from 'react-native'
import {
  colors,
  widthPercentageToDP,
  heightPercentageToDP,
  textStyles,
  actuatedNormalize,
} from '@utils'
import { InAppPurchaseHook } from '@hooks'
import { Icon } from '@components'

const CustomAdsModal = ({ showSubscriptionModalAds, setShowSubscriptionModalAds }) => {
  const { isLoadingSub, subscriptionList, buySubscriptionHandle, isLoadingPay } =
    InAppPurchaseHook()

  return (
    <Modal
      animationType="slide"
      visible={showSubscriptionModalAds}
      transparent={true}
      onRequestClose={() => setShowSubscriptionModalAds(false)}>
      {isLoadingSub || isLoadingPay ? (
        <>
          {isLoadingSub && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator
                size="small"
                color={colors.primary}
                style={styles.loadingIndicator}
              />
            </View>
          )}
        </>
      ) : (
        <View style={styles.modalContainer}>
          <ScrollView backgroundColor={colors.offWhite} style={styles.scrollView}>
            <View style={styles.header}>
              <Text style={styles.headerText}>No More Ads</Text>
              <Icon
                type="MaterialIcons"
                name="close"
                size={styles.closeIcon.fontSize}
                style={styles.closeIcon}
                color={styles.closeIcon.color}
                onPress={() => setShowSubscriptionModalAds(false)}
              />
            </View>
            {subscriptionList &&
              subscriptionList.map((item, index) => (
                <View key={index}>
                  <Pressable
                    onPress={() => {
                      buySubscriptionHandle(item.productId, item?.offerToken)
                      setTimeout(() => {
                        setShowSubscriptionModalAds(false)
                      }, 5000)
                    }}
                    style={styles.subscriptionItem}>
                    <View style={styles.subscriptionItemContent}>
                      <Text style={styles.subscriptionTitle}>
                        Ad Free {item?.productId}
                        {Platform.OS === 'android' ? 'ly' : ''}
                      </Text>
                      <Text style={styles.discountText}>%70 Off</Text>
                      <Text style={styles.strikeThroughText}>
                        {(parseFloat(item?.price) * 1.5)?.toFixed(2)}
                      </Text>
                      <Text style={styles.currencyText}>{item?.currency}</Text>
                    </View>
                    <Text style={styles.descriptionText}>
                      Enjoy investing ads free {item?.productId} and more...
                    </Text>
                  </Pressable>
                </View>
              ))}
          </ScrollView>
        </View>
      )}
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    height: heightPercentageToDP(100),
    width: widthPercentageToDP(100),
  },
  scrollView: {
    borderRadius: 30,
    width: widthPercentageToDP(100),
    height: heightPercentageToDP(75),
    marginTop: heightPercentageToDP(35),
    marginBottom:
      Platform.OS === 'android'
        ? heightPercentageToDP(0)
        : heightPercentageToDP(Platform.isPad !== true ? 0 : 20),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerText: {
    color: 'black',
    fontSize: actuatedNormalize(18),
    marginVertical: heightPercentageToDP(3),
  },
  closeIcon: {
    fontSize: widthPercentageToDP(Platform.isPad !== true ? 6 : 4),
    marginRight: widthPercentageToDP(4),
    marginTop: heightPercentageToDP(3),
    color: 'black',
  },
  loadingOverlay: {
    width: widthPercentageToDP('100'),
    height: heightPercentageToDP('100'),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
    position: 'absolute',
  },
  loadingIndicator: {
    marginBottom: heightPercentageToDP(25),
  },
  subscriptionItem: {
    paddingVertical: heightPercentageToDP(2),
    paddingHorizontal: widthPercentageToDP(4),
    marginBottom: heightPercentageToDP(3),
    borderWidth: widthPercentageToDP(1),
    borderColor: '#BADF7F',
    alignSelf: 'center',
    borderRadius: 20,
    width: widthPercentageToDP(93),
    height: heightPercentageToDP(14),
  },
  subscriptionItemContent: {
    flexDirection: 'row',
  },
  subscriptionTitle: {
    color: 'white',
    fontSize: actuatedNormalize(15),
  },
  discountText: {
    color: '#BADF7F',
    fontSize: actuatedNormalize(12),
  },
  strikeThroughText: {
    color: 'gray',
    textDecorationLine: 'line-through',
    fontSize: actuatedNormalize(14),
  },
  currencyText: {
    color: 'gray',
    fontSize: actuatedNormalize(14),
  },
  descriptionText: {
    color: 'gray',
    width: widthPercentageToDP(86),
    fontSize: actuatedNormalize(11),
    marginTop: heightPercentageToDP(1),
  },
})

export { CustomAdsModal }