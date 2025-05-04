import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import {
  View,
  Platform
} from 'react-native'
import {
  Icon,
} from '@components'
import { NavigationService } from '@navigation'
import { widthPercentageToDP, heightPercentageToDP} from '@utils'

function CryptoIcon({ size = 18, color = '#A6CF87', ...props }) {
  return (
    <View>
      {Platform.OS == "android" ?
         <Icon
                type="Ionicons"
                name={'currency-btc'}
                size={heightPercentageToDP(3.3)}
                color={color}
                onPress={() => {
                  NavigationService.navigate('Invest',  { screen: 'EasyCryptoInvestScreen'})
                }}
                {...props}
              />
              :
              <Icon
              type="MaterialCommunityIcons"
              name={'currency-btc'}
              size={heightPercentageToDP(Platform.isPad !== true ?  3.3 : 2)}
              color={color}
              onPress={() => {
                NavigationService.navigate('Invest',  { screen: 'EasyCryptoInvestScreen'})
              }}
              {...props}
            />}
              </View>
    
  );
}

export default CryptoIcon;
