import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native'
import { getAccountPortfolio, useReduxDispatch, useUserSelector } from '@store'
import { BackChevron, Icon, GiftModal } from '@components'
import {
  actuatedNormalize,
  colors,
  heightPercentageToDP,
  textStyles,
  widthPercentageToDP,
} from '@utils'
import { NavigationService } from '@navigation'
import { addMoney, useAuthSelector } from '@store'


const loadingIm = require('@assets/images/HomeScreen/loadi.gif')
const loadingSuccess = require('@assets/images/HomeScreen/loadi.gif')


const FreeMoney = () => {
  const dispatch = useReduxDispatch()
  const [loaded, setLoaded] = useState(false)
  const { userId } = useAuthSelector(state => state)
 
  const { portfolio_value } = useUserSelector(state => state)
  const [valueToAdd, setValueToAdd] = useState(false)
  const [errorModal, setErrorModal] = useState(false)
  const [moneyLoading, setMoneyLoading] = useState(false)
  const [moneyLoaded, setMoneyLoaded] = useState(false)
  const [moneyLoadingError, setMoneyLoadingError] = useState(false)
  const [freeMoney, setFreeMoney] = useState(true)
  const [loading, setLoading] = useState(false)

  const handleFreeMoneyReward = async moneyAmount => {
    try {
      // console.log('helllo')
      setValueToAdd(moneyAmount)
      // console.log('helllo1')
      setMoneyLoading(true)
      // console.log('helllo2')
      const addMoneyResp = await addMoney(
        userId,
        (
          parseFloat(portfolio_value?.split(',')?.join('')) +
          parseFloat(moneyAmount?.split(',')?.join(''))
        )?.toString(),
      )
      if (addMoneyResp === true) {
        setMoneyLoading(false)
        setMoneyLoaded(true)
        dispatch(getAccountPortfolio())
      }
    } catch (error) {
      setMoneyLoadingError(true)
    }
  }

  const handleFreeMoney = () => {
    if (isLoaded) {
      show()
      // console.log('1')
    } else {
      setErrorModal(true)
      // console.log('nope')
    }
  }
  useEffect(() => {
    if (isClosed === true && isLoaded === false && isEarnedReward === true) {
      handleFreeMoneyReward('1000')
    }
  }, [isLoaded, isClosed, isEarnedReward])

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.topBar}>
        <View style={styles.topBarBackChevron}>
          <BackChevron onPress={() => NavigationService.navigate('HomeScreen')} />
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginVertical: 5,
            marginRight: widthPercentageToDP(4),
          }}>
          <TouchableOpacity
            onPress={() => {
              handleFreeMoney()
            }}>
            {portfolio_value === null ? null : (
              <Text style={styles.titleText}>Free Money </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
      {!!errorModal && (
        <GiftModal
          visible={!!errorModal}
          handleCloseModal={() => {
            setErrorModal(false)
          }}
        />
      )}

      {moneyLoading && (
        <View style={styles.loadingContainer}>
          {moneyLoadingError && (
            <View>
              <Icon
                type="Ionicons"
                name={'close'}
                size={widthPercentageToDP(5)}
                color="white"
                onPress={() => NavigationService.navigate('Profile')}
                style={{
                  marginTop: heightPercentageToDP(5),
                  paddingRight: widthPercentageToDP(5),
                  position: 'absolute',
                  alignSelf: 'flex-end',
                }}
              />
              <Text style={styles.errorText}>
                We are very sorry. There was an error, any payment amount from will be
                reversed. Please try again later...
              </Text>
            </View>
          )}
          <Image source={loadingIm} style={styles.loadingImage} />
          <Text style={styles.loadingText}>
            🏆 Adding <Text style={styles.explanationTextBold}>$ {valueToAdd}</Text> To
            Your Account ...
          </Text>
        </View>
      )}
      {moneyLoaded && (
        <View style={styles.loadingContainer}>
          <View
            style={{
              backgroundColor: 'white',
              width: widthPercentageToDP(80),
              height: heightPercentageToDP(48),
              alignSelf: 'center',
              marginTop: heightPercentageToDP(30),
              borderRadius: 5,
            }}>
            <Icon
              type="Ionicons"
              name={'close'}
              size={widthPercentageToDP(5)}
              color="black"
              onPress={() => NavigationService.navigate('Profile')}
              style={{
                marginTop: heightPercentageToDP(2),
                paddingRight: widthPercentageToDP(5),
                alignSelf: 'flex-end',
              }}
            />
            <Image source={loadingSuccess} style={styles.loadingSuccessImage} />
            <Text style={styles.successText}>
              Congratulations!{' '}
              <Text style={[styles.explanationTextBold, { color: 'black' }]}>
                $ {valueToAdd}
              </Text>{' '}
              is on your way to your account! This may take a up to a few minutes. Have
              fun investing 🔥
            </Text>
            <TouchableOpacity
              style={styles.containerSuccess}
              onPress={() =>
                NavigationService.navigate(
                  'Invest',
                  {
                    screen: 'InvestTab',
                  },
                  // (setMoneyLoaded(false))
                )
              }>
              <Text
                style={[
                  textStyles.bigBold,
                  { color: 'white', fontSize: actuatedNormalize(13) },
                ]}>
                Invest
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      {freeMoney && (
        <View
          style={[styles.loadingContainer, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]}>
          <View style={styles.moneyContainer}>
            <Text style={styles.successText}>
              {' '}
              Please keep in mind, When you add money to your account, your orders,
              positions and history will be reset.
              <Text style={[styles.successText,{fontWeight:"bold", fontSize:actuatedNormalize(14)}]}> 
              But you get an extra FREE $1,000 😉 🎁
            </Text>
            </Text>
            <View style={{flexDirection:'row', justifyContent:'space-between', marginTop:heightPercentageToDP(1) }}>
            <TouchableOpacity
              style={[styles.containerSuccess, { width: widthPercentageToDP(30), marginRight:widthPercentageToDP(4) }]}
              onPress={() => {
                handleFreeMoney()
                setFreeMoney(false)
              }}>
              <Text
                style={[
                  textStyles.bigBold,
                  { color: 'white', fontSize: actuatedNormalize(13) },
                ]}>
                Continue
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.containerSuccess, { width: widthPercentageToDP(30), backgroundColor:'white', borderColor:'black', borderWidth:widthPercentageToDP(0.3) }]}
              onPress={() => NavigationService.navigate('HomeScreen')}>
              <Text
                style={[
                  textStyles.bigBold,
                  { color: 'black', fontSize: actuatedNormalize(13) },
                ]}>
                Cancel
              </Text>
            </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
         {loading === true && <View
              style={{
                backgroundColor: 'rgba(0, 0, 0,0.8)',
                position:'absolute',
                height: heightPercentageToDP(100),
                width:widthPercentageToDP(100),
                alignSelf: 'center',
                justifyContent: 'center',}}>
              <ActivityIndicator style={{marginTop:heightPercentageToDP(10)}} size="small" color={colors.primary2}/>
            </View>
          }
    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
  safeAreaView: {
    paddingTop: 25,
    backgroundColor: colors.darkBackground,
    paddingBottom: heightPercentageToDP(3),
    flex: 1,
  },
  topBar: { flexDirection: 'row', paddingBottom: heightPercentageToDP(2) },
  topBarBackChevron: {
    flex: 1,
  },
  topBarTitle: { flex: 4, justifyContent: 'center', alignItems: 'center' },
  headingImage: {
    resizeMode: 'contain',
    width: widthPercentageToDP(90),
    height: heightPercentageToDP(7),
  },
  pressable: {
    flexDirection: 'row',
    marginVertical: heightPercentageToDP(1),
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '90%',
  },
  titleText: [
    textStyles.bigBold,
    {
      color: 'white',
      marginBottom: heightPercentageToDP(1),
    },
  ],
  priceText: [
    textStyles.bigRegular,
    {
      color: 'grey',
      marginBottom: heightPercentageToDP(1),
      fontSize: actuatedNormalize(14),
    },
  ],
  explanationText: [
    textStyles.normalRegular,
    {
      color: colors.offWhite,
      width: widthPercentageToDP(65),
      fontSize: actuatedNormalize(11.5),
    },
  ],
  successText: [
    textStyles.normalRegular,
    {
      color: 'black',
      marginHorizontal: widthPercentageToDP(3),
      fontSize: actuatedNormalize(11.5),
      alignSelf: 'center',
      textAlign: 'center',
    },
  ],
  explanationTextBold: [
    textStyles.normalMedium,
    {
      color: 'white',
      width: widthPercentageToDP(65),
    },
  ],
  loadingContainer: {
    height: heightPercentageToDP(100),
    width: '100%',
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.82)',
  },
  loadingImage: {
    width: widthPercentageToDP(50),
    marginLeft: widthPercentageToDP(5),
    marginTop: heightPercentageToDP(10),
    alignContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    resizeMode: 'contain',
  },
  loadingSuccessImage: {
    width: widthPercentageToDP(50),
    height: heightPercentageToDP(23),
    alignContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    resizeMode: 'contain',
  },
  containerSuccess: {
    backgroundColor: 'black',
    width: widthPercentageToDP(60),
    height: heightPercentageToDP(5),
    marginTop: heightPercentageToDP(2),
    alignSelf: 'center',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  loadingText: [
    textStyles.normalRegular,
    {
      color: 'white',
      alignContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
      justifyContent: 'center',
    },
  ],
  errorText: [
    textStyles.bigRegular,
    {
      color: 'white',
      marginTop: heightPercentageToDP(10),
      position: 'absolute',
      alignContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      marginHorizontal: widthPercentageToDP(2),
    },
  ],
  moneyContainer: {
    width: widthPercentageToDP(80),
    height: heightPercentageToDP(23),
    alignContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    position: 'absolute',
    marginTop: heightPercentageToDP(20),
    borderRadius: 5,
  },
})
export { FreeMoney }
