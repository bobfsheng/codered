import * as yup from 'yup'

const EMAIL_SCHEMA = yup.object().shape({
  email: yup
    .string()
    .required('You must enter an email.')
    .email('Please enter a valid email address.'),
})

const PASSWORD_SCHEMA = yup.object().shape({
  password: yup
    .string()
    .required('You must enter a password.')
    .min(6, 'Password is too short.'),
})

const CONFIRM_PASSWORD_SCHEMA = yup.object().shape({
  'confirm-password': yup
    .string()
    .required('You must enter a password.')
    .min(6, 'Password is too short.')
    .test('passwords-match', 'Passwords must match.', function (value) {
      return this.parent.password === value
    }),
})

const SIGNIN_SCHEMA = yup.object().shape({
  ...EMAIL_SCHEMA.fields,
  ...PASSWORD_SCHEMA.fields,
})

const SIGNUP_SCHEMA = yup.object().shape({
  ...EMAIL_SCHEMA.fields,
  ...PASSWORD_SCHEMA.fields,
  ...CONFIRM_PASSWORD_SCHEMA.fields,
})

export {
  EMAIL_SCHEMA,
  PASSWORD_SCHEMA,
  CONFIRM_PASSWORD_SCHEMA,
  SIGNIN_SCHEMA,
  SIGNUP_SCHEMA,
}
