import React, { useEffect, useState } from 'react'
import { View, SafeAreaView, StyleSheet, ScrollView, Image, Text } from 'react-native'
import {
  actuatedNormalize,
  colors,
  heightPercentageToDP,
  textStyles,
  widthPercentageToDP,
} from '@utils'
import {
  getStockTickers,
  useReduxDispatch,
  useAuthSelector,
  useUserSelector,
} from '@store'
import { NavigationService } from '@navigation'
import { AdComponent } from '@components'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { exploreArrayTwo } from '@constants/exploreArray'
import { exploreArray } from '@constants'
import LinearGradient from 'react-native-linear-gradient'

const ExploreStocks = () => {
  const dispatch = useReduxDispatch()
  useEffect(() => {
    dispatch(getStockTickers())
  }, [])
  const { subscriptionName, isSubscriptionLoaded } = useUserSelector(state => state)

  const { isLoggedIn } = useAuthSelector(state => state)

  return (
    <View style={styles.mainView}>
      <SafeAreaView style={styles.mainView}>
        <View
          style={{
            paddingHorizontal: widthPercentageToDP(5),
          }}>
          <View
            style={{
              marginTop: heightPercentageToDP(2),
              paddingBottom: heightPercentageToDP(0),
            }}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{ marginTop: heightPercentageToDP(2) }}>
              {exploreArray &&
              exploreArray.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() =>
                      NavigationService.navigate('ExploreCategory', {
                        category: item?.category,
                        catString: item?.catString,
                        mainHeader: item?.mainHeader,
                      })
                    }>
                    <LinearGradient
                      key={index}
                      colors={item?.gradientColors}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={[styles.imageStyle, { alignItems: 'center' }]}>
                      <Text
                        style={{
                          fontSize: actuatedNormalize(30),
                          marginHorizontal: widthPercentageToDP(4),
                        }}>
                        {item?.emoji}
                      </Text>
                      <View>
                        <Text
                          style={[
                            textStyles.hugeRegular,
                            { color: 'white', fontSize: actuatedNormalize(15) },
                          ]}>
                          {item?.fullStringE}
                        </Text>
                        <Text
                          style={[
                            textStyles.mediumRegular,
                            {
                              color: 'white',
                              fontSize: actuatedNormalize(11),
                              width: widthPercentageToDP(64),
                            },
                          ]}>
                          {item?.description}
                        </Text>
                      </View>
                    </LinearGradient>
                  </TouchableOpacity>
                ))}
            </ScrollView>
          </View>
        </View>
      </SafeAreaView>
      {(!isLoggedIn || (isSubscriptionLoaded === true && subscriptionName === '')) && (
        <AdComponent />
      )}
    </View>
  )
}
const styles = StyleSheet.create({
  mainView: { flex: 1, backgroundColor: colors.darkBackground },
  welcomeBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  welcomeContainer: {
    flexDirection: 'row',
    paddingHorizontal: widthPercentageToDP(3),
    justifyContent: 'space-between',
  },
  welcomeText: [
    textStyles.bigSemiBold,
    {
      color: 'white',
      fontSize: actuatedNormalize(15),
      marginBottom: heightPercentageToDP(2),
    },
  ],
  marketIndicatorIconContainer: {
    flexDirection: 'row',
    marginRight: widthPercentageToDP(5),
  },
  positionMainContainer: {
    width: '100%',
    justifyContent: 'space-between',
    padding: widthPercentageToDP(3),
  },
  optionImages: {
    width: widthPercentageToDP(25),
    height: widthPercentageToDP(25),
    marginHorizontal: widthPercentageToDP(1),
  },
  positionCard: {
    paddingLeft: widthPercentageToDP(2),
    paddingRight: widthPercentageToDP(2),
    height: heightPercentageToDP(20),
    width: widthPercentageToDP(35),
    borderRadius: heightPercentageToDP(1),
    borderWidth: widthPercentageToDP(0.15),
    marginRight: widthPercentageToDP(2),
    borderColor: 'white',
    backgroundColor: '#1F1C1B',
    marginBottom: heightPercentageToDP(2),
  },
  imageStyle: {
    height: heightPercentageToDP(13),
    width: widthPercentageToDP(90),
    resizeMode: 'contain',
    marginBottom: heightPercentageToDP(2),
    borderRadius: actuatedNormalize(3),
    flexDirection: 'row',
  },
})

export { ExploreStocks }