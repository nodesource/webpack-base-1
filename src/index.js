/* eslint-disable no-param-reassign */
const merge = require('webpack-merge')

const decorateOptions = require('./decorate-options')
const commonConfigs = require('./common-configs')
const electronConfigs = require('./electron-configs')
const developmentConfigs = require('./development-configs')
const productionConfigs = require('./production-configs')
const generateLoaders = require('./generate-loaders')
const generatePlugins = require('./generate-plugins')

/**
 * N|S projects' base webpack configs include configurations for loader
 * definitions, dev server, build indicators, stats, etc. The configurations are
 * specific to environment and can be overriden as needed for custom build
 * requirements.
 */
module.exports = function webpackBase(options = {}) {
  const decoratedOptions = decorateOptions(options)
  const loaders = generateLoaders(decoratedOptions)
  const plugins = generatePlugins(decoratedOptions)

  const { development, production, electron } = decoratedOptions.flags

  // 1. Generate common configs
  // Merge common configs with dev vs prod specific configs to return complete
  // webpack configuration object
  let configs = commonConfigs(decoratedOptions)

  // 2. Merge target specific configs
  if (electron) configs = merge(configs, electronConfigs())
  if (production) configs = merge(configs, productionConfigs(decoratedOptions))
  if (development) configs = merge(configs, developmentConfigs(decoratedOptions))

  // 3. Map loader and plugin names to instances with options
  const configuredLoaders = {}
  const configuredPlugins = {}

  const loadersSet = configs.module.rules
  configs.module.rules = []
  loadersSet.forEach(loaderName => {
    if (options[loaderName] === false) return

    let loader
    if (typeof options[loaderName] === 'function') {
      loader = options[loaderName](loaders[loaderName]())
    } else {
      loader = loaders[loaderName](options[loaderName])
    }
    configs.module.rules.push(loader)
    configuredLoaders[loaderName] = loader
  })

  const pluginsSet = configs.plugins
  configs.plugins = []
  pluginsSet.forEach(pluginName => {
    if (options[pluginName] === false) return

    const plugin = plugins[pluginName]
    configs.plugins.push(plugin)
    configuredPlugins[pluginName] = plugin
  })

  return { configs, loaders: configuredLoaders, plugins: configuredPlugins }
}
