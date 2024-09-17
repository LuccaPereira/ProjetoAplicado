const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './public/login.controller.js',  // O arquivo JavaScript que o Webpack deve empacotar
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'public'),  // Pasta onde o bundle será gerado
    },
    mode: 'development',  // Altere para 'production' para produção
    devServer: {
        static: {
            directory: path.join(__dirname, 'public'),  // Diretório para servir arquivos estáticos
        },
        compress: true,
        port: 3000,
        hot: true,  // Ativa o Hot Module Replacement
        open: true,  // Abre o navegador automaticamente ao iniciar o servidor
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/View/login.html',  // Caminho para o arquivo HTML
            filename: 'index.html'  // Nome do arquivo HTML de saída
        })
    ]
};
