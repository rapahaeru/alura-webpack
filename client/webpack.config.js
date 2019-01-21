const path = require('path');

const babiliPlugin = require('babili-webpack-plugin');
const extractTextPlugin = require('extract-text-webpack-plugin');
const optimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const webpack = require('webpack');

let plugins = [];

// exporta os arquivos de estilo para dist/styles.css
plugins.push(
  new extractTextPlugin("styles.css")
);
// importa scripts em escopo global, não havendo a necessidade
// de importar em cada componente
plugins.push(
  new webpack.ProvidePlugin({
    $: 'jquery/dist/jquery.js',
    jQuery: 'jquery/dist/jquery.js'
  })
);

plugins.push(
  new webpack.optimize.CommonsChunkPlugin(
    { 
      name: 'vendor', 
      filename: 'vendor.bundle.js'
    }
  )
);

if (process.env.NODE_ENV == 'production') {
  // otimiza o parseamento dos módulos de script
  plugins.push(new webpack.optimize.ModuleConcatenationPlugin());

  plugins.push( new babiliPlugin() );

  plugins.push(new optimizeCSSAssetsPlugin({
    cssProcessor: require('cssnano'),
    cssProcessorOptions: { 
        discardComments: {
            removeAll: true 
        }
    },
    canPrint: true
 }));
}

module.exports = {
  entry: {
    app: './app-src/app.js',
    vendor: ['jquery', 'bootstrap', 'reflect-metadata']
  },
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
        use: extractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader'
        })
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