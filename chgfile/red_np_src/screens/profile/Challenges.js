import React, { useState, useMemo } from 'react'
import { StyleSheet, View, Text, RefreshControl, FlatList, Pressable, ActivityIndicator } from 'react-native'
import {
  actuatedNormalize,
  colors,
  heightPercentageToDP,
  textStyles,
  widthPercentageToDP,
} from '@utils'
import {
  ActiveBetComponent,
  PastBetComponent,
  VirtualizedView,
  PendingBetComponent,
  Icon,
} from '@components'
import { NavigationService } from '@navigation'
import { useGetAllBettings } from '../../hooks/profile/Betting/useGetAllBettings'

const Challenges = ({ profile, handleButtonPress, friend }) => {
  const {
    loadingPastBets,
    loadingCurrentBets,
    loadingPendingBets,
    allPastBets,
    allCurrentBet,
    allPendingBets,
    getAllPendingUserBets,
    getAllBets,
  } = useGetAllBettings()
  const [pendingSort, setPendingSort] = useState(false)
  const [activeSort, setActiveSort] = useState(false)
  const [pastSort, setPastSort] = useState(false)
  const [sortType, setSortType] = useState({ type: 'active', ascending: false })
   const sortBets = (bets, dateProperty) => {
     return [...bets].sort((a, b) => {
       const dateA = new Date(a[dateProperty])
       const dateB = new Date(b[dateProperty])
       return sortType.ascending ? dateA - dateB : dateB - dateA
     })
   }
    const filterBets = bets => {
      return profile
        ? bets
        : bets.filter(item => item?.friendId === friend?.uid || item?.uid === friend?.uid)
    }
    const getSortedFilteredBets = (bets, dateProperty) => {
      const filtered = filterBets(bets)
      return sortBets(filtered, dateProperty)
    }


   const filteredCurrentBets = useMemo(
     () => getSortedFilteredBets(allCurrentBet, 'updatedAt'),
     [allCurrentBet, friend, sortType],
   )
   const filteredPendingBets = useMemo(
     () => getSortedFilteredBets(allPendingBets, 'createdAt'),
     [allPendingBets, friend, sortType],
   )
   const filteredPastBets = useMemo(
     () => getSortedFilteredBets(allPastBets, 'updatedAt'),
     [allPastBets, friend, sortType],
   )



  return (
    <VirtualizedView
      style={styles.scrollView}
      showsVerticalScrollIndicator={false}
      nestedScrollEnabled={true}
      contentContainerStyle={{
        paddingHorizontal: widthPercentageToDP(2),
        paddingBottom: heightPercentageToDP(3),
      }}
      refreshControl={
        <RefreshControl
          colors={[colors.offWhite]}
          tintColor={colors.offWhite}
          refreshing={false}
          onRefresh={() => {
            getAllBets()
          }}
        />
      }>
      {(profile == true || filteredCurrentBets?.length >= 1) && (
        <>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginVertical: heightPercentageToDP(2),
              marginHorizontal: heightPercentageToDP(2),
            }}>
            <Text
              style={[
                styles.selectedText,
                { marginTop: heightPercentageToDP(profile == false ? 0 : 0.4) },
              ]}>
              {'Active Challenges  '}
              <Icon
                type="FontAwesome"
                name="sort"
                size={widthPercentageToDP(4)}
                color={colors.offWhite}
                onPress={() => setActiveSort(prev => !prev)}
              />
            </Text>
            {profile == false || filteredCurrentBets?.length > 0 ? (
              <Pressable onPress={() => handleButtonPress(3)}>
                <Text style={styles.seeAllText}>
                  {filteredCurrentBets?.length > 0 ? '' : 'See all'}
                </Text>
              </Pressable>
            ) : (
              <Pressable
                style={{
                  backgroundColor: colors.offWhite,
                  paddingHorizontal: widthPercentageToDP(4),
                  paddingVertical: heightPercentageToDP(0.5),
                  borderRadius: actuatedNormalize(30),
                  alignSelf: 'center',
                  alignItems: 'center',
                  alignContent: 'center',
                  justifyContent: 'center',
                }}
                onPress={() =>
                  NavigationService.navigate('Games', { screen: 'Compete' })
                }>
                <Text style={styles.newText}>{'New +'}</Text>
              </Pressable>
            )}
          </View>
          <View style={{ width: '100%' }}>
            <FlatList
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              data={filteredCurrentBets.sort((a, b) => {
                const dateA = new Date(a.updatedAt)
                const dateB = new Date(b.updatedAt)
                return activeSort ? dateA - dateB : dateB - dateA // If pendingSort is true, sort ascending; if false, sort descending
              })}
              refreshing={loadingCurrentBets}
              style={{ width: '100%' }}
              initialNumToRender={1}
              maxToRenderPerBatch={2}
              ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
              ListEmptyComponent={() => {
                return (
                  <View
                    style={{
                      marginLeft: widthPercentageToDP(5),
                      marginVertical: heightPercentageToDP(1),
                    }}>
                    <Text
                      style={[
                        textStyles.normalMedium,
                        { color: 'white', textAlign: 'center' },
                      ]}>
                      {loadingCurrentBets
                        ? 'Loading Past Games...'
                        : 'No Challenges Yet!'}
                    </Text>
                  </View>
                )
              }}
              renderItem={({ item, index }) => (
                <View
                  style={{
                    alignContent: 'center',
                    alignItems: 'center',
                    alignSelf: 'center',
                  }}>
                  <ActiveBetComponent betInfo={item} key={index} />
                </View>
              )}
            />
          </View>
        </>
      )}
      {(profile == true || filteredPendingBets?.length >= 1) && (
        <>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginVertical: heightPercentageToDP(2),
              marginHorizontal: heightPercentageToDP(2),
            }}>
            <Text style={styles.selectedText}>
              {'Pending Challenges  '}
              <Icon
                type="FontAwesome"
                name="sort"
                size={widthPercentageToDP(4)}
                color={colors.offWhite}
                onPress={() => setPendingSort(prev => !prev)}
              />
            </Text>
            {profile == false && (
              <Pressable onPress={() => handleButtonPress(3)}>
                <Text style={styles.seeAllText}>{'See all'}</Text>
              </Pressable>
            )}
          </View>
          <View style={{ width: '100%' }}>
            <FlatList
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              data={filteredPendingBets.sort((a, b) => {
                const dateA = new Date(a.createdAt)
                const dateB = new Date(b.createdAt)
                return pendingSort ? dateA - dateB : dateB - dateA // If pendingSort is true, sort ascending; if false, sort descending
              })}
              refreshing={loadingPendingBets}
              style={{ width: '100%' }}
              initialNumToRender={1}
              maxToRenderPerBatch={2}
              ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
              ListEmptyComponent={() => {
                return (
                  <View
                    style={{
                      marginLeft: widthPercentageToDP(5),
                      marginVertical: heightPercentageToDP(1),
                    }}>
                    <Text
                      style={[
                        textStyles.normalMedium,
                        { color: 'white', textAlign: 'center' },
                      ]}>
                      {loadingPendingBets
                        ? 'Loading Pending Games...'
                        : 'No Challenges Yet!'}
                    </Text>
                  </View>
                )
              }}
              renderItem={({ item, index }) => (
                <PendingBetComponent
                  betInfo={item}
                  key={index}
                  getAllPendingUserBets={getAllPendingUserBets}
                />
              )}
            />
          </View>
        </>
      )}
      {(profile == true || filteredPastBets?.length >= 1) && (
        <>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginVertical: heightPercentageToDP(2),
              marginHorizontal: heightPercentageToDP(2),
            }}>
            <Text style={styles.selectedText}>
              {'Past Challenges  '}
              <Icon
                type="FontAwesome"
                name="sort"
                size={widthPercentageToDP(4)}
                color={colors.offWhite}
                onPress={() => setPastSort(prev => !prev)}
              />
            </Text>
            {profile == false && (
              <Pressable onPress={() => handleButtonPress(3)}>
                <Text style={styles.seeAllText}>{'See all'}</Text>
              </Pressable>
            )}
          </View>

          <View style={{ width: '100%' }}>
            <FlatList
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              data={filteredPastBets.sort((a, b) => {
                const dateA = new Date(a.updatedAt)
                const dateB = new Date(b.updatedAt)
                return pastSort ? dateA - dateB : dateB - dateA // If pendingSort is true, sort ascending; if false, sort descending
              })}
              refreshing={loadingPastBets}
              style={{ width: '100%' }}
              initialNumToRender={3}
              maxToRenderPerBatch={2}
              ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
              ListEmptyComponent={() => {
                return (
                  <View
                    style={{
                      marginLeft: widthPercentageToDP(5),
                      marginVertical: heightPercentageToDP(1),
                    }}>
                    <Text
                      style={[
                        textStyles.normalMedium,
                        { color: 'white', textAlign: 'center' },
                      ]}>
                      {loadingPastBets ? 'Loading Past Games...' : 'No Challenges Yet!'}
                    </Text>
                  </View>
                )
              }}
              renderItem={({ item, index }) => (
                <PastBetComponent betInfo={item} key={index} />
              )}
            />
          </View>
        </>
      )}
    </VirtualizedView>
  )
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: colors.darkBackground },
  scrollView: {
    backgroundColor: colors.darkBackground,
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
      fontSize: actuatedNormalize(14),
      color: 'white',
    },
  ],
  unSelectedText: [
    textStyles.bigRegular,
    {
      fontSize: actuatedNormalize(14),
      color: 'gray',
    },
  ],
  seeAllText: [
    textStyles.bigRegular,
    {
      fontSize: actuatedNormalize(12),
      color: 'gray',
    },
  ],
  newText: [
    textStyles.bigRegular,
    {
      fontSize: actuatedNormalize(12),
      color: 'black',
    },
  ],
  buttonNew: {
    paddingHorizontal: widthPercentageToDP(10),
    paddingVertical: widthPercentageToDP(2),
    marginVertical: widthPercentageToDP(3),
    borderRadius: actuatedNormalize(5),
    borderColor: 'white',
    borderWidth: widthPercentageToDP(0.3),
    alignSelf: 'center',
    // backgroundColor:colors.lightBrown,
  },
  textButton: [
    textStyles.bigMedium,
    {
      fontSize: actuatedNormalize(13),
      color: 'white',
    },
  ],
})
export { Challenges }
