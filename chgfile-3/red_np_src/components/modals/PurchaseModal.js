import React, { useEffect, useRef } from 'react'
import {
  initConnection,
  endConnection,
  flushFailedPurchasesCachedAsPendingAndroid,
  getSubscriptions,
  requestPurchase,
  finishTransaction,
} from 'react-native-iap'
import { Animated, Modal, TouchableWithoutFeedback, View, StyleSheet } from 'react-native'
import { colors, heightPercentageToDP, widthPercentageToDP } from '@utils'
const PurchaseModal = ({
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

  const [products, setProducts] = useState([])
  const productSkus = Platform.select({
    ios: { skus: ['Weekly', 'Monthly', 'Yearly'] },
    android: {
      skus: ['level1', 'level2', 'level3', 'level4', 'level5', 'level6', 'level7'],
    },
  })
  const plans = [
    {  price: '1.99', level: 'Weekly' },
    {  price: '3.99', level: 'Monthly' },
    {  price: '9.99', level: 'Yearly' }
  ]
    // productId, money, price, image
    useEffect(() => {
      initilizeIAPConnection()
      return () => {
        endConnection()
      }
    }, [])
  

    const [loading, setLoading] = useState(false)
    const initilizeIAPConnection = async () => {
      await initConnection()
        .then(async connection => {
          getItems()
        })
        .catch(err => {
          // console.log(`IAP ERROR ${err.code}`, err.message)
          null
        })
      if (Platform.OS === 'android') {
        await flushFailedPurchasesCachedAsPendingAndroid()
          .then(async consumed => {
            // console.log('consumed all items?', consumed)
            null
          })
          .catch(err => {
            null
            // console.log(
            //   `flushFailedPurchasesCachedAsPendingAndroid ERROR ${err.code}`,
            //   err.message,
            // )
          })
      }
    }
  const getItems = async () => {
    try {
      const availablePurchases = await getSubscriptions(productSkus)
      if (availablePurchases.length > 0) {
        if (Platform.OS === 'android') {
          const newProducts = availablePurchases.map((item, index) => {
            return {
              productId: item.productId,
              price: item.oneTimePurchaseOfferDetails.formattedPrice,
              currency: item.oneTimePurchaseOfferDetails.formattedPrice,
            }
          })
          setProducts(newProducts)
        } else if (Platform.OS === 'ios') {
          const newProducts = []
          // console.log('here')
          availablePurchases.forEach((item, index) => {
            plans.forEach(plan => {
              if (plan.level === item.productId) {
                // console.log('here1')
                const temp = {
                  productId: item.productId,
                  price: item.price,
                  currency: item.localizedPrice,
                }
                // console.log('here2')
                newProducts.push(temp)
                // console.log('here3')
              }
            })
          })
          // console.log('here5')
          setProducts(newProducts)
          // console.log(newProducts, products)
        }
      }
    } catch (err) {
      console.warn('IAP error', err)
    }
  }
  const buyMoney = async item => {
    try {
      // console.log('hello 0')
      setLoading(true)
      const purchase = await requestPurchase({
        sku: item.productId,
        andDangerouslyFinishTransactionAutomaticallyIOS: false,
      })
      setLoading(false)
      // console.log('hello 1')
      await finishTransaction({ purchase, isConsumable: true })
      // console.log('hello 2')
      setLoading(false)
      // handlePurchase(item.money)
      setLoading(false)
    } catch (error) {
      // console.log('hello error')
      setLoading(false)
      // console.log(error.message)
    }
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
            {subscriptionModal && !isSubscribed  && (
        <View style={{position:'absolute',  backgroundColor: 'rgba(0, 0, 0, 0.7)', height:heightPercentageToDP(100), width:widthPercentageToDP(100)}}>
        <View backgroundColor={colors.offWhite} style={{borderRadius:30,  
          width:widthPercentageToDP(100), 
          height:heightPercentageToDP(60), 
          marginTop:heightPercentageToDP(30)}}>
        <View style={{flexDirection:'row', 
        justifyContent:'space-between'}}>
          <Text style={[
    textStyles.bigRegular,
    { color: 'black', fontSize:actuatedNormalize(18),marginVertical: heightPercentageToDP(3)},
  ]}>     Crypto Access</Text> 
               <Icon
              type="MaterialIcons"
              name="close"
              size={widthPercentageToDP(6)}
              style={{ marginRight:widthPercentageToDP(4), marginTop:heightPercentageToDP(3) }}
              color={'black'}
              onPress={()=> setSubscriptionModal(false)}
            />
            </View>
            {products &&
            products
              .map((item, index) => (
         <Pressable 
              onPress={() => buyMoney(item)} key={index}
              backgroundColor='black' 
              style={{paddingVertical:heightPercentageToDP(2),
              paddingHorizontal:widthPercentageToDP(4), 
              marginBottom: heightPercentageToDP(3), 
              borderWidth: widthPercentageToDP(1),
              borderColor: 
              '#BADF7F',
              alignSelf:'center', borderRadius:20,  
              width:widthPercentageToDP(93), 
              height: heightPercentageToDP(14)}}>
          <View style={{flexDirection:'row'}}>
            <Text style={[
            textStyles.bigRegular,
            { color: 'white', fontSize:actuatedNormalize(16)},
          ]}>{item?.productId}
            </Text> 
            <Text style={[
            textStyles.bigRegular,
            { color: 'gray', fontSize:actuatedNormalize(13)},
          ]}>{'   '}%25 Off{'             '} 
            </Text> 
            <Text style={[
            textStyles.bigRegular,
            { color: 'gray', textDecorationLine: "line-through",
            fontSize:actuatedNormalize(14)},
          ]}>{'   '}${(parseFloat(item?.price)* 1.5)?.toFixed(2)} 
            </Text> 
            <Text style={[
            textStyles.bigRegular,
            { color: 'gray', fontSize:actuatedNormalize(14)},
          ]}>{'   '}{item?.currency}
            </Text> 
            </View>
            <Text style={[
            textStyles.bigRegular,
            { color: 'gray', width:widthPercentageToDP(86), fontSize:actuatedNormalize(13), marginTop:heightPercentageToDP(1)},
          ]}>{item?.productId} Subscription to free crypto trading game and more...
          </Text> 
        </Pressable>
           ))}
        </View>
        </View>
      )}
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
    backgroundColor: 'white',
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
export { PurchaseModal }
