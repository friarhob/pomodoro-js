const path = require('path');

module.exports = {
  devtool: "source-map",
  entry: './build/app.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'js')
  },
  mode: "production"
};