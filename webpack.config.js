var webpack = require('webpack');



module.exports = {
  entry: './src/index.js',
  output: { filename: 'bundle.js' },
  node: {
    fs: "empty"
  },
  plugins: [
    new webpack.ProvidePlugin({
      PIXI: 'pixi.js',
    })
  ]
};
