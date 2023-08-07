// webpack.config.js
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  mode: 'production', // Set to 'production' for minification
  entry: {
    bundle: './src/index.js', // Entry point of your application
  },
  output: {
    filename: 'bundle.min.js', // Name of the output bundle
    path: __dirname + '/dist', // Output directory
  },
  target: 'node',
  optimization: {
    minimizer: [new TerserPlugin()], // Use TerserPlugin for minification
  },
};
