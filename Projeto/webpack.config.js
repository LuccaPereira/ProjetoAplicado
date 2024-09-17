const path = require('path');

module.exports = {
  mode: 'development', // ou 'production'
  entry: './src/index.js', // Corrigido para o caminho correto
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'public/js'), // O diretório onde o bundle será salvo
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  resolve: {
    extensions: ['.js']
  },
  devtool: 'source-map'
};
