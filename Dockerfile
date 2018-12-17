FROM node:14.18 as base
LABEL maintainer="hedgecock.d@gmail.com"

WORKDIR /usr/src

# Include serve globally for testing production builds
RUN npm install -g serve

# --- TEST ---

FROM base as test

# Install dependencies
COPY ./package*.json ./
RUN CI=true CYPRESS_INSTALL_BINARY=0 npm install --no-optional --loglevel error

# Copy remaining source files
COPY . .

# Validate unit tests
RUN npm run test:lint
RUN npm run test:unit

# --- APP CLONE ---

FROM base as app

RUN git clone https://github.com/crystal-ball/react-application-prototype.git
WORKDIR /usr/src/react-application-prototype

# Copy test coverage reports for webpack-base so that we can later copy them
# to CI/CD workspace
COPY --from=test /usr/src/coverage ./coverage

# Copy source and template packages and run merge script to install the same deps
# as listed in current package (vs published package deps)
# COPY ./test-app/package.json .
COPY ./package.json ./source.package.json
COPY ./scripts/prepare-container-install.js ./scripts/prepare-container-install.js
RUN node scripts/prepare-container-install.js

RUN CI=true CYPRESS_INSTALL_BINARY=0 npm install --no-optional --loglevel error

# Copy project source to installed version package
COPY ./src /usr/src/react-application-prototype/node_modules/@crystal-ball/webpack-base/src
COPY ./package.json /usr/src/react-application-prototype/node_modules/@crystal-ball/webpack-base/package.json

# Copy project package to installed version package
COPY ./package.json /usr/src/app/node_modules/@ns-private/webpack-base/package.json

# Copy serve config for prod build testing with `serve`
RUN echo "{ \"public\": \"public\" }" >> ./serve.json

# Run Build
RUN npm run build

# Serve the app in the container on :5000
CMD ["serve"]
