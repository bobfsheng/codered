import * as yup from 'yup'

// export const ORDER_SIDE_SCHEMA = yup.object().shape({
//   orderSide: yup.string().required("You must enter a order type"),
// });
export const STOCK_TICKER_SCHEMA = yup.object().shape({
  stockTicker: yup
    .string()
    .test('stock ticker', 'invalid stock ticker', function (value) {
      return value !== undefined
    }),
})

export const QUANTITY_SCHEMA = yup.object().shape({
  orderQuantity: yup.number().min(1).required(),
})
export const ORDER_TYPE_SCHEMA = yup.object().shape({
  orderType: yup.string().test('order type', 'invalid order type', function (value) {
    return value != null
  }),
})
// export const STOP_LOSS_SCHEMA = yup.object().shape({
//   stopLoss: yup
en
//  .string()
//     .when('preferredContact', {
//         is: 'Phone',
//         then: yup.string()
//           .required('Phone number is required.')
//     })

// export const STOP_LOSS_SCHEMA = yup.object().shape({
//   stopLoss: yup
//     .string()
//     // .test("time in force", "invalied time in force", function (value) {
//     //   //console.log(value);
//     //   return stopLoss !== undefined;
//     // }),
// });

// export
export const TIME_IN_FORCE_SCHEMA = yup.object().shape({
  timeInForce: yup
    .string()
    .test('time in force', 'invalid time in force', function (value) {
      return value != null
    }),
})

export const INVEST_SCHEMA = yup.object().shape({
  //   //   ...ORDER_SIDE_SCHEMA.fields,
  ...STOCK_TICKER_SCHEMA.fields,
  ...QUANTITY_SCHEMA.fields,
  //   ...STOP_LOSS_SCHEMA.fields,
})
