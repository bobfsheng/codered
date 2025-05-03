import React from 'react'
import { View, Text, StyleSheet, Pressable, Share } from 'react-native'
import {
  actuatedNormalize,
  colors,
  heightPercentageToDP,
  textStyles,
  widthPercentageToDP,
} from '@utils'
import { NavigationService } from '@navigation'
import { Icon } from '@components'
import dynamicLinks from '@react-native-firebase/dynamic-links'

const CustomPositionAssetsFour = ({ position }) => {
  //EXPLORE OR INVEST
  const onShare = async () => {
    try {
      const linkUrl = `https://redvest.app?stockticker=${position.symbol}&apn=app.redvest&isi=1609301338&ibi=com.redko.redvest`

      const link = await dynamicLinks().buildShortLink(
        {
          link: linkUrl,
          domainUriPrefix: 'https://redvest.page.link',
          android: {
            packageName: 'com.redko.redvest',
          },
        },
        dynamicLinks.ShortLinkType.SHORT,
      )
      const result = await Share.share({
        message: `Check out ${position.symbol} stock, my average entry is $ ${parseFloat(
          position?.avg_entry_price,
        )?.toFixed(2)} at a profit of $ ${parseFloat(position?.unrealized_pl)?.toFixed(
          2,
        )}. Current price is $ ${position?.current_price} per share!  ${link}`,
      })
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      console.log('error =>', error)
    }
  }
  return (
    <View style={styles.positionCard}>
      <Pressable
        onPress={() =>
          NavigationService.navigate('Invest', {
            screen: 'InvestScreenPosition',
            params: {
              stockTicker: position.symbol,
              amount: Math.abs(position.qty),
              price: position.avg_entry_price,
              side: position.side,
              pl: position.unrealized_pl,
              current_price: position.current_price,
              daily_profit: position.unrealized_intraday_pl,
              daily_profit_pr: position.unrealized_intraday_plpc,
              cost: position.cost_basis,
              market_value: position.market_value,
              change_today: position.change_today,
            },
          })
        }>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
          <View style={{ flexDirection: 'column', marginLeft: widthPercentageToDP(5) }}>
            <View style={{ flexDirection: 'row' }}>
              <Text
                style={[
                  textStyles.normalSemiBold,
                  {
                    color: colors.offWhite,
                    fontSize: actuatedNormalize(15),
                    marginLeft: widthPercentageToDP(0),
                  },
                ]}>
                {'You own '}
              </Text>
              <Text
                style={[
                  textStyles.normalSemiBold,
                  {
                    color: colors.offWhite,
                    textDecorationLine: 'underline',
                    fontSize: actuatedNormalize(15),
                    marginLeft: widthPercentageToDP(0),
                  },
                ]}>
                {parseFloat(position?.qty)?.toFixed(0)}
              </Text>
              <Text
                style={[
                  textStyles.normalSemiBold,
                  {
                    color: colors.offWhite,
                    fontSize: actuatedNormalize(13),
                    marginLeft: widthPercentageToDP(0),
                  },
                ]}>
                {' shares of '}
              </Text>
              <Text
                style={[
                  textStyles.normalSemiBold,
                  {
                    color: colors.offWhite,
                    textDecorationLine: 'underline',
                    fontSize: actuatedNormalize(15),
                    marginLeft: widthPercentageToDP(0),
                  },
                ]}>
                {position.symbol}
                {'  '}
              </Text>
              <Icon
                type="Feather"
                name="share"
                size={24}
                color="white"
                onPress={onShare}
              />
            </View>
            <View style={{ flexDirection: 'row' }}>
              <Text
                style={[
                  textStyles.normalRegular,
                  {
                    color: 'white',
                    fontSize: actuatedNormalize(14),
                    marginRight: widthPercentageToDP(0),
                  },
                ]}>
                {'Your profit is '}
              </Text>
              <Text
                style={[
                  textStyles.normalBold,
                  {
                    color: position.unrealized_pl < 0 ? '#EB5757' : '#78C62A',
                    textDecorationLine: 'underline',
                    fontSize: actuatedNormalize(14),
                    marginRight: widthPercentageToDP(0),
                  },
                ]}>
                ${parseFloat(position?.unrealized_pl)?.toFixed(2)}.
              </Text>
            </View>
            <Text
              style={[
                textStyles.normalRegular,
                {
                  color: colors.offWhite,
                  fontSize: actuatedNormalize(10),
                  marginRight: widthPercentageToDP(1),
                  marginTop: widthPercentageToDP(2),
                },
              ]}>
              You {position?.side === 'long' ? 'bought' : 'shorted'} at ${' '}
              {parseFloat(position?.avg_entry_price)?.toFixed(2)} per share and have total
              of ${Math.abs((position?.qty * position?.avg_entry_price)?.toFixed(0))}.
            </Text>
          </View>
        </View>
      </Pressable>
    </View>
  )
}
const styles = StyleSheet.create({
  positionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: heightPercentageToDP(15),
    width: widthPercentageToDP(90),
    borderRadius: heightPercentageToDP(1),
    borderWidth: widthPercentageToDP(0.15),
    borderColor: 'white',
    backgroundColor: '#1F1C1B',
    marginBottom: heightPercentageToDP(2),
  },
})
export { CustomPositionAssetsFour }
