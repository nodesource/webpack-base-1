'use strict'

const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const DuplicatePackageCheckerPlugin = require('duplicate-package-checker-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const SVGSymbolSprite = require('svg-symbol-sprite-loader')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const { EnvironmentPlugin, HotModuleReplacementPlugin } = require('webpack')

/**
 * Returns the set of plugins for the passed opts including:
 * clean, copy, duplicatePackageChecker, environment, friendlyErrors,
 * hotModuleReplacement, html, miniCSSExtract, namedModules, progressBar,
 * svgSymbolSprite
 */
module.exports = ({ envVars, fileHash, flags, paths, publicPath }) => ({
  // --------------------------------------------------------
  // ✅ Path validation
  // Ensure that import paths are case sensitive to ensure Linux/MacOS  compatability
  caseSensitivePathsPlugin: new CaseSensitivePathsPlugin(),

  // --- 📦 Build Prep
  // Wipe output folder before the build
  cleanPlugin: new CleanWebpackPlugin(),
  // cleanPlugin: new CleanWebpackPlugin([outputPath], {
  //   // root is required b/c our paths are absolute and clean makes sure they match
  //   root: process.cwd(),
  // }),

  // // --- ⬇️ Compress
  // // Gzip build assets, do not include deleteOriginalAssets or it will delete the
  // // gzipped assets that have the same name
  // compressPlugin: new CompressionPlugin({
  //   filename: '[path][query]',
  //   exclude: /\.(jpe?g|png|gif)$/i,
  // }),

  // --- 🖨 File copying
  // Copy public directory to build directory, this is an escape hatch for assets
  // needed that are not imported into build
  copyPlugin: new CopyWebpackPlugin({ patterns: [paths.static] }),

  // --- ✅ Validations + Optimizations
  // Check for duplicate versions of the same package, ie React 15 && React 16
  // in the same build
  duplicatePackageCheckerPlugin: new DuplicatePackageCheckerPlugin({
    verbose: true, // Show module that is requiring each duplicate package
  }),

  // --- 💉 Variable injections
  // Define environment variables in build.
  // ℹ️ Values passed to EnvironmentPlugin are defaults
  environmentPlugin: new EnvironmentPlugin({
    DEBUG: false,
    PUBLIC_PATH: publicPath, // useful for routing and media from /public dir
    ...envVars,
  }),

  // --- ℹ️ Logging
  // Shows and clears errors in a easier to read format

  // --- 🔥 Hot Module Replacement
  // Ref: https://webpack.js.org/concepts/hot-module-replacement/
  hotModuleReplacementPlugin: new HotModuleReplacementPlugin(),

  // --- 📦 HTML index generator
  // Generates index.html with injected script/style resources paths
  htmlPlugin: new HtmlWebpackPlugin({
    inject: !flags.electron,
    minify: false,
    publicPath,
    template: paths.htmlTemplate,
  }),

  // --- 😍 Styles extractions
  miniCSSExtractPlugin: new MiniCssExtractPlugin({
    filename: `static/css/[name]${fileHash}.css`,
  }),

  // --- 🔢 Stats
  // Visual compile indicator with progress bar

  // --- 📦 Asset extractions
  // Plugin for SVG symbol sprite extracts imported SVGs into a file
  // ⚠️ Order is important, this plugin must be included after HTML plugin so that
  // HTML plugin hooks are pre-registered!
  svgSymbolSpritePlugin: new SVGSymbolSprite.Plugin({
    filename: `static/media/icon-sprite${fileHash}.svg`,
    // Don't inject the sprite id in electron and storybook targets because the
    // HTML plugin might be different (Storybook) or the app will just always
    // fetch it (both)
    injectSpriteId: !(flags.electron || flags.storybook),
  }),
})
