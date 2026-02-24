// frontend/babel.config.js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      'babel-preset-expo',
      ['@babel/preset-react', { runtime: 'automatic' }], // évite "React is not defined"
    ],
    plugins: [
      'react-native-reanimated/plugin', // tu as reanimated dans tes deps
    ],
  };
};
