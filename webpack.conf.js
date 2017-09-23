var webpack = require('webpack');



module.exports = {
  entry: './src/game.js',
  output: { filename: 'bundle.js' },
  plugins: [
    new webpack.ProvidePlugin({
      PIXI: 'pixi.js',
    })
  ]
};
