import { alpacaApi } from './Alpaca'
import { alpacaSearchApi } from './AlpacaSearch'

export const getAccount = () => alpacaApi.get('v2/account')
export const configureAccount = data => alpacaApi.patch('v2/account/configurations', data)
export const getPortfolioHistory = () => alpacaApi.get('v2/account/portfolio/history')
export const getPortfolioHistoryD = () =>
  alpacaApi.get('v2/account/portfolio/history?period=1D&timeframe=1H')
export const getPortfolioHistoryW = () =>
  alpacaApi.get('v2/account/portfolio/history?period=1W&timeframe=1D') 
export const getPortfolioHistoryM = () =>
  alpacaApi.get('v2/account/portfolio/history?period=1M&timeframe=1D')
export const getPortfolioHistoryY = () =>
  alpacaApi.get('v2/account/portfolio/history?period=1A&timeframe=30D')
export const getPositions = () => alpacaApi.get('v2/positions')
export const getAssets = () => alpacaSearchApi.get('v2/assets?status=active')
export const getOrders = () => alpacaApi.get('v2/orders')
// export const getOrders = (status, params) => alpacaApi.get(`v2/orders?status=${status}&direction=desc&${params}`)
export const postOrder = data => alpacaApi.post('v2/orders', data)
export const cancelOrder = order_id => alpacaApi.delete(`v2/orders/${order_id}`)
// export const getPortfolioHistory = () => alpacaApi.get('v2/account/portfolio/history?period=1D&timeframe=15Min')
// export const alpacaExchangeToken = (params) => authApi.post(ALPACA_TOKEN_ENDPOINT, params)
export const getActivities = () => alpacaApi.get('v2/account/activities')
export const getClock = () => alpacaApi.get('v2/clock')
export const getWatchlist = watchlistid => alpacaApi.get(`v2/watchlists/${watchlistid}`)
export const newWatchlist = watchlist => alpacaApi.post(`v2/watchlists`, watchlist)
export const postWatchlist = (watchlistid, data) =>
  alpacaApi.put(`v2/watchlists/${watchlistid}`, data)
export const deleteItemWatchlist = (watchlistid, symbol) =>
  alpacaApi.delete(`v2/watchlists/${watchlistid}/${symbol}`)
