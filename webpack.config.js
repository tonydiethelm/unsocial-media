module.exports = {
  entry: "./public/react-index.js",
  output: "./public/bundle.js",
  module:{
    rules: [{
      test: /.(js|jsx)$/,
      exclude: /node_modules/,
    }]

  }
}