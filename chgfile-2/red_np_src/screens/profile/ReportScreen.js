import React, { useState } from 'react'
import { NavigationService } from '@navigation'
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Platform,
  ScrollView,
  TextInput,
} from 'react-native'
import {
  colors,
  heightPercentageToDP,
  widthPercentageToDP,
  textStyles,
  actuatedNormalize,
} from '@utils'
import { CustomButton, CustomButtonUnselected, Icon } from '@components'
import { useBlock, useReport } from '@hooks'

const ReportScreen = ({ route }) => {
  const [selectedOption, setSelectedOption] = useState('')
  const [selectedScreen, setSelectedScreen] = useState(1)
  const [description, setDescription] = useState('')

  const tags = ['Inappropriate Behavior', 'User Bio', 'Report Bugs']

  const { reportedUserId, doBlock } = route?.params

  const { isLoading,handleReport } = useReport()
  const { isLoading:blockLoading, handleReportAndBlock } = useBlock()
  const tagLoop = tags.map((key, index) => {
    return (
      <View style={{ alignItems: 'center' }} key={index}>
        {selectedOption.includes(key) ? (
          <CustomButton text={key} onPress={() => setSelectedOption(key)} />
        ) : (
          <CustomButtonUnselected
            purple
            text={key}
            onPress={() => setSelectedOption(key)}
          />
        )}
      </View>
    )
  })

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      backgroundColor={colors.darkBackground}
      contentContainerStyle={{
        paddingBottom: heightPercentageToDP(10),
      }}>
      {selectedScreen == 1 && (
        <>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: heightPercentageToDP(10),
            }}>
            <View style={{ flexDirection: 'row' }}>
              <Icon
                type="Ionicons"
                name="ios-chevron-back"
                size={actuatedNormalize(19)}
                color={colors.offWhite}
                style={{
                  marginLeft: widthPercentageToDP(5),
                  marginTop: heightPercentageToDP(1),
                }}
                onPress={() => {
                  NavigationService.goBack()
                }}
              />
              <Text
                style={[
                  textStyles.hugeBold,
                  {
                    color: 'white',
                    marginBottom: heightPercentageToDP(5),
                    marginLeft: widthPercentageToDP(3),
                  },
                ]}>
                1/2
              </Text>
            </View>

            <Text
              style={[
                textStyles.bigSemiBold,
                {
                  color: 'white',
                  marginBottom: heightPercentageToDP(2),
                  marginRight: widthPercentageToDP(5),
                },
              ]}>
              Report An Issue
            </Text>
          </View>

          <Text
            style={[
              textStyles.normalRegular,
              {
                color: 'white',
                marginBottom: heightPercentageToDP(5),
                marginLeft: widthPercentageToDP(5),
                marginRight: widthPercentageToDP(5),
              },
            ]}>
            We are very sorry you had an issue. Redvest is working hard to provide a safe
            space to our community. We will take care of it. Please select the issue.
          </Text>
          {tagLoop}
          <View style={{ alignSelf: 'center', marginTop: heightPercentageToDP(10) }}>
            <CustomButton
              text="Continue"
              primary
              shadow
              disabled={!selectedOption}
              onPress={() => {
                setSelectedScreen(2)
              }}
            />
          </View>
        </>
      )}

      {selectedScreen == 2 && (
        <>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: heightPercentageToDP(10),
            }}>
            <View style={{ flexDirection: 'row' }}>
              <Icon
                type="Ionicons"
                name="ios-chevron-back"
                size={actuatedNormalize(19)}
                color={colors.offWhite}
                style={{
                  marginTop: heightPercentageToDP(1),
                  marginLeft: widthPercentageToDP(5),
                }}
                onPress={() => setSelectedScreen(1)}
              />
              <Text
                style={[
                  textStyles.hugeBold,
                  {
                    color: 'white',
                    marginBottom: heightPercentageToDP(5),
                    marginLeft: widthPercentageToDP(3),
                  },
                ]}>
                2/2
              </Text>
            </View>

            <Text
              style={[
                textStyles.bigSemiBold,
                {
                  color: 'white',
                  marginBottom: heightPercentageToDP(2),
                  marginRight: widthPercentageToDP(5),
                },
              ]}>
              Report An Issue
            </Text>
          </View>

          <Text
            style={[
              textStyles.normalRegular,
              {
                color: 'white',
                marginBottom: heightPercentageToDP(5),
                marginLeft: widthPercentageToDP(5),
                marginRight: widthPercentageToDP(5),
              },
            ]}>
            We are very sorry you had an issue. Redvest is working hard to provide a safe
            space to our community. Please describe your issue.
          </Text>
          <View style={styles.textInputWrapper}>
            <TextInput
              textAlign="left"
              style={styles.textinputSyles}
              maxLength={100}
              multiline={true}
              placeholder={'Describe Your Issue'}
              placeholderTextColor={'gray'}
              value={description}
              onChangeText={setDescription}
            />
          </View>
          <View style={{ alignSelf: 'center', marginTop: heightPercentageToDP(10) }}>
            <CustomButton
              text="Finish"
              primary
              shadow
            loading={isLoading||blockLoading}
              disabled={!selectedOption}
              onPress={() => {
                doBlock
                  ? handleReportAndBlock(reportedUserId, selectedOption, description)
                  : handleReport(
                      reportedUserId,
                      selectedOption,
                      description,
                    )
              }}
            />
          </View>
        </>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  imagebg: {
    width: widthPercentageToDP(100),
    height: heightPercentageToDP(100),
    resizeMode: 'contain',
  },
  safearea: {
    flex: 1,
    alignItems: 'flex-start',
    marginTop: heightPercentageToDP(4),
    minHeight: Math.round(Dimensions.get('window').height / 2),
  },
  logo: {
    position: 'relative',
    left: widthPercentageToDP(2),
    top: heightPercentageToDP(2),
  },
  orContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: widthPercentageToDP(90),
  },
  orText: {
    color: 'grey',
    paddingHorizontal: widthPercentageToDP(4),
  },
  bottomButtons: {
    position: 'absolute',
    bottom: heightPercentageToDP(Platform.OS === 'ios' ? -2 : 2),
    flexDirection: 'column',
    width: 195,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textInputWrapper: {
    // justifyContent: 'center',
    // alignContent:'center',
    alignItems: 'flex-start',
    padding: heightPercentageToDP(2.5),
    alignSelf: 'center',
    backgroundColor: '#474747',
    width: widthPercentageToDP(90),
    height: heightPercentageToDP(25),
    borderRadius: heightPercentageToDP(Platform.isPad === true ? 0.5 : 1.5),
    marginTop: heightPercentageToDP(3),
  },
  textinputSyles: {
    color: 'white',
    fontSize: actuatedNormalize(15),
    fontFamily: 'DMSans-Medium',
    width: widthPercentageToDP(80),
  },
})

export { ReportScreen }
