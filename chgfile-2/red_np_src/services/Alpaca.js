import { getAccessToken } from '@utils'
import axios from 'axios'
const alpacaApi = axios.create({
  baseURL: 'https://paper-api.alpaca.markets',
  timeout: 10000,
})
const ResponseInterceptor = response => {
  return response
}
const RequestInterceptor = async config => {
  const token = await getAccessToken()
  if (config && config.headers) {
    if (token) {
      config.headers.common['authorization'] = `Bearer ${token}`
    } else {
      config.headers.common['authorization'] = `Bearer ${token}`
    }
  }
  return config
}
alpacaApi.interceptors.request.use(RequestInterceptor)
alpacaApi.interceptors.response.use(ResponseInterceptor, error => {
  const errorResponse = {
    url: error?.response?.request?.responseURL,
    message: error?.response?.data?.message,
  }
  console.log('alpacaApi =>', errorResponse)
  if (error.response) {
    return Promise.reject(error.response.data.message)
  }
})
export { alpacaApi }
