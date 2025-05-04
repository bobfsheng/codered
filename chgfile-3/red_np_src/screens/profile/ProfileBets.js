import React from 'react'
import { FlatList, StyleSheet, Text, View } from 'react-native'
import { actuatedNormalize, heightPercentageToDP,widthPercentageToDP, textStyles } from '@utils'
import { useGetBettings } from '../../hooks/profile/Betting/useGetBettings'
import { ActiveBetComponent, PastBetComponent } from '@components'

const ProfileBets = ({ friend }) => {
  const { currentBet, pastBets, loadingCurrentBets, loadingPastBets } = useGetBettings({
    friend,
  })

  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginVertical: heightPercentageToDP(2),
          marginHorizontal: heightPercentageToDP(2),
        }}>
        <Text style={styles.selectedText}>{'Active Challenges'}</Text>
      </View>

      {currentBet?.length > 0 ? (
        <ActiveBetComponent betInfo={currentBet[0]} />
      ) : (
        <View style={{marginLeft:widthPercentageToDP(5),marginVertical:heightPercentageToDP(1)}}>
          <Text
            style={[textStyles.normalMedium, { color: 'white', textAlign: 'center' }]}>
            {loadingCurrentBets ? 'Loading Past Games...' : 'No Challenges Yet!'}
          </Text>
        </View>
      )}
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
          data={pastBets}
          style={{ width: '100%' }}
          ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
          ListEmptyComponent={() => {
            return (
              <View style={{marginLeft:widthPercentageToDP(5),marginVertical:heightPercentageToDP(1)}}>
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
    </View>
  )
}

const styles = StyleSheet.create({
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
})
export { ProfileBets }
