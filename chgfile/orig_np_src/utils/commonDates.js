const now = new Date(new Date().setSeconds(new Date().getSeconds() - 0))
const fiftySecAgo = new Date(new Date().setSeconds(new Date().getSeconds() - 120))
const oneWeekAgo = new Date(new Date().setDate(new Date().getDate() - 7))
const twelweHoursAgo = new Date(new Date().setHours(new Date().getHours() - 12))
const oneHourAgo = new Date(new Date().setHours(new Date().getHours() - 1))
const twoHourAgo = new Date(new Date().setHours(new Date().getHours() - 2))
const threeHourAgo = new Date(new Date().setHours(new Date().getHours() - 3))
const fourHourAgo = new Date(new Date().setHours(new Date().getHours() - 4))
const fiveHourAgo = new Date(new Date().setHours(new Date().getHours() - 5))
const sixHoursAgo = new Date(new Date().setHours(new Date().getHours() - 6))
const sevenHoursAgo = new Date(new Date().setHours(new Date().getHours() - 7))
const eightHoursAgo = new Date(new Date().setHours(new Date().getHours() - 8))

const oneMonthAgo = new Date(new Date().setMonth(new Date().getMonth() - 1))
const twoMonthsAgo = new Date(new Date().setMonth(new Date().getMonth() - 2))
const threeMonthsAgo = new Date(new Date().setMonth(new Date().getMonth() - 3))
const fourMonthsAgo = new Date(new Date().setMonth(new Date().getMonth() - 4))
const fiveMonthsAgo = new Date(new Date().setMonth(new Date().getMonth() - 5))
const sixMonthsAgo = new Date(new Date().setMonth(new Date().getMonth() - 6))
const sevenMonthsAgo = new Date(new Date().setMonth(new Date().getMonth() - 7))
const eightMonthsAgo = new Date(new Date().setMonth(new Date().getMonth() - 8))
const nineMonthsAgo = new Date(new Date().setMonth(new Date().getMonth() - 9))
const tenMonthsAgo = new Date(new Date().setMonth(new Date().getMonth() - 10))
const elevenMonthsAgo = new Date(new Date().setMonth(new Date().getMonth() - 11))
const twelveMonthsAgo = new Date(new Date().setMonth(new Date().getMonth() - 12))

//common years

const nowYear = new Date(new Date().setFullYear(new Date().getFullYear()))
const oneYearAgo = new Date(new Date().setFullYear(new Date().getFullYear() - 1))
const twoYearsAgo = new Date(new Date().setFullYear(new Date().getFullYear() - 2))
const threeYearsAgo = new Date(new Date().setFullYear(new Date().getFullYear() - 3))
const fourYearsAgo = new Date(new Date().setFullYear(new Date().getFullYear() - 4))
const fiveYearsAgo = new Date(new Date().setFullYear(new Date().getFullYear() - 5))

//days ago

const fourDaysAgo = new Date(new Date().setDate(new Date().getDate() - 4))
const oneDayAgo = new Date(new Date().setDate(new Date().getDate() - 1))
const twoDaysAgo = new Date(new Date().setDate(new Date().getDate() - 2))
const threeDaysAgo = new Date(new Date().setDate(new Date().getDate() - 3))
const fiveDaysAgo = new Date(new Date().setDate(new Date().getDate() - 5))
const sixDaysAgo = new Date(new Date().setDate(new Date().getDate() - 6))
const sevenDaysAgo = new Date(new Date().setDate(new Date().getDate() - 7))

export {
  now,
  oneDayAgo,
  twoDaysAgo,
  threeDaysAgo,
  fiveDaysAgo,
  sixDaysAgo,
  sevenDaysAgo,
  fiftySecAgo,
  fourDaysAgo,
  oneMonthAgo,
  twoMonthsAgo,
  twelweHoursAgo,
  threeMonthsAgo,
  fourMonthsAgo,
  fiveMonthsAgo,
  sixMonthsAgo,
  sevenMonthsAgo,
  eightMonthsAgo,
  nineMonthsAgo,
  tenMonthsAgo,
  elevenMonthsAgo,
  twelveMonthsAgo,
  oneHourAgo,
  oneWeekAgo,
  fiveYearsAgo,
  fourYearsAgo,
  twoYearsAgo,
  threeYearsAgo,
  oneYearAgo,
  nowYear,
  sixHoursAgo,
  twoHourAgo,
  threeHourAgo,
  fourHourAgo,
  fiveHourAgo,
  sevenHoursAgo,
  eightHoursAgo,
}
