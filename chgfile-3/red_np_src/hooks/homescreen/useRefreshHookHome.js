import React, {  useState } from 'react'
import {
  getAccountHistory,
  getAccountOrders,
  getAccountPortfolio,
  getAccountPositions,
  getMarketStatus,
  useAuthSelector,
  useReduxDispatch,
} from '@store'
import axios from 'axios'
import { getNewsMultiple } from '@services'

const alpacaMarketApi = axios.create({
  baseURL: 'https://paper-api.alpaca.markets/',
  headers: {
    Authorization: `Bearer d674ec3c-077b-41c3-b712-3b17d997079d`,
    // Authorization: `Bearer e696245a-6332-40b3-89fb-1b587ba2e53e`,
  },
})
const alpacaMarketApiSlide = axios.create({
  baseURL: 'https://paper-api.alpaca.markets/',
  headers: {
    Authorization: `Bearer 66acd27f-cdfa-4430-8e21-267875a43d58`,
  },
})
const alpacaMarketApiRow = axios.create({
  baseURL: 'https://paper-api.alpaca.markets/',
  headers: {
    // Authorization: `Bearer d674ec3c-077b-41c3-b712-3b17d997079d`,
    // config.headers = {
    'APCA-API-KEY-ID': 'PKI4FE040C9SF0UEI6QS',
    'APCA-API-SECRET-KEY': '5aEKhKeebyYk3hV0R14B0xZiBHAanDRAZg27m2QT',
  },
})

function useRefreshHookHome() {
  const [refreshing, setRefreshing] = useState(false)
  const dispatch = useReduxDispatch()
  const { isLoggedIn, alpacaToken } = useAuthSelector(state => state)
  const [positionsExplore, setPositionsExplore] = useState(null)
  const [positionsExploreRow, setPositionsExploreRow] = useState(null)
  const [positionsExploreSlide, setPositionsExploreSlide] = useState(null)

  const [newsAuthor, setNewsAuthor] = useState('')
  const [newsHeadline, setNewsHeadline] = useState('')
  const [newsSymbols, setNewsSymbols] = useState('')
  const [newsImageURL, setNewsImageURL] = useState('')
  const [newsURL, setNewsURL] = useState('')
  const [newsDate, setNewsDate] = useState('')
  const [newsImages, setNewsImages] = useState('')
  const [newsSource, setNewsSource] = useState('')
  const [newsContent, setNewsContent] = useState('')
  const [newsSummary, setNewsSummary] = useState('')
  const [newsArray, setNewsArray] = useState('')


  const getNewsHandle = React.useCallback(async () => {
    const response = await getNewsMultiple('AAPL')
    // console.log(response, 'newsss')
    
    let findByKey = (arr, key) => {
      if (!Array.isArray(arr)) {
        return undefined; // or throw an error if appropriate
      }
      
      return (arr?.find(ele => key in ele) || {})[key];
    }
    Object.keys(response).forEach(function(key, index) {
     
      // console.log('kkkk', response[key])
    });
    
    // console.log(response.news,"zzauthor")
    if (response) {
      setNewsArray(response.news)
      setNewsAuthor(findByKey(response.news,"author"))
      setNewsHeadline(findByKey(response.news,"headline"))
      setNewsImages(findByKey(response.news,"images"))
      setNewsDate(findByKey(response.news,"created_at"))
      setNewsURL(findByKey(response.news,"url"))
      setNewsDate(findByKey(response.news,"updated_at"))
      setNewsSource(findByKey(response.news,"source"))
      setNewsSummary(findByKey(response.news,"summary"))
      setNewsSymbols(findByKey(response.news,"symbols"))
      setNewsImageURL((findByKey(newsImages,"url")))
      setNewsContent((findByKey(response.news,"content")))
      // console.log((findByKey(newsImages,"url")), 'yellow')    
    }
  }, [])


  const handleRefreshHome = React.useCallback(async () => {
    setRefreshing(true);
    try {
      // Concurrency in API requests
      const [positionsRowResponse, positionsResponse, positionsSlideResponse] = await Promise.all([
        alpacaMarketApiRow.get('v2/positions'),
        alpacaMarketApi.get('v2/positions'),
        alpacaMarketApiSlide.get('v2/positions'),
      ]);

      // State batch updates
      setPositionsExploreRow(positionsRowResponse.status === 200 ? positionsRowResponse.data : null);
      setPositionsExplore(positionsResponse.status === 200 ? positionsResponse.data : null);
      setPositionsExploreSlide(positionsSlideResponse.status === 200 ? positionsSlideResponse.data : null);

      if (isLoggedIn && alpacaToken) {
        getNewsHandle();
        // Dispatch multiple actions together if possible
        Promise.all([
          dispatch(getAccountPortfolio()),
          dispatch(getAccountHistory()),
          dispatch(getAccountPositions()),
          dispatch(getAccountOrders()),
          dispatch(getMarketStatus()),
        ]);
      }
    } catch (error) {
      // Error handling
      console.error('Error fetching positions:', error);
    }
    setRefreshing(false);
  }, [isLoggedIn, alpacaToken, getNewsHandle]); 

  return {refreshing, handleRefreshHome, getNewsHandle, newsArray, newsImages, positionsExplore, positionsExploreSlide, positionsExploreRow }
}

export { useRefreshHookHome}