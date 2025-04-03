import axios from 'axios'
import { getAccessToken } from '@utils'

const alpacaMarketApi = axios.create({
  baseURL: 'https://data.alpaca.markets/',
  timeout: 10000,
})
const ResponseInterceptor = response => {
  return response
}
const RequestInterceptor = async config => {
  const token = await getAccessToken()
  if (config && config.headers) {
    if (token?.length > 1) {
      config.headers.common['authorization'] = `Bearer ${token}`
    } else {
      config.headers = {
        'APCA-API-KEY-ID': 'PKE40ISTUJ7SM6JVJJOJ',
        'APCA-API-SECRET-KEY': '81nCxRNtdisEyIk7QVZUidiGIGelFejwpPrnFsOI',
      }
      // config.headers.common['authorization'] = `Bearer b9931002-9296-40bf-b412-9d8f43bf2ba8`
    }
  }
  return config
}
alpacaMarketApi.interceptors.request.use(RequestInterceptor)
alpacaMarketApi.interceptors.response.use(ResponseInterceptor, error => {
  const errorResponse = {
    url: error?.response?.request?.responseURL,
    message: error?.response?.data?.message,
  }
  console.log('alpacaMarketApi =>', errorResponse)
  if (error.response) {
    return Promise.reject(error.response.data.message)
  }
})
export { alpacaMarketApi }
