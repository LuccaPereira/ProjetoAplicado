const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: 'development', // ou 'production', dependendo do ambiente
  entry: {
    login: ['./public/Controller/login.controller.js', './public/View/loginCss.css'],
    menu: ['./public/Controller/menu.controller.js', './public/View/menu.css'], // Novo ponto de entrada
    cadastrarPeticao: ['./public/Controller/cadastrarPeticao.controller.js', './public/View/cadastrarPeticao.css'],
    cadastroAdvogado: ['./public/Controller/cadastroAdvogado.controller.js', './public/View/cadastroAdvogado.css'],
    perfilAdvogado: ['./public/Controller/perfilAdvogado.controller.js', './public/View/perfilAdvogado.css'],
    tabelaCliente: ['./public/Controller/tabelaCliente.controller.js', './public/View/tabelaCliente.css'],
    updateSenha: ['./public/Controller/redefinirSenha.controller.js', './public/View/updateSenhaCss.css'],
    consultarModelo: ['./public/Controller/consultarModelo.controller.js', './public/View/consultar-modelo.css'],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].bundle.js',
    publicPath: '/',
  },
  devtool: 'source-map', // Facilita depuração no ambiente de desenvolvimento
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    compress: true,
    port: 9000,
    historyApiFallback: true, // Suporte para SPA
    client: {
      overlay: {
        errors: true,
        warnings: false,
      },
      webSocketURL: {
        hostname: 'localhost',
        port: 9000,
      },
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'login.html',
      template: path.resolve(__dirname, 'public/View/login.html'),
      chunks: ['login'], // Inclui o bundle para login
      inject: true,
    }),
    new HtmlWebpackPlugin({
      filename: 'cadastrarPeticao.html',
      template: path.resolve(__dirname, 'public/View/cadastrarPeticao.html'),
      chunks: ['cadastrarPeticao'],
      inject: true,
    }),
    new HtmlWebpackPlugin({
      filename: 'consultar-modelo.html',
      template: path.resolve(__dirname, 'public/View/consultar-modelo.html'),
      chunks: ['consultarModelo'],
      inject: true,
    }),
    new HtmlWebpackPlugin({
      filename: 'cadastroAdvogado.html',
      template: path.resolve(__dirname, 'public/View/cadastroAdvogado.html'),
      chunks: ['cadastroAdvogado'],
      inject: true,
    }),
    new HtmlWebpackPlugin({
      filename: 'criarClientes.html',
      template: path.resolve(__dirname, 'public/View/criarClientes.html'),
      chunks: ['criarClientes'],
      inject: true,
    }),
    new HtmlWebpackPlugin({
      filename: 'menu.html',
      template: path.resolve(__dirname, 'public/View/menu.html'),
      chunks: ['menu'],
      inject: true,
    }),
    new HtmlWebpackPlugin({
      filename: 'perfilAdvogado.html',
      template: path.resolve(__dirname, 'public/View/perfilAdvogado.html'),
      chunks: ['perfilAdvogado'],
      inject: true,
    }),
    new HtmlWebpackPlugin({
      filename: 'tabelaCliente.html',
      template: path.resolve(__dirname, 'public/View/tabelaCliente.html'),
      chunks: ['tabelaCliente'],
      inject: true,
    }),
    new HtmlWebpackPlugin({
      filename: 'updateSenha.html',
      template: path.resolve(__dirname, 'public/View/updateSenha.html'),
      chunks: ['updateSenha'],
      inject: true,
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: 'images',
              name: '[name].[ext]',
            },
          },
        ], 
      },
    ],
  },
};
