// TopBar.js
import React from 'react'
import { Text, View, Platform, StyleSheet } from 'react-native'
import { BackChevron, Icon } from '@components'
import { NavigationService } from '@navigation'
import { textStyles, widthPercentageToDP, heightPercentageToDP, actuatedNormalize } from '@utils'
import CoinIcon from '@assets/icons/CoinIcon'

const TopBar = ({
  score,
  currentQuestionIndex,
  showCategory,
  handleGoBackToCategories,
}) => {
  return (
    <>
      {showCategory == true && (
        <View style={styles.topBarBackChevron}>
          <BackChevron />
        </View>
      )}
      {showCategory == false && (
        <View style={styles.topBarBackChevron}>
          {currentQuestionIndex > 0 ? (
            <BackChevron onPress={() => NavigationService.navigate('Game')} />
          ) : (
            <BackChevron />
          )}
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
            <CoinIcon size={widthPercentageToDP(10)} />
            <Text
              style={[
                textStyles.normalBold,
                {
                  color: 'white',
                  marginTop: heightPercentageToDP(0.6),
                  fontSize: actuatedNormalize(17),
                },
              ]}>
              {' '}
            ${score}
            </Text>
          </View>
        </View>
      )}
    </>
  )
}

const styles = {
  topBarBackChevron: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginRight: widthPercentageToDP(5),
    marginTop: heightPercentageToDP(7),
    marginLeft: widthPercentageToDP(2),
  },
}

export { TopBar }
