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
import { CustomButton, CustomButtonUnselected, Icon, SearchBar } from '@components'
import { useBlock, useReport } from '@hooks'
import { collegeArray } from '@constants'

const OrgSubmission = ({ route }) => {
  const [selectedOption, setSelectedOption] = useState('')
  const [selectedScreen, setSelectedScreen] = useState(1)
  const [organizationName, setOrganizationName] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [title, setTitle] = useState('')
  const [emailExtension, setEmailExtension] = useState('')

  const tags = ['Inappropriate Behavior', 'User Bio', 'Report Bugs']

  // const { reportedUserId, doBlock } = route?.params

  const { isLoading, handleReport } = useReport()
  const { isLoading: blockLoading, handleReportAndBlock } = useBlock()
  const tagLoop = tags.map((key, index) => {
    return (
      <View style={{ alignItems: 'center'}} key={index}>
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

  console.log({selectedOption})
  return (
    // <ScrollView
    //   showsVerticalScrollIndicator={false}
    //   backgroundColor={colors.darkBackground}
    //   contentContainerStyle={{
    //     paddingBottom: heightPercentageToDP(10),
    //   }}>
    <View backgroundColor={colors.darkBackground} style={{ height: '100%' }}>
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
                1/4
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
              Submit Your Organization
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
            We are excited you want . Anyone with your organizations email (eg:
            @redvest.app) extension will be a part of the competition.
          </Text>
          <SearchBar
            data={collegeArray}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
          {searchTerm === 'Other...' && (
            <View style={styles.textInputWrapper}>
              <TextInput
                textAlign="left"
                style={styles.textinputSyles}
                maxLength={100}
                multiline={true}
                placeholder={'Enter your organization name'}
                placeholderTextColor={'gray'}
                value={organizationName}
                onChangeText={setOrganizationName}
              />
            </View>
          )}
          {/* {tagLoop} */}
          <View
            style={{
              alignSelf: 'center',
              marginTop: heightPercentageToDP(70),
              position: 'absolute',
            }}>
            <CustomButton
              text="Continue"
              primary
              shadow
              disabled={!searchTerm}
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
                2/4
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
            Enter the email extension for your organization. Anyone with your
            organizations email (eg: @example.org) extension will be a part of the
            competition.
          </Text>
          <View style={styles.textInputWrapper}>
            <TextInput
              textAlign="left"
              style={styles.textinputSyles}
              maxLength={100}
              multiline={true}
              placeholder={'@example.org'}
              placeholderTextColor={'gray'}
              value={organizationName}
              onChangeText={setOrganizationName}
            />
          </View>
          <View
            style={{
              alignSelf: 'center',
              marginTop: heightPercentageToDP(70),
              position: 'absolute',
            }}>
            <CustomButton
              text="Continue"
              primary
              shadow
              disabled={!organizationName}
              onPress={() => {
                setSelectedScreen(3)
              }}
            />
          </View>
        </>
      )}
      {selectedScreen == 3 && (
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
                onPress={() => setSelectedScreen(2)}
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
                3/4
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
            ]}></Text>
          <View style={styles.textInputWrapper}>
            <TextInput
              textAlign="left"
              style={styles.textinputSyles}
              maxLength={100}
              multiline={true}
              placeholder={'First Name'}
              placeholderTextColor={'gray'}
              value={firstName}
              onChangeText={setFirstName}
            />
          </View>
          <View style={styles.textInputWrapper}>
            <TextInput
              textAlign="left"
              style={styles.textinputSyles}
              maxLength={100}
              multiline={true}
              placeholder={'Last Name'}
              placeholderTextColor={'gray'}
              value={lastName}
              onChangeText={setLastName}
            />
          </View>
          <View style={styles.textInputWrapper}>
            <TextInput
              textAlign="left"
              style={styles.textinputSyles}
              maxLength={100}
              multiline={true}
              placeholder={'Email'}
              placeholderTextColor={'gray'}
              value={email}
              onChangeText={setEmail}
            />
          </View>
          <View style={styles.textInputWrapper}>
            <TextInput
              textAlign="left"
              style={styles.textinputSyles}
              maxLength={100}
              multiline={true}
              placeholder={'Phone'}
              placeholderTextColor={'gray'}
              value={phone}
              onChangeText={setPhone}
            />
          </View>
          <View style={styles.textInputWrapper}>
            <TextInput
              textAlign="left"
              style={styles.textinputSyles}
              maxLength={100}
              multiline={true}
              placeholder={'Title'}
              placeholderTextColor={'gray'}
              value={title}
              onChangeText={setTitle}
            />
          </View>
          <View style={{ alignSelf: 'center', marginTop: heightPercentageToDP(0) }}>
            <CustomButton
              text="Continue"
              primary
              shadow
              loading={isLoading || blockLoading}
              disabled={!firstName || !lastName || !email}
              onPress={() => {
                setSelectedScreen(4)
              }}
              // onPress={() => {
              //   doBlock
              //     ? handleReportAndBlock(reportedUserId, selectedOption, organizationName)
              //     : handleReport(reportedUserId, selectedOption, organizationName)
              // }}
            />
          </View>
        </>
      )}
      {selectedScreen == 4 && (
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
                onPress={() => setSelectedScreen(2)}
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
                4/4
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
              Time
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
            ]}></Text>
          <View style={styles.textInputWrapper}>
            <TextInput
              textAlign="left"
              style={styles.textinputSyles}
              maxLength={100}
              multiline={true}
              placeholder={'First Name'}
              placeholderTextColor={'gray'}
              value={firstName}
              onChangeText={setFirstName}
            />
          </View>
          <View style={styles.textInputWrapper}>
            <TextInput
              textAlign="left"
              style={styles.textinputSyles}
              maxLength={100}
              multiline={true}
              placeholder={'Last Name'}
              placeholderTextColor={'gray'}
              value={lastName}
              onChangeText={setLastName}
            />
          </View>
          <View style={styles.textInputWrapper}>
            <TextInput
              textAlign="left"
              style={styles.textinputSyles}
              maxLength={100}
              multiline={true}
              placeholder={'Email'}
              placeholderTextColor={'gray'}
              value={email}
              onChangeText={setEmail}
            />
          </View>
          <View style={styles.textInputWrapper}>
            <TextInput
              textAlign="left"
              style={styles.textinputSyles}
              maxLength={100}
              multiline={true}
              placeholder={'Phone'}
              placeholderTextColor={'gray'}
              value={phone}
              onChangeText={setPhone}
            />
          </View>
          <View style={styles.textInputWrapper}>
            <TextInput
              textAlign="left"
              style={styles.textinputSyles}
              maxLength={100}
              multiline={true}
              placeholder={'Title'}
              placeholderTextColor={'gray'}
              value={title}
              onChangeText={setTitle}
            />
          </View>
          <View style={{ alignSelf: 'center', marginTop: heightPercentageToDP(0) }}>
            <CustomButton
              text="Finish"
              primary
              shadow
              loading={isLoading || blockLoading}
              disabled={!firstName || !lastName || !email}
              onPress={() => {
                doBlock
                  ? handleReportAndBlock(reportedUserId, selectedOption, organizationName)
                  : handleReport(reportedUserId, selectedOption, organizationName)
              }}
            />
          </View>
        </>
      )}
    </View>
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
    // alignItems: 'flex-start',
    // padding: heightPercentageToDP(2.5),
    // alignSelf: 'center',
    // backgroundColor: '#474747',
    // width: widthPercentageToDP(90),
    // height: heightPercentageToDP(15),
    // borderRadius: heightPercentageToDP(Platform.isPad === true ? 0.5 : 1.5),
    // marginTop: heightPercentageToDP(3),
    borderColor: 'white',
    borderRadius: heightPercentageToDP(20),
    color: 'white',
    borderWidth: 1,
    marginBottom: heightPercentageToDP(2),
    paddingHorizontal: widthPercentageToDP(10),
    marginHorizontal: widthPercentageToDP(5),
    paddingVertical: heightPercentageToDP(2),
  },
  textinputSyles: [
    textStyles.normalRegular,
    {
      // width: '70%',
      // height: '100%',
      color: colors.white,
      fontSize: actuatedNormalize(11),
    },
  ],
})

export { OrgSubmission }
