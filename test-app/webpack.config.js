const webpackBase = require('@ns-private/webpack-base')

/*
 * 📦 Single webpack configuration file handles different environment build targets
 * by using webpack-base to merge configurations common to all environments with
 * configurations unique to targeted environment.
 *
 * 📝 https://github.com/nodesource/webpack-base
 */
module.exports = () => {
  /*
   * Generate the base configuration object by passing the environment flags and
   * optional options object available for customizing the standard project
   * conventions.
   */
  const { configs } = webpackBase({
    envVars: { PACKAGE_VERSION: '4.1.0' },
    compressPlugin: false,
  })

  /*
   * Handle non-standard, advanced project customization by directly updating the
   * generated base configs.
   */
  // eg: configs.bail = false

  return configs
}
