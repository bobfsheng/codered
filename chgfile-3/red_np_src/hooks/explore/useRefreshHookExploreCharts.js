import React, {  useState } from 'react'
import { useDispatch } from 'react-redux'
import {
  getNews,
  getLastQuote
} from '@services'


function useRefreshHookExploreCharts(stockTicker) {
  const [newsAuthor, setNewsAuthor] = useState('')
  const [newsHeadline, setNewsHeadline] = useState('')
  const [newsSymbols, setNewsSymbols] = useState('')
  const [newsURL, setNewsURL] = useState('')
  const [newsDate, setNewsDate] = useState('')
  const [newsImages, setNewsImages] = useState('')
  const [newsSummary, setNewsSummary] = useState('')
  const [newsSource, setNewsSource] = useState('')
  const [newsContent, setNewsContent] = useState('')
  const [newsImageURL, setNewsImageURL] = useState(false)
  const [feedBoxModal, setFeedBoxModal] = useState(false)
  const [positionsExplore, setPositionsExplore] = useState(null)
  const [refreshing, setRefreshing] = useState(false)
  const [refreshingColor, setRefreshingColor] = useState(false)
  const [lastQuote, setLastQuote] = useState(0)
  const dispatch = useDispatch()

  const getNewsHandle = React.useCallback(async () => {
    const response = await getNews(stockTicker)

    let findByKey = (arr, key) => {
      if (!Array.isArray(arr)) {
        return undefined; // or throw an error if appropriate
      }
      
      return (arr?.find(ele => key in ele) || {})[key];
    }

    if (response) {
      setNewsAuthor(findByKey(response.news,"author"))
      setNewsHeadline(findByKey(response.news,"headline"))
      setNewsImages(findByKey(response.news,"images"))
      setNewsDate(findByKey(response.news,"created_at"))
      setNewsURL(findByKey(response.news,"url"))
      setNewsDate(findByKey(response.news,"updated_at"))
      setNewsSource(findByKey(response.news,"source"))
      setNewsContent(findByKey(response.news,"content"))
      setNewsSummary(findByKey(response.news,"summary"))
      setNewsSymbols(findByKey(response.news,"symbols"))
      setNewsImageURL((findByKey(newsImages,"url")))
    }
  }, [])

  const handleRefreshExploreCharts = async () => {
    setRefreshingColor(true) 
    setRefreshing(true)
    getNewsHandle()
    // ;(async () => {
      if (stockTicker) {
        try {
          const response = await getLastQuote(stockTicker)
          if (response?.trade) {
            setLastQuote(response?.trade?.p)
          } else {
            setLastQuote(0)
          }
        } catch (error) {
          console.log('error =>', error)
        }
      } else {
        setLastQuote(0)
      }
    // })()

      for (let i = 0; i < 2; i++) {
        setTimeout(() =>  setRefreshingColor(prev => !prev) , i * 1000);
        setRefreshingColor(false) 
        
      }
    

  setRefreshing(false)
  
  }
  return {refreshing, handleRefreshExploreCharts, 
    positionsExplore, refreshingColor,lastQuote, setLastQuote, setRefreshingColor,setFeedBoxModal,
    getNewsHandle,  newsImages,  newsSummary, newsAuthor, newsURL, newsDate, newsSource, newsSymbols, newsHeadline, feedBoxModal}
  
}

export { useRefreshHookExploreCharts }