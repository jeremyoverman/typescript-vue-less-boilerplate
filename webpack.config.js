var path = require('path')
var webpack = require('webpack')
var outputFileName = 'bundle'

var config = {
  context: path.resolve(__dirname, './'),

  entry: ['./src/index.ts'],

  output: {
    // output to './dist' folder 
    path: path.resolve(__dirname, 'dist'),

    // with filename
    filename: outputFileName + '.js',

    // mark /dist/ folder as a public path so index.html can reach it
    publicPath: '/dist/'
  },

  // webpack-dev-server config, see: https://webpack.github.io/docs/webpack-dev-server.html
  devServer: {
    contentBase: './',
    hot: true,
    inline: true,
    port: 9090
  },

  // http://webpack.github.io/docs/configuration.html#devtool
  devtool: '#eval-source-map',

  resolve: {
    extensions: ['.js', '.ts'],
    alias: {
      'vue$': 'vue/dist/vue.common.js'
    }
  },

  module: {
    rules: [
      {
        test: /\.less$/,
        use: [
          { loader: 'style-loader' }, // creates style nodes from JS strings
          { loader: 'css-loader' }, // translates CSS into CommonJS
          { loader: 'less-loader' } // compiles Less to CSS
        ]
      },
      { test: /\.html$/, loader: 'html-loader' },
      { test: /\.less$/, loader: 'less-loader' }
    ]
  },
  plugins: [
    // HMR issue, see: https://github.com/webpack/webpack/issues/1151
    new webpack.HotModuleReplacementPlugin()
  ]
}

// When use in production (npm run build)
if (process.env.NODE_ENV === 'production') {
  // still need babel for production stage since uglifyJs not support es6
  config.module.rules = config.module.rules.concat([
    { test: /\.ts(x?)$/, loader: 'babel-loader?presets[]=es2015!ts-loader' },
    { test: /\.js$/, loader: 'babel-loader', query: { presets: ['es2015'] } }
  ])

  config.devtool = '#source-map'

  // https://vuejs.org/guide/deployment.html
  config.plugins = (config.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),

    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),

    new webpack.optimize.OccurrenceOrderPlugin()
  ])
} else {
  config.module.rules = config.module.rules.concat({
    test: /\.ts(x?)$/,
    loader: 'ts-loader'
  });
}

module.exports = config