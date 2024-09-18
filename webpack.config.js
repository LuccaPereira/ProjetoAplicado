const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: 'development', // ou 'production', dependendo do ambiente
  entry: {
    main: ['@babel/polyfill', './src/index.js'],
    cadastrarPeticao: ['./public/Controller/cadastrarPeticao.controller.js', './public/View/cadastrarPeticao.css'],
    cadastroAdvogado: ['./public/Controller/cadastroAdvogado.controller.js', './public/View/cadastroAdvogado.css'],
    menu: ['./public/Controller/menu.controller.js', './public/View/menu.css'],
    perfilAdvogado: ['./public/Controller/perfilAdvogado.controller.js', './public/View/perfilAdvogado.css'],
    tabelaCliente: ['./public/Controller/tabelaCliente.controller.js', './public/View/tabelaCliente.css'],
    updateSenha: ['./public/Controller/redefinirSenha.controller.js', './public/View/updateSenhaCss.css'],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].bundle.js',
    publicPath: '/', // Verifique se o caminho público está correto
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
      filename: 'cadastrarPeticao.html',
      template: path.resolve(__dirname, 'public/View/cadastrarPeticao.html'),
      chunks: ['main', 'cadastrarPeticao'],
      inject: true,
    }),
    new HtmlWebpackPlugin({
      filename: 'cadastroAdvogado.html',
      template: path.resolve(__dirname, 'public/View/cadastroAdvogado.html'),
      chunks: ['main', 'cadastroAdvogado'],
      inject: true,
    }),
    new HtmlWebpackPlugin({
      filename: 'criarClientes.html',
      template: path.resolve(__dirname, 'public/View/criarClientes.html'),
      chunks: ['main', 'criarClientes'],
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
      chunks: ['main', 'perfilAdvogado'],
      inject: true,
    }),
    new HtmlWebpackPlugin({
      filename: 'tabelaCliente.html',
      template: path.resolve(__dirname, 'public/View/tabelaCliente.html'),
      chunks: ['main', 'tabelaCliente'],
      inject: true,
    }),
    new HtmlWebpackPlugin({
      filename: 'updateSenha.html',
      template: path.resolve(__dirname, 'public/View/updateSenha.html'),
      chunks: ['main', 'updateSenha'],
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
              outputPath: 'images', // Onde os arquivos serão armazenados dentro da pasta dist
              name: 'logo.png', // Nome do arquivo
            },
          },
        ], 
      },
    ],
  },
};
