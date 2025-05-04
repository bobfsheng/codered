const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const path=require('path');
const config = {
    resolver: {
      sourceExts: ['tsx', 'ts', 'js', 'jsx', 'json'], 
      extraNodeModules: {
        '@store': path.resolve(__dirname, 'src/store'), 
        "@assets": path.resolve(__dirname, 'src/assets'),
        "@components": path.resolve(__dirname, 'src/components'),
        "@models": path.resolve(__dirname, 'src/models'),
        "@navigation": path.resolve(__dirname, 'src/navigation'),
        "@screens": path.resolve(__dirname, 'src/screens'),
        "@services": path.resolve(__dirname, 'src/services'),
        "@store": path.resolve(__dirname, 'src/store'),
        "@utils": path.resolve(__dirname, 'src/utils'),
        "@hooks": path.resolve(__dirname, 'src/hooks'),
        "@constants": path.resolve(__dirname, 'src/constants'),
        "@functions": path.resolve(__dirname, 'src/functions'),
        // "firebase": path.resolve(__dirname, 'node_modules/firebase/firebase'),
        // "@react-native-firebase/messaging": path.resolve(__dirname, 'node_modules/@react-native-firebase/messaging/lib/index.js'),
        // "react-redux": path.resolve(__dirname, 'node_modules/react-redux/dist/cjs/index.js'),
        // "react-native-gesture-handler": path.resolve(__dirname, 'node_modules/react-native-gesture-handler/lib/commonjs/index.js'),
        // "@react-navigation/native": path.resolve(__dirname, 'node_modules/@react-navigation/native/lib/commonjs/index.js'),
      },
      resolveRequest: (context, moduleName, platform) => {
        if (moduleName.startsWith('@constants/')|| moduleName.startsWith('@assets/')) {
          const basePath = moduleName.startsWith('@constants/')? 'src/constants' : 'src/assets';
          const relativePath = moduleName.split('/').slice(1).join('/');
          const filePath = path.resolve(__dirname, basePath, relativePath);
          const ext = path.extname(filePath) ? '' : '.js';
          return {
            filePath: filePath + ext,
            type: 'sourceFile',
          }
        }
        return context.resolveRequest(context, moduleName, platform);
      }
    },
  };

module.exports = mergeConfig(getDefaultConfig(__dirname), config);

