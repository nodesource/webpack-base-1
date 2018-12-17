const { writeFileSync } = require('fs')
const { resolve } = require('path')

/* eslint-disable import/no-unresolved */
const sourcePackage = require('../source.package.json')
const projectPackage = require('../package.json')

delete projectPackage.devDependencies['@ns-private/webpack-base']
delete sourcePackage.devDependencies.cypress // don't need this in container

projectPackage.devDependencies = {
  ...projectPackage.devDependencies,
  ...sourcePackage.dependencies,
}

writeFileSync(resolve('package.json'), JSON.stringify(projectPackage, null, 2))
