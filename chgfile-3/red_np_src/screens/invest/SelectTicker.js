import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  RefreshControl,
} from 'react-native'
import {
  actuatedNormalize,
  colors,
  heightPercentageToDP,
  textStyles,
  widthPercentageToDP,
} from '@utils'
import { useReduxDispatch, useUserSelector, getStockTickers } from '@store'
import {
  CustomButton,
  CustomInputLabel,
  CustomStockTicker,
  CustomPositionAssetsThree,
  CustomExploreLong,
  CustomExplore,
  AdComponent,
} from '@components'
import { NavigationService } from '@navigation'
import axios from 'axios'
import Carousel from 'react-native-reanimated-carousel'

const SelectTicker = ({ route }) => {
  const { positions, subscriptionName, isSubscriptionLoaded } = useUserSelector(
    state => state,
  )
  const dispatch = useReduxDispatch()
  useEffect(() => {
    dispatch(getStockTickers())
  }, [])
  let tab = route?.params?.tab

  const navigateTo = useState(tab == 'easy' ? 'InvestTab' : 'InvestScreen')

  const [selectedFinalStock, setFinalSelectedStock] = useState(null)
  const [positionsExplore, setPositionsExplore] = useState(null)
  const [refreshing, setRefreshing] = useState(false)
  const [positionsExploreRow, setPositionsExploreRow] = useState(null)

  const handleRefresh = React.useCallback(async () => {
    setRefreshing(true)

    const alpacaMarketApi = axios.create({
      baseURL: 'https://paper-api.alpaca.markets/',
      headers: {
        Authorization: `Bearer d674ec3c-077b-41c3-b712-3b17d997079d`,
      },
    })
    try {
      const response = await alpacaMarketApi.get('v2/positions')
      if (response.status === 200) {
        setPositionsExplore(response.data)
      }
    } catch (error) {
      // console.log('getPositions explore =>', error.response)
      null
    }

    const alpacaMarketApiRow = axios.create({
      baseURL: 'https://paper-api.alpaca.markets/',
      headers: {
        // Authorization: `Bearer d674ec3c-077b-41c3-b712-3b17d997079d`,
        // config.headers = {
        'APCA-API-KEY-ID': 'PKI4FE040C9SF0UEI6QS',
        'APCA-API-SECRET-KEY': '5aEKhKeebyYk3hV0R14B0xZiBHAanDRAZg27m2QT',
      },
    })
    try {
      const response = await alpacaMarketApiRow.get('v2/positions')
      if (response.status === 200) {
        setPositionsExploreRow(response.data)
      }
    } catch (error) {
      // console.log('getPositions explore =>', error.response)
      null
    }
    setRefreshing(false)
  }, [])
  useEffect(() => {
    handleRefresh()
  }, [])

  return (
    <>
      <SafeAreaView style={styles.mainView}>
        <View
          style={{
            paddingHorizontal: widthPercentageToDP(5),
            marginTop: heightPercentageToDP(3),
          }}>
          <View
            style={{
              position: 'absolute',
              right: widthPercentageToDP(5),
              left: widthPercentageToDP(5),
              zIndex: 99,
            }}>
            <CustomInputLabel text="Search stocks" big info />
            <CustomStockTicker
              tab={'Invest'}
              setFinalSelectedStock={setFinalSelectedStock}
            />
          </View>

          <View
            style={{
              position: 'absolute',
              top: heightPercentageToDP(11),
              right: widthPercentageToDP(5),
              left: widthPercentageToDP(5),
            }}>
            <CustomButton
              primary
              text="Next"
              onPress={() =>
                NavigationService.navigate('Invest', {
                  screen: 'InvestTab',
                  params: {
                    tab: tab,
                    stockTicker: selectedFinalStock?.symbol,
                  },
                })
              }
              style={{ width: '100%' }}
            />
          </View>

          <View
            style={{
              marginTop: heightPercentageToDP(22),
              paddingBottom: heightPercentageToDP(5),
            }}>
            <Text
              style={[
                textStyles.bigMedium,
                {
                  fontSize: actuatedNormalize(14),
                  color: 'white',
                },
              ]}>
              {positions === null || positions.length < 1
                ? 'Explore Stocks'
                : 'Your Positions'}
            </Text>

            {positions === null || positions.length < 1 ? (
              <>
                <ScrollView
                  showsHorizontalScrollIndicator={false}
                  horizontal={true}
                  style={{ alignSelf: 'center' }}
                  refreshControl={
                    <RefreshControl
                      colors={[colors.offWhite]}
                      tintColor={colors.offWhite}
                      refreshing={refreshing}
                      onRefresh={handleRefresh}
                    />
                  }>
                  <View
                    style={{ flexDirection: 'row', marginTop: heightPercentageToDP(2) }}>
                    {positionsExploreRow &&
                      positionsExploreRow.map((item, index) => (
                        <CustomExplore key={index} position={item} explore={true} />
                      ))}
                  </View>
                </ScrollView>
              </>
            ) : (
              <>
                <Carousel
                  loop
                  width={widthPercentageToDP(90)}
                  height={heightPercentageToDP(20)}
                  autoPlay={true}
                  // mode={'marquee'}
                  // data={exploreArray}
                  data={positions && positions}
                  scrollAnimationDuration={5000}
                  onSnapToItem={index => null}
                  renderItem={({ index }) => (
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignContent: 'center',
                        alignSelf: 'center',
                        alignItems: 'center',
                      }}>
                      <CustomPositionAssetsThree
                        position={positions[index]}
                        key={index}
                      />
                    </View>
                  )}
                />
                <Text
                  style={[
                    textStyles.bigMedium,
                    {
                      fontSize: actuatedNormalize(14),
                      color: 'white',
                      marginTop: heightPercentageToDP(20),
                    },
                  ]}>
                  Suggested
                </Text>
                <ScrollView
                  showsHorizontalScrollIndicator={false}
                  horizontal={true}
                  style={{ alignSelf: 'center' }}
                  refreshControl={
                    <RefreshControl
                      colors={[colors.offWhite]}
                      tintColor={colors.offWhite}
                      refreshing={refreshing}
                      onRefresh={handleRefresh}
                    />
                  }>
                  <View
                    style={{ flexDirection: 'row', marginTop: heightPercentageToDP(2) }}>
                    {positionsExploreRow &&
                      positionsExploreRow.map((item, index) => (
                        <CustomExploreLong key={index} position={item} explore={true} />
                      ))}
                  </View>
                </ScrollView>
              </>
            )}
          </View>
        </View>
        <AdComponent />
      </SafeAreaView>
    </>
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
})
export { SelectTicker }
