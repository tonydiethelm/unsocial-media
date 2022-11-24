
//set up stuff
const path = require('path');


module.exports = {
  entry: "./public/react-index.js",
  output: {path:__dirname + '/public/', filename: "bundle-index.js"},
  resolve:{
    // Enable importing JS / JSX files without specifying their extension
    extensions: ['.js', '.jsx']},
  module: {
    rules: [
      {
        //handling react code with JS and JSX
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
      //css
      {
        test: /\.s?css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ]
  }
};
