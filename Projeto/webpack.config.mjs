import path from 'path';
import { fileURLToPath } from 'url';
import NodePolyfillPlugin from 'node-polyfill-webpack-plugin';

// Função para obter o diretório atual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  mode: 'development',
  entry: ['./src/polyfills.js', './src/index.js'],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'public/js'),
    publicPath: '/js/'
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
    extensions: ['.js'],
    fallback: {
      buffer: 'buffer/',
      events: 'events/',
      path: 'path-browserify',
      stream: 'stream-browserify',
      crypto: 'crypto-browserify',
      querystring: 'querystring-es3',
      zlib: 'browserify-zlib',
      http: 'stream-http',
      net: false,
      fs: false,
      assert: 'assert/',
      util: 'util/',
      vm: 'vm-browserify'
    }
  },
  devtool: 'source-map',
  devServer: {
    contentBase: path.resolve(__dirname, 'public'),
    compress: true,
    port: 3000,
    open: true
  },
  plugins: [
    new NodePolyfillPlugin() // Adiciona polyfills para módulos Node.js
  ]
};

