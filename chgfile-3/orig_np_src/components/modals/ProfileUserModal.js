import React, { useEffect, useState } from 'react'
import { StyleSheet, View, ScrollView, RefreshControl, SafeAreaView } from 'react-native'
import {
  actuatedNormalize,
  colors,
  heightPercentageToDP,
  textStyles,
  widthPercentageToDP,
} from '@utils'
import { useRefreshHookProfile, useRefreshHookExplore } from '@hooks'
import { CustomUserStatusBar, HorizontalRule } from '@components'
import {
  useReduxDispatch,
  getAccountOrders,
  getAccountHistory,
  getAccountActivities,
} from '@store'
import { UserPortfolio } from '../../screens/profile/UserPortfolio'

const ProfileUserModal = ({ userInfo }) => {
  const dispatch = useReduxDispatch()

  const { handleRefreshExplore } = useRefreshHookExplore()

  useEffect(() => {
    handleRefreshExplore()
  }, [])

  const { handleRefreshProfile, refreshing } = useRefreshHookProfile()

  const [selectedButton, setSelectedButton] = useState(1)

  const handleButtonPress = button => {
    setSelectedButton(button)
  }

  useEffect(() => {
    handleRefreshProfile()
    dispatch(getAccountOrders())
    dispatch(getAccountHistory())
    dispatch(getAccountActivities()).catch(error => console.log(error))
  }, [])

  return (
    <View
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
        width: widthPercentageToDP(100),
        height: heightPercentageToDP(100),
      }}>
      <SafeAreaView style={styles.mainContainer}>
        <CustomUserStatusBar userInfo={userInfo} />
        <HorizontalRule />

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}
          contentContainerStyle={{ paddingHorizontal: widthPercentageToDP(2) }}
          refreshControl={
            <RefreshControl
              colors={[colors.offWhite]}
              tintColor={colors.offWhite}
              refreshing={refreshing}
              onRefresh={handleRefreshProfile}
            />
          }>
          {/* SELECTED 1 */}
          {selectedButton == 1 && <UserPortfolio userInfo={userInfo} />}
        </ScrollView>
      </SafeAreaView>
    </View>
  )
}

const styles = StyleSheet.create({
  mainContainer: { backgroundColor: colors.offWhite },
  // mainContainer: { borderTopEndRadius:heightPercentageToDP(10), backgroundColor: colors.darkBackground },
  scrollView: {
    backgroundColor: colors.darkBackground,
    marginBottom: heightPercentageToDP(0),
  },
  topSection: {
    justifyContent: 'space-between',
    marginBottom: heightPercentageToDP(2),
  },
  topIconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: widthPercentageToDP(3),
  },
  positionMainContainer: {
    width: '100%',
    justifyContent: 'space-between',
    padding: widthPercentageToDP(3),
  },

  buttonText: [
    textStyles.bigMedium,
    {
      fontSize: actuatedNormalize(15),
      color: 'black',
      marginTop: heightPercentageToDP(0.3),
    },
  ],
  selectedText: [
    textStyles.bigBold,
    {
      fontSize: actuatedNormalize(15),
      color: 'white',
    },
  ],
  unSelectedText: [
    textStyles.bigRegular,
    {
      fontSize: actuatedNormalize(15),
      color: 'gray',
    },
  ],
})
export { ProfileUserModal }
