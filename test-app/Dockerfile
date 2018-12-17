FROM node:8.11-alpine as base
LABEL maintainer="hedgecock.d@gmail.com"

WORKDIR /usr/src/app

# Include serve globally for testing production builds
RUN npm install -g serve

# --- DEPENDENCIES ---

# Copy source and template packages and run merge script to install the same deps
# as listed in current package (vs published package deps)
COPY ./test-app/package.json .
COPY ./package.json ./source.package.json
COPY ./scripts ./scripts
RUN node scripts/prepare-container-install.js

RUN npm install --no-optional --loglevel error

# --- TEST ---

FROM base as test

COPY ./package.json ./package.json
COPY ./src ./src
COPY ./test-app ./test-app
COPY ./__mocks__ ./__mocks__
COPY ./jest.config.js ./jest.config.js
COPY ./.eslintrc.js ./.eslintrc.js
COPY ./.prettierrc ./.prettierrc

# Validate unit tests
RUN npm run test

# --- PROJECT ---

FROM base as builder

# Copy project package to installed version package
COPY ./src /usr/src/app/node_modules/@ns-private/webpack-base/src
COPY ./package.json /usr/src/app/node_modules/@ns-private/webpack-base/package.json

# Copy test app in to container
COPY ./test-app .
# Copy serve config for prod build testing with `serve`
COPY ./test-app/serve.json .

# Run Build
RUN npm run build

# Serve the app in the container on :5000
CMD ["serve"]
