import React from 'react'
import { StyleSheet, View, Text, RefreshControl, FlatList, Pressable } from 'react-native'
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
} from '@components'
import { NavigationService } from '@navigation'
import { useGetAllBettings } from '../../hooks/profile/Betting/useGetAllBettings'

const ChallengesGame = ({ }) => {
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
 
  return (
    <VirtualizedView
      style={styles.scrollView}
      showsVerticalScrollIndicator={false}
      nestedScrollEnabled={true}
      contentContainerStyle={{ paddingHorizontal: widthPercentageToDP(2) }}
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
                { marginTop: heightPercentageToDP( 0.4) },
              ]}>
              {'Active Challenges'}
            </Text>
         
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
                onPress={() => NavigationService.navigate('Games', { screen: 'Compete' })}>
                <Text style={styles.newText}>{'New +'}</Text>
              </Pressable>
      
          </View>
          <View style={{ width: '100%' }}>
            <FlatList
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              data={filteredCurrentBets}
              refreshing={loadingCurrentBets}
              style={{ width: '100%' }}
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
    
    
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginVertical: heightPercentageToDP(2),
              marginHorizontal: heightPercentageToDP(2),
            }}>
            <Text style={styles.selectedText}>{'Pending Challenges'}</Text>
          </View>
          <View style={{ width: '100%' }}>
            <FlatList
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              data={filteredPendingBets}
              refreshing={loadingPendingBets}
              style={{ width: '100%' }}
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
   

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginVertical: heightPercentageToDP(2),
              marginHorizontal: heightPercentageToDP(2),
            }}>
            <Text style={styles.selectedText}>{'Past Challenges'}</Text>
       
          </View>

          <View style={{ width: '100%' }}>
            <FlatList
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              // data={filteredPastBets}
              data={filteredPastBets.sort((a, b) => {
                const dateA = new Date(a.updatedAt);
                const dateB = new Date(b.updatedAt);
                return dateB - dateA; // Reverse the comparison for descending order
              })}
              refreshing={loadingPastBets}
              style={{ width: '100%' }}
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
    
    </VirtualizedView>
  )
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: colors.darkBackground },
  scrollView: {
    backgroundColor: colors.darkBackground,
    marginBottom: heightPercentageToDP(4),
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
export { ChallengesGame }
