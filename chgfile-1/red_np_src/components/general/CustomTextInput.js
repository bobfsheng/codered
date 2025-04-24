import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from 'react-native'
import { Controller } from 'react-hook-form'
import { colors, heightPercentageToDP, textStyles, widthPercentageToDP } from '@utils'
import { CustomInputLabel } from './CustomInputLabel'
import { Icon } from '@components'

// control and errors are passed from the useForm hook of the react-hook-form package
// const { control, handleSubmit, errors } = useForm();

const CustomTextInput = ({
  control,
  errors,
  input = {
    name: 'unknown-text-input',
    label: '',
    placeholder: '',
    defaultValue: '',
  },
  rules = {
    contentType: 'none',
    keyboardType: 'default',
    autoCapitalize: true,
    autoCorrect: true,
    autoFocus: false,
    secureTextEntry: false,
  },
  forgotPassword = false,
  optional = false,
  icon = rules.secureTextEntry,
  ...inputProps
}) => {
  const [focus, setFocus] = useState(rules.autoFocus)
  const [secure, setSecure] = useState(rules.secureTextEntry)
  const error = errors?.[input.name]

  const iconToRender = () => {
    if (rules.secureTextEntry) {
      return {
        component: () => (
          <Icon
            type="Ionicons"
            name={secure ? 'ios-eye-outline' : 'ios-eye-off-outline'}
            size={heightPercentageToDP(3.5)}
            color={colors.offBlack}
            onPress={() => setSecure(prev => !prev)}
          />
        ),
        function: () => setSecure(prev => !prev),
      }
    } else return icon
  }
  return (
    <View style={styles.container}>
      <CustomInputLabel
        text={input.label}
        optional={optional}
        textStyle={inputProps.textStyle}
      />
      <Controller
        control={control}
        name={input.name}
        defaultValue={input.defaultValue}
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={[styles.inputContainer]}>
            <TextInput
              style={[
                textStyles.normalRegular,
                styles.input,
                icon && styles.inputWithIcon,
                focus && styles.inputFocused,
                error && { borderColor: colors.redError },
              ]}
              keyboardAppearance={'dark'}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder={input.placeholder}
              textContentType={rules.contentType}
              keyboardType={rules.keyboardType}
              autoCapitalize={rules.autoCapitalize}
              autoCorrect={rules.autoCorrect}
              autoFocus={rules.autoFocus}
              onFocus={() => setFocus(true)}
              secureTextEntry={secure}
              {...inputProps}
            />
            {icon && (
              <Pressable style={styles.icon}>{iconToRender().component}</Pressable>
            )}
          </View>
        )}
      />
      {
        <View style={[styles.barBelowInput, styles.marginOffset]}>
          <Text style={[textStyles.smallRegular, styles.error]}>
            {error ? error.message : ' '}
          </Text>
          <View>
            {forgotPassword && (
              <Pressable onPress={forgotPassword} style={styles.forgotPassword}>
                {
                  <Text style={[textStyles.normalRegular, { color: colors.primary }]}>
                    Forgot password
                  </Text>
                }
              </Pressable>
            )}
          </View>
        </View>
      }
    </View>
  )
}

export function EmailInput({
  control,
  errors,
  input = {
    name: 'email',
    label: 'Email',
    placeholder: '',
    defaultValue: '',
  },
  ...inputProps
}) {
  return (
    <CustomTextInput
      control={control}
      errors={errors}
      input={{
        name: input.name,
        label: input.label,
        placeholder: input.placeholder,
        defaultValue: input.defaultValue,
      }}
      rules={{
        contentType: 'emailAddress',
        keyboardType: 'email-address',
        autoCapitalize: 'none',
        autoCorrect: false,
        textContentType:'username',
        autoCompleteType:'email'
      }}
      {...inputProps}
    />
  )
}

export function UserNameInput({
  control,
  errors,
  input = {
    name: 'username',
    label: 'Username',
    placeholder: '',
    defaultValue: '',
  },
  ...inputProps
}) {
  return (
    <CustomTextInput
      control={control}
      errors={errors}
      input={{
        name: input.name,
        label: input.label,
        placeholder: input.placeholder,
        defaultValue: input.defaultValue,
      }}
      rules={{
        // contentType: 'emailAddress',
        // keyboardType: 'email-address',
        autoCapitalize: 'none',
        autoCorrect: false,
      }}
      {...inputProps}
    />
  )
}

export function SecretCodeInput({
  control,
  errors,
  input = {
    name: 'secretCode',
    label: 'Secret Code',
    placeholder: '',
    defaultValue: '',
  },
  ...inputProps
}) {
  return (
    <CustomTextInput
      control={control}
      errors={errors}
      input={{
        name: input.name,
        label: input.label,
        placeholder: input.placeholder,
        defaultValue: input.defaultValue,
      }}
      rules={{
        // contentType: 'emailAddress',
        // keyboardType: 'email-address',
        // autoCapitalize: true,
        autoCorrect: false,
      }}
      {...inputProps}
    />
  )
}

export function PasswordInput({
  control,
  errors,
  isSignUp = false,
  input = {
    name: 'password',
    label: 'Password',
    placeholder: '',
    defaultValue: '',
  },
  forgotPassword,
  ...inputProps
}) {
  return (
    <CustomTextInput
      control={control}
      errors={errors}
      input={{
        name: input.name,
        label: input.label,
        placeholder: input.placeholder,
        defaultValue: input.defaultValue,
      }}
      rules={{
        contentType: 'password',
        keyboardType: 'default',
        autoCapitalize: 'none',
        autoCorrect: false,
        secureTextEntry: true,
        autoCompleteType: 'password',
        textContentType: isSignUp ? 'newPassword' : 'password', // adjust based on the prop
      }}
      forgotPassword={forgotPassword}
      {...inputProps}
    />
  )
}

const styles = StyleSheet.create({
  container: {
    width: '90%',
  },
  inputContainer: {
    marginTop: heightPercentageToDP(0.5),
    marginBottom: heightPercentageToDP(0.3),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    color: colors.offBlack,
    paddingRight: 20,
    paddingLeft: 20,
    borderRadius: heightPercentageToDP(0.5),
    borderWidth: 1,
    borderColor: 'white',
    backgroundColor: 'rgba(255,255,255,0.8)',
    height: heightPercentageToDP(6.5),
  },
  inputWithIcon: {
    paddingRight: 60,
  },
  inputFocused: {
    backgroundColor: colors.offWhite,
    borderColor: colors.primary,
  },
  icon: {
    position: 'absolute',
    right: 15,
  },
  barBelowInput: {
    marginTop: -10,
    marginBottom: -18,
    width: widthPercentageToDP(88),
    height: 50,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  error: {
    color: colors.redError,
    marginTop: 10,
  },
  forgotPassword: {
    color: colors.primary,
    marginTop: heightPercentageToDP(1.5),
    paddingLeft: widthPercentageToDP(4),
  },
  marginOffset: {
    marginHorizontal: widthPercentageToDP(1),
  },
})

export { CustomTextInput }
