import { alpacaMarketApi } from './AlpacaMarket'
import { alpacaCryptoMarketApi } from './AlpacaCryptoMarket'
import {
  now,
  oneDayAgo,
  oneMonthAgo,
  fourDaysAgo,
  fiveDaysAgo,
  sixHoursAgo,
  oneWeekAgo,
  twelveMonthsAgo,
  oneHourAgo,
  oneYearAgo,
  fiveYearsAgo,
  twoDaysAgo,
  twentyFourHourAgo,
  twoHourAgo,
  threeHourAgo,
  fourHourAgo,
  fiveHourAgo,
  sevenDaysAgo,
  sevenHoursAgo,
} from '@utils'
import { rfc3339 } from '@utils'

const toRFC3339 = date => {
  function pad(n) {
    return n < 10 ? '0' + n : n
  }

  return (
    date.getUTCFullYear() +
    '-' +
    pad(date.getUTCMonth() + 1) +
    '-' +
    pad(date.getUTCDate()) +
    'T' +
    pad(date.getUTCHours()) +
    ':' +
    pad(date.getUTCMinutes()) +
    ':' +
    pad(date.getUTCSeconds()) +
    'Z'
  )
}

const getNews = async stockTicker => {
  const start = fiveDaysAgo
  const end = now
  const limit = 1
  // const sort =
  try {
    const response = await alpacaMarketApi.get(
      `v1beta1/news?start=${rfc3339(start)}&end=${rfc3339(
        end,
      )}&symbols=${stockTicker}&limit=${limit}&exclude_contentless=true&include_content=true`,
    )
    // console.log('ressss', response)
    if (response?.data) {
      return response?.data
    }
  } catch (error) {
    console.log('getNews => ', error)
  }
}

const getNewsMultiple = async stockTicker => {
  const start = fiveDaysAgo
  const end = now
  const limit = 10
  // const sort =
  try {
    const response = await alpacaMarketApi.get(
      `v1beta1/news?start=${rfc3339(start)}&end=${rfc3339(
        end,
      )}&limit=${limit}&exclude_contentless=true&include_content=true`,
    )
    // console.log('ressss', response)
    if (response?.data) {
      return response?.data
    }
  } catch (error) {
    console.log('getNewsMultiple==>', error)
  }
}

const getNewsGame = async stockTicker => {
  const start = oneYearAgo
  const end = now
  const limit = 3
  // const sort =
  try {
    const response = await alpacaMarketApi.get(
      `v1beta1/news?start=${rfc3339(start)}&end=${rfc3339(
        end,
      )}&symbols=${stockTicker}&limit=${limit}&exclude_contentless=true&include_content=true`,
    )
    // console.log('ressss', response)
    if (response?.data) {
      return response?.data
    }
  } catch (error) {
    console.log('getNewsMultipleGame==>', error)
  }
}

const getSPYBars = async stockTicker => {
  const start = toRFC3339(fiveDaysAgo)
  const end = toRFC3339(oneDayAgo)
  const timeframe = '1Day'
  const limit = 5

  try {
    const response = await alpacaMarketApi.get(
      `v2/stocks/${stockTicker}/bars?feed=iex&start=${start}&end=${end}&timeframe=${timeframe}&limit=${limit}`,
    )
    return response?.data
  } catch (error) {
    console.log('getBarsSPY error==>', error)
  }
}

const getBarGame = async stockTicker => {
  const start = fiveDaysAgo
  const end = now
  const timeframe = '1Day'
  const limit = 5

  try {
    const response = await alpacaMarketApi.get(
      `v2/stocks/${stockTicker}/bars?feed=iex&start=${rfc3339(start)}&end=${rfc3339(
        end,
      )}&timeframe=${timeframe}&limit=${limit}`,
    )
    if (response?.data) {
      return response?.data
    }
  } catch (error) {
    console.log('getBarsGame error==>', error)
  }
}

const getBar = async stockTicker => {
  const start = fiveDaysAgo
  const end = now
  const timeframe = '1Day'
  const limit = 5

  try {
    const response = await alpacaMarketApi.get(
      `v2/stocks/${stockTicker}/bars?feed=iex&start=${rfc3339(start)}&end=${rfc3339(
        end,
      )}&timeframe=${timeframe}&limit=${limit}`,
    )
    if (response?.data) {
      return response?.data
    }
  } catch (error) {
    console.log('getBarsH error==>', error)
  }
}

const getBarsH = async stockTicker => {
  const start = sevenHoursAgo
  const end = now
  const timeframe = '10Min'
  const limit = 6

  try {
    const response = await alpacaMarketApi.get(
      `v2/stocks/${stockTicker}/bars?feed=iex&start=${rfc3339(start)}&end=${rfc3339(
        end,
      )}&timeframe=${timeframe}&limit=${limit}`,
    )
    if (response?.data) {
      return response?.data
    }
  } catch (error) {
    console.log('getBarsH error==>', error)
  }
}
const getBarsD = async stockTicker => {
  const start = oneWeekAgo
  const end = now
  const timeframe = '3Hour'
  const limit = 60

  try {
    const response = await alpacaMarketApi.get(
      `v2/stocks/${stockTicker}/bars?feed=iex&start=${rfc3339(start)}&end=${rfc3339(
        end,
      )}&timeframe=${timeframe}&limit=${limit}`,
    )
    if (response?.data) {
      return response?.data
    }
  } catch (error) {
    console.log('getBarsD error==>', error)
  }
}
const getBarsW = async stockTicker => {
  const start = oneWeekAgo
  const end = now
  const timeframe = '1Day'
  const limit = 7

  try {
    const response = await alpacaMarketApi.get(
      `v2/stocks/${stockTicker}/bars?feed=iex&start=${rfc3339(start)}&end=${rfc3339(
        end,
      )}&timeframe=${timeframe}&limit=${limit}`,
    )
    if (response?.data) {
      return response?.data
    }
  } catch (error) {
    console.log('getBarsD error==>', error)
  }
}
const getBarsM = async stockTicker => {
  const start = oneMonthAgo
  const end = now
  const timeframe = '1Day'
  const limit = 33
  try {
    const response = await alpacaMarketApi.get(
      `v2/stocks/${stockTicker}/bars?feed=iex&start=${rfc3339(start)}&end=${rfc3339(
        end,
      )}&timeframe=${timeframe}&limit=${limit}`,
    )

    if (response?.data) {
      return response?.data
    }
  } catch (error) {
    console.log('getBarsM error==>', error)
  }
}
const getBarsMini = async stockTicker => {
  const start = oneWeekAgo
  const end = now
  const timeframe = '12Hour'
  const limit = 20
  try {
    const response = await alpacaMarketApi.get(
      `v2/stocks/${stockTicker}/bars?feed=iex&start=${rfc3339(start)}&end=${rfc3339(
        end,
      )}&timeframe=${timeframe}&limit=${limit}`,
    )

    if (response?.data) {
      return response?.data
    }
  } catch (error) {
    console.log('getBarsM error==>', error)
  }
}
const getBarsY = async stockTicker => {
  const start = oneYearAgo
  const end = sixHoursAgo
  const timeframe = '1Month'
  const limit = 12
  try {
    const response = await alpacaMarketApi.get(
      `v2/stocks/${stockTicker}/bars?feed=iex&start=${rfc3339(start)}&end=${rfc3339(
        end,
      )}&timeframe=${timeframe}&limit=${limit}`,
    )
    if (response?.data) {
      return response?.data
    }
  } catch (error) {
    console.log('getBarsY error==>', error)
  }
}
const getBarsA = async stockTicker => {
  const start = fiveYearsAgo
  const end = sixHoursAgo
  const timeframe = '1Month'
  const limit = 310

  try {
    const response = await alpacaMarketApi.get(
      `v2/stocks/${stockTicker}/bars?feed=iex&start=${rfc3339(start)}&end=${rfc3339(
        end,
      )}&timeframe=${timeframe}&limit=${limit}`,
    )
    if (response?.data) {
      return response?.data
    }
  } catch (error) {
    console.log('getBarsA error==>', error)
  }
}

const getCrypto = async stockTicker => {
  const start = fourDaysAgo
  const end = now
  const timeframe = '1Day'
  const limit = 5

  try {
    const response = await alpacaCryptoMarketApi.get(
      `bars?symbols=${stockTicker}&start=${rfc3339(start)}&end=${rfc3339(
        end,
      )}&timeframe=${timeframe}&limit=${limit}`,
    )
    if (response?.data) {
      // console.log(response.data,'heell')
      return response?.data
    }
  } catch (error) {
    console.log('getBarsH error==>', error)
  }
}

const getCryptoH = async stockTicker => {
  const start = sevenHoursAgo
  const end = sixHoursAgo
  const timeframe = '10Min'
  const limit = 6

  try {
    const response = await alpacaCryptoMarketApi.get(
      `bars?symbols=${stockTicker}&start=${rfc3339(start)}&end=${rfc3339(
        end,
      )}&timeframe=${timeframe}&limit=${limit}`,
    )
    if (response?.data) {
      return response?.data
    }
  } catch (error) {
    console.log('getBarsH error==>', error)
  }
}
const getCryptoD = async stockTicker => {
  const start = oneDayAgo
  const end = oneWeekAgo
  const timeframe = '3Hour'
  const limit = 60

  try {
    const response = await alpacaCryptoMarketApi.get(
      `bars?symbols=${stockTicker}&start=${rfc3339(start)}&end=${rfc3339(
        end,
      )}&timeframe=${timeframe}&limit=${limit}`,
    )
    if (response?.data) {
      return response?.data
    }
  } catch (error) {
    console.log('getBarsD error==>', error)
  }
}
const getCryptoW = async stockTicker => {
  const start = oneWeekAgo
  const end = now
  const timeframe = '1Day'
  const limit = 7

  try {
    const response = await alpacaCryptoMarketApi.get(
      `bars?symbols=${stockTicker}&start=${rfc3339(start)}&end=${rfc3339(
        end,
      )}&timeframe=${timeframe}&limit=${limit}`,
    )
    if (response?.data) {
      return response?.data
    }
  } catch (error) {
    console.log('getBarsD error==>', error)
  }
}
const getCryptoM = async stockTicker => {
  const start = oneMonthAgo
  const end = now
  const timeframe = '1Day'
  const limit = 33
  try {
    const response = await alpacaCryptoMarketApi.get(
      `bars?symbols=${stockTicker}&start=${rfc3339(start)}&end=${rfc3339(
        end,
      )}&timeframe=${timeframe}&limit=${limit}`,
    )

    if (response?.data) {
      return response?.data
    }
  } catch (error) {
    console.log('getBarsM error==>', error)
  }
}
const getCryptoMini = async stockTicker => {
  const start = oneMonthAgo
  const end = now
  const timeframe = '1Day'
  const limit = 30
  try {
    const response = await alpacaCryptoMarketApi.get(
      `bars?symbols=${stockTicker}&start=${rfc3339(start)}&end=${rfc3339(
        end,
      )}&timeframe=${timeframe}&limit=${limit}`,
    )

    if (response?.data) {
      return response?.data
    }
  } catch (error) {
    console.log('getBarsM error==>', error)
  }
}
const getCryptoY = async stockTicker => {
  const start = oneYearAgo
  const end = sixHoursAgo
  const timeframe = '1Month'
  const limit = 12
  try {
    const response = await alpacaCryptoMarketApi.get(
      `bars?symbols=${stockTicker}&start=${rfc3339(start)}&end=${rfc3339(
        end,
      )}&timeframe=${timeframe}&limit=${limit}`,
    )
    if (response?.data) {
      return response?.data
    }
  } catch (error) {
    console.log('getBarsY error==>', error)
  }
}
const getCryptoA = async stockTicker => {
  const start = fiveYearsAgo
  const end = sixHoursAgo
  const timeframe = '1Month'
  const limit = 250

  try {
    const response = await alpacaCryptoMarketApi.get(
      `bars?symbols=${stockTicker}&start=${rfc3339(start)}&end=${rfc3339(
        end,
      )}&timeframe=${timeframe}&limit=${limit}`,
    )
    if (response?.data) {
      return response?.data
    }
  } catch (error) {
    console.log('getBarsA error==>', error)
  }
}

export const getLastQuote = async stockTicker => {
  try {
    const response = await alpacaMarketApi.get(`v2/stocks/${stockTicker}/trades/latest`)
    if (response?.data) {
      return response?.data
    }
  } catch (error) {
    console.log('getLastQuote error==>', error)
    return Promise.reject(error)
  }
}
//Crypto
export const getLastQuoteCrypto = async stockTicker => {
  try {
    const response = await alpacaCryptoMarketApi.get(
      `latest/quotes?symbols=${stockTicker}`,
    )
    if (response?.data) {
      return response?.data
    }
  } catch (error) {
    console.log('getLastQuoteCrypto error==>', error)
    return Promise.reject(error)
  }
}

export {
  getNews,
  getNewsGame,
  getNewsMultiple,
  getBar,
  getBarsH,
  getBarsD,
  getBarsW,
  getBarsM,
  getBarsMini,
  getBarsY,
  getBarsA,
  getCrypto,
  getCryptoH,
  getCryptoD,
  getCryptoW,
  getCryptoM,
  getCryptoMini,
  getCryptoY,
  getCryptoA,
  getSPYBars,
}
