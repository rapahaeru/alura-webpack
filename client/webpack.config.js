const path = require('path');

const babiliPlugin = require('babili-webpack-plugin');
let plugins = [];

if (process.env.NODE_ENV == 'production') {
  plugins.push( new babiliPlugin() );
}

module.exports = {
  entry: './app-src/app.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: 'dist',
  },
  module: {
    rules: [
      {
        test: /\.js$/, //indica a condição na qual nosso loader será aplicado. Usamos a expressão regular /\.js$/ para considerar todos os arquivos que terminam com a extensão .js
        exclude: /node_modules/, // excluímos a pasta node_modules, pois não faz sentido processar os arquivos dela.
        use: {
          loader: 'babel-loader'
        }
      },
      { 
        test: /\.css$/, 
        loader: 'style-loader!css-loader' 
      },
      { 
        test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/, 
        loader: 'url-loader?limit=10000&mimetype=application/font-woff' 
      },
      { 
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, 
        loader: 'url-loader?limit=10000&mimetype=application/octet-stream'
      },
      { 
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, 
        loader: 'file-loader' 
      },
      { 
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, 
        loader: 'url-loader?limit=10000&mimetype=image/svg+xml' 
      }
    ]
  },
  plugins: plugins,
}