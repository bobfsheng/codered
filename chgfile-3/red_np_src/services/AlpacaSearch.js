import { getAccessToken } from '@utils'
import axios from 'axios'
const alpacaSearchApi = axios.create({
  baseURL: 'https://paper-api.alpaca.markets',
  timeout: 10000,
})
const ResponseInterceptor = response => {
  return response
}
const RequestInterceptor = async config => {
  const token = await getAccessToken()
  if (config && config.headers) {
    if (token?.length > 1 ) {
      config.headers.common['authorization'] = `Bearer ${token}`
    } else {
      config.headers.common[
        'authorization'
      ] = `Bearer b9931002-9296-40bf-b412-9d8f43bf2ba8`
    }
  }
  return config
}
alpacaSearchApi.interceptors.request.use(RequestInterceptor)
alpacaSearchApi.interceptors.response.use(ResponseInterceptor, error => {
  const errorResponse = {
    url: error?.response?.request?.responseURL,
    message: error?.response?.data?.message,
  }
  // console.log('alpacaApi =>', errorResponse)
  if (error.response) {
    return Promise.reject(error.response.data.message)
  }
})
export { alpacaSearchApi }
