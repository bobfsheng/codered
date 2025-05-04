import React, {useState} from 'react'
import { View, Text, StyleSheet, Pressable } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import {
  actuatedNormalize,
  colors,
  heightPercentageToDP,
  textStyles,
  widthPercentageToDP,
} from '@utils'
import { NavigationService } from '@navigation'


const CustomPositionAssetsThree = ({ position, containerStyle }) => {
  const [showModal, setShowModal] = useState(false)
  const [showInvestModal, setShowInvestModal] = useState(false)
  return (
    <>
    <LinearGradient
      colors={['black', 'black']}
      style={[styles.positionCard, containerStyle]}>
      <Pressable
        onPress={() =>
          NavigationService.navigate( 
         'ExplorePosition',{
            stockTicker: position?.symbol,
            amount: position?.qty,
            price: position?.avg_entry_price,
            side: position?.side,
            pl: position?.unrealized_pl,
            current_price: position?.current_price,
            daily_profit: position?.unrealized_intraday_pl,
            daily_profit_pr: position?.unrealized_intraday_plpc,
            cost: position?.cost_basis,
            market_value: position?.market_value,
            change_today: position?.change_today,
          })
          // setShowModal(true)
        }
        >
        <View
          style={{
            flexDirection: 'column',
            marginLeft: widthPercentageToDP(5),
          }}>
          <Text
            style={[
              textStyles.normalSemiBold,
              {
                color: 'white',
                fontSize: actuatedNormalize(17),
              },
            ]}>
            {position?.symbol}
          </Text>
          <Text
            style={[
              textStyles.normalRegular,
              {
                color: 'white',
                fontSize: actuatedNormalize(12),

                marginTop: heightPercentageToDP(1),
              },
            ]}>
            Qty {isNaN(position?.qty) || (position?.qty == null) ? '$ ' + parseFloat(position?.notional)?.toFixed(1) : parseFloat(position?.qty)?.toFixed(1)}
          </Text>
          <Text
            style={[
              textStyles.normalBold,
              {
                color: position?.unrealized_pl < 0 ? '#EB5757' : '#78C62A',
                fontSize: actuatedNormalize(13),
              },
            ]}>
            {`P&L $${parseFloat(position?.unrealized_pl)?.toFixed(2)}`}
          </Text>
          <Text
            style={[
              textStyles.normalRegular,
              {
                color: 'white',
                fontSize: actuatedNormalize(12),
              },
            ]}>
            {position?.side === 'long' ? 'Bought' : 'Short'} {'at $ '}
            {parseFloat(position?.avg_entry_price)?.toFixed(2)}
          </Text>
        </View>
      </Pressable>

      <View
        style={{
          flexDirection: 'column',
          marginRight: widthPercentageToDP(5),
          alignItems: 'space-around',
        }}>
        <View
          style={{
            marginTop: heightPercentageToDP(2),
            borderRadius: widthPercentageToDP(2),
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'white',
            height: heightPercentageToDP(4),
            width: widthPercentageToDP(20),
          }}>
          <Pressable
             onPress={() =>
              NavigationService.navigate( 'InvestScreenPosition',
                 {
                  stockTicker: position?.symbol,
                  amount: position?.side === 'long' ?  position?.qty : Math.abs(position?.qty),
                  price: position?.avg_entry_price,
                  side: position?.side,
                  pl: position?.unrealized_pl,
                },
              )

              // setShowInvestModal(true)
            }
            >
            <Text
              style={[
                textStyles.smallSemiBold,
                {
                  color: 'black',
                  fontSize: actuatedNormalize(15),
                },
              ]}>
              {position?.side === 'long' ? 'Sell' : 'Buy'}
            </Text>
          </Pressable>
        </View>
        <Text
          style={[
            textStyles.normalSemiBold,
            {
              color: 'white',
              fontSize: actuatedNormalize(12),
              marginTop: heightPercentageToDP(2),
              marginLeft: widthPercentageToDP(5),
            },
          ]}>
          Total $ {Math.abs((position?.qty * position?.avg_entry_price)?.toFixed(0))}
        </Text>
      </View>
    </LinearGradient>
    
       </>
  )
}
const styles = StyleSheet.create({
  positionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: heightPercentageToDP(15),
    width: widthPercentageToDP(80),
    borderRadius: heightPercentageToDP(1),
    borderWidth: widthPercentageToDP(0.5),
    borderColor: colors.primary,
    marginTop: heightPercentageToDP(1),
    marginHorizontal: widthPercentageToDP(1),
  },
})
export { CustomPositionAssetsThree }
