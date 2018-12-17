FROM node:8.11-alpine
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

# --- PROJECT ---

# COPY --from=builder /usr/src/app/package.json ./package.json
RUN npm install

# Copy project package to installed version package
COPY ./package.json /usr/src/app/node_modules/@ns-private/webpack-base/package.json

# Copy test app in to container
COPY ./test-app .
# Copy serve config for prod build testing with `serve`
COPY ./test-app/serve.json .

# Expose both the webpack-serve and hot client ports
EXPOSE 3000
# Expose the serve port for testing production builds
EXPOSE 5000
