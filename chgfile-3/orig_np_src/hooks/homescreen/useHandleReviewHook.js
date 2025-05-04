import * as StoreReview from 'react-native-store-review'

function useHandleReviewHome() {

  const handleOnReviewHome = async () => {
    {
      StoreReview.requestReview()
    }
  }

  return {handleOnReviewHome }
}

export { useHandleReviewHome }