import webpack from 'webpack'

/**
 * Development environment specfic configurations
 * @param {Object} paths Configured paths for environment build
 * @return {Object} Development specific configurations to merge with cross
 *                  environment configurations
 */
export default ({ appPublic, babelLoaderInclude }) => ({
  // This makes the bundle appear split into separate modules in the devtools.
  // We don't use source maps here because they can be confusing:
  // https://github.com/facebookincubator/create-react-app/issues/343#issuecomment-237241875
  // You may want 'cheap-module-source-map' instead if you prefer source maps.
  // devtool: 'eval',
  devtool: 'eval',

  // CSS Loader Definition - Dev
  module: {
    rules: [
      // Dev JS loader runs everything through eslint then Babel
      {
        test: /\.jsx?$/,
        // Only use loader with explicitly included files
        include: babelLoaderInclude,
        /**
         * ## Using Eslint Loader
         * The `eslint-loader` will run imported modules through eslint first and
         * surface errors/warnings in the webpack build (These are also picked up by
         * the webpack-dev-server).
         *
         * **DEPENDENCIES**: This package only includes the eslint-loader package,
         * `eslint` and any packages required to run the eslint rules for a project
         * must be included by that project. This allows projects to handle
         * specifying and configuring eslint explicitly as required.
         */
        use: [{ loader: 'babel-loader' }, { loader: 'eslint-loader' }],
      },
      // Dev styles loader does not extract into a file
      {
        test: /\.scss$/,
        use: [
          { loader: 'style-loader' },
          {
            loader: 'css-loader',
            options: {
              localIdentName: '[name][local]--[hash:base64:5]',
            },
          },
          {
            loader: 'sass-loader',
            options: {
              // src/styles allows easy theme variable import
              includePaths: ['src/styles'],
            },
          },
        ],
      },
    ],
  },

  plugins: [
    // See guides/architecture/build - HMR
    new webpack.HotModuleReplacementPlugin(),
    // prints more readable module names in the browser console on HMR updates
    new webpack.NamedModulesPlugin(),
    // do not emit compiled assets that include errors
    new webpack.NoEmitOnErrorsPlugin(),
  ],

  devServer: {
    // Tell the server where to serve content from. This is only necessary if you
    // want to serve static files.
    contentBase: appPublic,
    // enable gzip compression
    compress: true,
    // Enable history API fallback so HTML5 History API based
    // routing works. This is a good default that will come
    // in handy in more complicated setups.
    // true for index.html upon 404, object for multiple paths
    historyApiFallback: true,
    port: 3000,
    // See guides/architecture/build - HMR
    hot: true,
    // true for self-signed, object for cert authority
    https: false,
    // only errors & warns on hot reload
    noInfo: true,
    // overlay: true captures only errors
    overlay: {
      errors: true,
      warnings: false,
    },
  },
})
