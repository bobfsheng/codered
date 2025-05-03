import React, { useEffect, useState, useRef, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import {
  Image,
  RefreshControl,
  View,
  ScrollView,
  Text,
  Pressable,
  Platform,
  FlatList,
  StyleSheet,
  SafeAreaView,
} from 'react-native'
import RenderHtml from 'react-native-render-html'
import { useFocusEffect } from '@react-navigation/native'

import LinearGradient from 'react-native-linear-gradient'
import {
  CustomAccountStatusBar,
  CustomButton,
  CustomTickerCarousel,
  CustomPositionAssets,
  Icon,
  CustomExplore,
  MarketStatusModal,
  CustomHomeButton,
} from '@components'
import {
  actuatedNormalize,
  colors,
  heightPercentageToDP,
  textStyles,
  widthPercentageToDP,
  localSaveItem,
  StorageKeys,
} from '@utils'
import { NavigationService } from '@navigation'
import { userActions, useAuthSelector, useReduxDispatch, useUserSelector } from '@store'
import Carousel from 'react-native-reanimated-carousel'
import { useRefreshHookHome } from '@hooks'
import Tooltip from 'react-native-walkthrough-tooltip'
import { homeCategories } from '@constants/homeCategories'
import { PopupComponent } from '@components'



const cont = require('@assets/images/HomeScreen/reddollarcon.png')

const CustomTickerCarouselMemo = React.memo(CustomTickerCarousel)
const CustomExploreMemo = React.memo(CustomExplore)
const CustomPositionAssetsMemo = React.memo(CustomPositionAssets)
const CustomHomeButtonMemo = React.memo(CustomHomeButton)
const MarketStatusModalMemo = React.memo(MarketStatusModal)

const HomeScreen = () => {


  const { userId, weeklyRank, userLevel } = useAuthSelector(state => state)

  const allCategoriesLevel =
    userLevel &&
    (typeof userLevel === 'number' ? userLevel : userLevel['All Categories'] || 1)

  const BuyorSellLevel =
    userLevel &&
    (typeof userLevel === 'number' ? userLevel : '$' + (userLevel['BuyorSell'] || 1))

  const {
    positions,
    orders,
    marketStatus,
    subscriptionName,
    isSubscriptionLoaded,
    toolTip1,
    toolTip2,
    haveNewNotification,
    haveNewMessage,
  } = useUserSelector(state => state)

  const topThreePL = [...positions]
    .sort((a, b) => b.unrealized_pl - a.unrealized_pl)
    .slice(0, 3)

  const {
    refreshing,
    handleRefreshHome,
    newsArray,
    positionsExploreSlide,
    positionsExploreRow,
  } = useRefreshHookHome()

  const dispatch = useReduxDispatch()



  const { isLoggedIn } = useAuthSelector(state => state)

  const [watchlistBool, setWatchlistBool] = useState(true)
  const [feedBoxModal, setFeedBoxModal] = useState(false)
  const [FeedIndex, setFeedIndex] = useState(1)
  const [positionBool, setPositionBool] = useState(true)
  const [showMarketModal, setShowMarketModal] = useState(false)
  const [toolTipVisible1, setToolTipVisible1] = useState(true)
  const [toolTipVisible2, setToolTipVisible2] = useState(true)

 const doBoth = React.useCallback(async () => {
   setToolTipVisible1(false)
   setToolTipVisible2(true)
   dispatch(userActions.setToolTip1({ toolTip1: true }))
   await localSaveItem(StorageKeys.toolTipShown1, JSON.stringify(true))
 }, [dispatch])

 const doBoth2 = React.useCallback(async () => {
   setToolTipVisible2(false)
   dispatch(userActions.setToolTip2({ toolTip2: true }))
   await localSaveItem(StorageKeys.toolTipShown2, JSON.stringify(true))
 }, [dispatch])


  const handleWatchList = React.useCallback(() => {
    setWatchlistBool(prev => !prev)
  }, [])

  const handlePosition = React.useCallback(() => {
    setPositionBool(prev => !prev)
  }, [])
  




  // console.log(newsArray[FeedIndex].images.find(image => image.size === 'small')?.url)

  const popupRef = useRef(null)

  const [showPopup, setShowPopup] = useState(false)

  const isFirstRender = useRef(true)

  let mounted = true

      useEffect(() => {
        handleRefreshHome()
        if (showPopup) {
          popupRef.current && popupRef.current.openPopup()
        }
      }, [userId, showPopup, handleRefreshHome])
  
  useFocusEffect(
    React.useCallback(() => {
      if (isFirstRender.current) {
        setShowPopup(true)
        isFirstRender.current = false
      }
      return () => {
        setShowPopup(false) // reset state when screen is out of focus
      }
    }, []),
  )

  // const popupRef = useRef(null)

  // useEffect(() => {
  //   if (showPopup) {
  //     popupRef.current && popupRef.current.openPopup()
  //   }
  // }, [showPopup])



  const [showModal, setShowModal] = useState(true)

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({})
  useFocusEffect(useCallback(reset))


  return (
    <SafeAreaView style={styles.mainView}>
      {/** Top Bar  **/}
      <>
        <View
          style={{
            borderBottomWidth: widthPercentageToDP(0.2),
            marginBottom: heightPercentageToDP(2),
            borderColor: 'gray',
          }}>
          <View style={styles.welcomeBar}>
            {positionsExploreSlide ? (
              <CustomTickerCarouselMemo array={positionsExploreSlide} />
            ) : (
              <View style={{ height: heightPercentageToDP(4) }}></View>
            )}
            {!isLoggedIn && (
              <View style={styles.marketIndicatorIconContainer}>
                <Icon
                  type="Ionicons"
                  name="trophy-sharp"
                  style={{ marginRight: widthPercentageToDP(4) }}
                  size={widthPercentageToDP(6)}
                  color="white"
                  onPress={() => NavigationService.navigate('Leaderboard')}
                />
              </View>
            )}

            {isLoggedIn && (
              <View style={styles.marketIndicatorIconContainer}>
                {Platform.OS !== 'android' && (
                  <Icon
                    type="Entypo"
                    name="chat"
                    style={{ marginRight: widthPercentageToDP(4) }}
                    size={widthPercentageToDP(6)}
                    color={haveNewMessage ? colors.primary2 : 'white'}
                    onPress={() => NavigationService.navigate('Messages')}
                  />
                )}
                <Icon
                  type="Ionicons"
                  name="notifications"
                  style={{
                    marginRight: widthPercentageToDP(4),
                  }}
                  size={widthPercentageToDP(6)}
                  color={haveNewNotification ? colors.primary2 : 'white'}
                  onPress={() => NavigationService.navigate('Notifications')}
                />
                <Icon
                  type="Ionicons"
                  name="trophy-sharp"
                  style={{ marginRight: widthPercentageToDP(4) }}
                  size={widthPercentageToDP(6)}
                  color="white"
                  onPress={() => NavigationService.navigate('Leaderboard')}
                />
                <Tooltip
                  isVisible={toolTipVisible1 && isLoggedIn && !toolTip1}
                  content={
                    <View
                      style={{
                        width: widthPercentageToDP(58),
                        height: heightPercentageToDP(3),
                      }}>
                      <Text
                        style={[
                          textStyles.bigRegular,
                          {
                            fontSize: actuatedNormalize(12),
                            color: 'black',
                            textAlign: 'center',
                          },
                        ]}>
                        Tap to see if the market is open.
                      </Text>
                    </View>
                  }
                  placement="bottom"
                  onClose={doBoth}>
                  {marketStatus === false ? (
                    <Icon
                      type="Feather"
                      name="moon"
                      size={widthPercentageToDP(6)}
                      color="white"
                      onPress={() => setShowMarketModal(true)}
                    />
                  ) : (
                    <Icon
                      type="Feather"
                      name="sun"
                      size={widthPercentageToDP(6)}
                      color="white"
                      onPress={() => setShowMarketModal(true)}
                    />
                  )}
                </Tooltip>
              </View>
            )}
          </View>
        </View>

        {!isLoggedIn && (
          <>
            <View style={styles.welcomeContainer}>
              <CustomButton
                login
                text="Sign Up"
                onPress={() => NavigationService.navigate('SignUpScreen')}
              />

              <CustomButton
                login
                text="Sign In"
                onPress={() => NavigationService.navigate('SignInScreen')}
              />
            </View>

            <View
              style={{
                width: '100%',
                alignItems: 'center',
                padding: 15,
                marginBottom: '1%',
              }}>
              <Pressable onPress={() => NavigationService.navigate('SignUpScreen')}>
                <Text
                  style={[
                    textStyles.bigSemiBold,

                    {
                      color: '#A8DB73',
                      position: 'absolute',
                      marginTop: heightPercentageToDP(Platform.isPad !== true ? 9 : 13),
                      marginLeft: '17%',
                      fontSize: actuatedNormalize(18),
                    },
                  ]}>
                  {'Sign Up to Get $100K'}
                </Text>
                <Image
                  source={cont}
                  style={{
                    marginTop: heightPercentageToDP(Platform.isPad !== true ? 0 : 4),
                    resizeMode: 'contain',
                    width: widthPercentageToDP(Platform.isPad !== true ? 90 : 95),
                    height: heightPercentageToDP(Platform.isPad !== true ? 18 : 22),
                  }}
                />
              </Pressable>
            </View>
          </>
        )}
      </>
      {/** Main View  **/}
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            colors={[colors.offWhite]}
            tintColor={colors.offWhite}
            refreshing={refreshing}
            onRefresh={handleRefreshHome}
          />
        }>
        {/** Custom Account Status Bar  **/}

        {isLoggedIn && <CustomAccountStatusBar showInPercentage={true} />}
        <View style={styles.positionMainContainer}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              marginBottom: heightPercentageToDP(1),
              marginLeft: widthPercentageToDP(0.2),
            }}>
            <Pressable onPress={handleRefreshHome}>
              <Text
                style={[
                  textStyles.bigMedium,
                  {
                    fontSize: actuatedNormalize(12),
                    color: 'white',
                  },
                ]}>
                {isLoggedIn && positions !== null && positions?.length > 0
                  ? 'YOUR POSITIONS'
                  : 'EXPLORE STOCKS'}
              </Text>
            </Pressable>
            <Icon
              type="AntDesign"
              name={watchlistBool === true ? 'up' : 'down'}
              size={widthPercentageToDP(4)}
              style={{ marginLeft: widthPercentageToDP(3) }}
              color="white"
              onPress={() => {
                handleWatchList()
              }}
            />
          </View>
          {watchlistBool && (
            <View>
              {!isLoggedIn || positions === null || positions.length < 1 ? (
                <FlatList
                  horizontal
                  data={positionsExploreRow}
                  renderItem={({ item, index }) => (
                    <CustomExploreMemo key={index} position={item} explore={false} />
                  )}
                  keyExtractor={(item, index) => index.toString()}
                  showsHorizontalScrollIndicator={false}
                />
              ) : (
                <FlatList
                  horizontal
                  data={positions}
                  renderItem={({ item, index }) => (
                    <CustomPositionAssetsMemo
                      key={index}
                      position={item}
                      explore={false}
                    />
                  )}
                  keyExtractor={(item, index) => index.toString()}
                  showsHorizontalScrollIndicator={false}
                />
              )}
            </View>
          )}
        </View>

        <View style={{ paddingHorizontal: widthPercentageToDP(2) }}>
          <Text
            style={[
              textStyles.bigMedium,
              {
                marginLeft: widthPercentageToDP(1),
                fontSize: actuatedNormalize(12),
                color: 'white',
                marginTop: heightPercentageToDP(1),
              },
            ]}>
            OPTIONS
          </Text>

          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            {homeCategories
              ?.filter(categoryItem => isLoggedIn || categoryItem?.category !== 'Invest')
              .map((categoryItem, index) => (
                <CustomHomeButtonMemo
                  key={index}
                  category={categoryItem?.category}
                  title={categoryItem?.title}
                  emoji={categoryItem?.emoji}
                  gradientColors={categoryItem?.gradientColors}
                  index={index}
                  screen={categoryItem?.screen}
                  component={categoryItem?.component}
                  info={categoryItem?.info}
                  button={categoryItem?.button}
                  weeklyRank={weeklyRank >= 1 ? weeklyRank + 'th' : weeklyRank}
                  level={allCategoriesLevel}
                  levelGame={BuyorSellLevel}
                  isLoggedIn={isLoggedIn}
                />
              ))}
          </ScrollView>
        </View>
        {isLoggedIn && (
          <LinearGradient
            colors={['#3E3A42', '#282729', '#121212']}
            style={{
              width: widthPercentageToDP(100),
              backgroundColor: '#39383A',
              marginTop: heightPercentageToDP(2),
              paddingBottom: heightPercentageToDP(5),
              borderTopLeftRadius: heightPercentageToDP(4),
              borderTopRightRadius: heightPercentageToDP(4),
            }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text
                style={[
                  styles.screenTitle,
                  textStyles.bigMedium,
                  {
                    marginLeft: heightPercentageToDP(3),
                    fontSize: actuatedNormalize(12),
                    color: 'white',
                    marginTop: heightPercentageToDP(3),
                  },
                ]}>
                {'FEED'}
              </Text>
            </View>
            <Tooltip
              isVisible={toolTipVisible2 && isLoggedIn && !toolTip2}
              content={
                <View
                  style={{
                    width: widthPercentageToDP(47),
                    height: heightPercentageToDP(3),
                  }}>
                  <Text
                    style={[
                      textStyles.bigRegular,
                      {
                        fontSize: actuatedNormalize(12),
                        color: 'black',
                        textAlign: 'center',
                      },
                    ]}>
                    Tap to read the full story.
                  </Text>
                </View>
              }
              placement="top"
              onClose={doBoth2}
              // onClose={setToolTipVisible1(false)}
            >
              <View style={styles.feedBox}>
                {newsArray && (
                  <Carousel
                    loop
                    width={widthPercentageToDP(100)}
                    height={heightPercentageToDP(45)}
                    autoPlay={true}
                    data={newsArray}
                    scrollAnimationDuration={10000}
                    onSnapToItem={index => null}
                    renderItem={({ item, index }) => (
                      <>
                        <Pressable
                          key={index.toString()}
                          onPress={() => setFeedBoxModal(true) & setFeedIndex(index)}>
                          <Image
                            source={{
                              uri: newsArray[index].images.find(
                                image => image.size === 'small',
                              )?.url,
                            }}
                            style={{
                              position: 'absolute',
                              height: heightPercentageToDP(26),
                              width: widthPercentageToDP(90),
                              borderRadius: heightPercentageToDP(1),
                              resizeMode: 'cover',
                            }}
                          />
                          <View
                            style={{
                              // flex: 1,
                              flexDirection: 'column',
                              // justifyContent: 'flex-end',
                              borderBottomEndRadius: heightPercentageToDP(1),
                              borderBottomStartRadius: heightPercentageToDP(1),
                              // borderRadius: heightPercentageToDP(2),
                              paddingHorizontal: heightPercentageToDP(2),
                              paddingVertical: heightPercentageToDP(0.5),
                              width: widthPercentageToDP(90),
                              marginTop: heightPercentageToDP(14),
                              height: heightPercentageToDP(12),
                              backgroundColor: 'rgba(0, 0, 0, 0.8)', // Add a semi-transparent background overlay
                            }}>
                            <Text numberOfLines={2} style={styles.feedBoxText}>
                              {newsArray[index].headline}
                            </Text>
                            <View
                              style={{
                                marginTop: heightPercentageToDP(1),
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                              }}>
                              <Text numberOfLines={1} style={styles.feedBoxTextBody}>
                                {newsArray[index].author}
                              </Text>
                              <Text numberOfLines={1} style={styles.feedBoxTextBody}>
                                {JSON.stringify(
                                  new Date(newsArray[index].created_at).getMonth() + 1,
                                ) +
                                  '-' +
                                  JSON.stringify(
                                    new Date(newsArray[index].created_at).getDate(),
                                  ) +
                                  '-' +
                                  JSON.stringify(
                                    new Date(newsArray[index].created_at).getFullYear(),
                                  )}
                              </Text>
                            </View>
                          </View>
                        </Pressable>
                      </>
                    )}
                  />
                )}
              </View>
            </Tooltip>
          </LinearGradient>
        )}
      </ScrollView>
      {/* //    Modals \\ */}
      {showMarketModal && (
        <MarketStatusModalMemo
          visible={showMarketModal}
          handleCloseModal={() => {
            setShowMarketModal(false)
          }}
        />
      )}
      {feedBoxModal === true &&
        newsArray &&
        newsArray.map((item, index) => (
          <View
            key={index}
            style={[
              styles.feedModal,
              {
                marginTop: heightPercentageToDP(
                  // isSubscriptionLoaded === true && subscriptionName === '' ? 32 :
                  38,
                ),
              },
            ]}>
            <Icon
              type="Ionicons"
              name={'close'}
              size={widthPercentageToDP(5)}
              color="black"
              onPress={() => setFeedBoxModal(false)}
              style={{
                marginTop: heightPercentageToDP(1),
                paddingRight: widthPercentageToDP(2),
                alignSelf: 'flex-end',
              }}
            />
            <ScrollView
              style={{
                maxHeight: heightPercentageToDP(70),
                maxWidth: widthPercentageToDP(100),

                marginBottom: heightPercentageToDP(Platform.isPad !== true ? 5 : 10),
              }}>
              <Text
                style={[
                  styles.feedBoxText,
                  {
                    color: 'black',
                    marginTop: heightPercentageToDP(0),
                    width: '90%',
                  },
                ]}>
                {}
                {newsArray[FeedIndex].headline}
                {/* {FeedText[FeedIndex]?.Title} */}
              </Text>
              <Image
                style={{
                  resizeMode: 'contain',
                  borderRadius: 10,
                  height: heightPercentageToDP(6),
                  width: widthPercentageToDP(20),
                  marginRight: widthPercentageToDP(4),
                }}
                source={{ uri: newsArray[FeedIndex].url }}
              />
              <Text
                style={[
                  styles.feedBoxTextBody,
                  { color: 'black', width: widthPercentageToDP(90) },
                ]}>
                <RenderHtml
                  contentWidth={widthPercentageToDP(90)}
                  source={{ html: newsArray[FeedIndex].content }}
                />
              </Text>
            </ScrollView>
          </View>
        ))}
      <View>
        {showModal && (
          // {false && (
          <PopupComponent
            ref={popupRef}
            message="This is a popup message."
            emoji={'🎉'}
            buttonText={'Start Game'}
            onPress={() => {
              setShowModal(false)
              NavigationService.navigate('Games', { screen: 'BuyorSell' })
            }}
            onPressLoggedOut={() => {
              setShowModal(false)
              NavigationService.navigate('SignUpScreen')
            }}
            isLoggedIn={isLoggedIn}
            title={"Today's Highlights"}
            onClose={() => setShowPopup(false)}
            level={allCategoriesLevel}
            levelGame={BuyorSellLevel}
            topThreePL={topThreePL}
          />
        )}
        {/* <Button title="Open Popup" onPress={openPopup} /> */}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  mainView: { paddingTop: 25, flex: 1, backgroundColor: colors.darkBackground },
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
  feedBox: {
    width: widthPercentageToDP(90),
    height: widthPercentageToDP(55),
    // backgroundColor: '#151515',
    alignSelf: 'center',
    marginTop: heightPercentageToDP(2),
    // marginHorizontal: widthPercentageToDP(1),
    borderRadius: 10,
    // paddingLeft: widthPercentageToDP(6),
    paddingVertical: heightPercentageToDP(1),
  },
  freeBox: {
    width: widthPercentageToDP(90),
    height: widthPercentageToDP(12),
    backgroundColor: 'white',
    alignSelf: 'center',
    marginTop: heightPercentageToDP(2),
    marginHorizontal: widthPercentageToDP(1),
    borderRadius: 10,
    paddingHorizontal: widthPercentageToDP(1),
    paddingVertical: heightPercentageToDP(1),
  },
  feedModal: {
    width: widthPercentageToDP(100),
    height: heightPercentageToDP(50),
    backgroundColor: 'white',
    alignSelf: 'center',
    marginHorizontal: widthPercentageToDP(1),
    borderTopRightRadius: 40,
    borderTopLeftRadius: 40,
    position: 'absolute',
    paddingHorizontal: widthPercentageToDP(4),
    paddingVertical: heightPercentageToDP(1),
  },
  feedBoxText: [
    textStyles.bigBold,
    {
      color: 'white',
      width: widthPercentageToDP(76),
      fontSize: actuatedNormalize(12),
      marginBottom: heightPercentageToDP(1),
      marginTop: heightPercentageToDP(1),
    },
  ],
  feedBoxTextBody: [
    textStyles.bigRegular,
    {
      color: 'white',
      width: widthPercentageToDP(50),
      fontSize: actuatedNormalize(12),
      marginBottom: heightPercentageToDP(2),
    },
  ],
  imageStyle: {
    height: heightPercentageToDP(18),
    width: widthPercentageToDP(90),
    resizeMode: 'contain',
  },
})
export { HomeScreen }
