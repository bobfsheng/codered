import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';

const USE_MODEL_URL = 'https://tfhub.dev/google/universal-sentence-encoder/4';
let model;

export const loadModel = async () => {
  await tf.ready();
  model = await tf.loadGraphModel(USE_MODEL_URL);
}

export const calculateSimilarities = async (stocks, positions) => {
  const stockTexts = stocks.map(stock => stock.info.longBusinessSummary + " " + stock.info.sector);
  const positionSymbols = positions.map(position => position.symbol);
  
  const stockEmbeddings = await model.predict(tf.tensor2d(stockTexts));
  const positionEmbeddings = await model.predict(tf.tensor2d(positionSymbols));

  const similarities = {};
  stockTexts.forEach((text, index) => {
    const similarity = tf.metrics.cosineProximity(stockEmbeddings.slice([index, 0]), positionEmbeddings);
    similarities[text] = similarity.dataSync()[0];
  });

  // Sort stocks based on similarity
  const sortedStocks = Object.keys(similarities).sort((a, b) => similarities[b] - similarities[a]);
  return sortedStocks;
}
