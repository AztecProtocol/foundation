FROM node:18-alpine
RUN apk update && apk add --no-cache build-base git python3 curl bash jq
WORKDIR /usr/src

# We only want to copy the package.json's, to ensure we only rebuild this image if project dependencies changed.
COPY package.json package.json
# All workspaces use the linting config, so always include it.
COPY .pnp.cjs .pnp.loader.mjs .yarnrc.yml package.json tsconfig.json yarn.lock ./
COPY .yarn .yarn

FROM 278380418400.dkr.ecr.eu-west-2.amazonaws.com AS builder

COPY foundation foundation
WORKDIR /usr/src/foundation
RUN yarn build && yarn formatting && yarn test

# Prune dev dependencies. See comment in base image.
RUN yarn cache clean
RUN yarn workspaces focus --production > /dev/null

FROM node:18-alpine
COPY --from=builder /usr/src/foundation /usr/src/foundation
WORKDIR /usr/src/foundation
ENTRYPOINT ["yarn"]

# Although we're attempting to be "zero-install", in practice we still need to build arch specific packages.
RUN yarn --immutable
# If everything's worked properly, we should no longer need access to the network.
RUN echo "enableNetwork: false" >> .yarnrc.yml

# Yarn devs won't provide an extremely simple and useful feature of pruning dev dependencies from the local cache:
# https://github.com/yarnpkg/berry/issues/1789
#
# To work around this, we construct a global cache from the local cache using hard links (requires a hacky rename).
# When we build an upstream docker image, we:
# - Do the build.
# - Erase the local cache with a `yarn cache clean`. Files remain in global cache due to hard link.
# - Do a `yarn workspaces focus --production` to install production dependencies from the global cache, to .yarn/cache
# - A final stage of the build strips away the global cache.
RUN /bin/bash -c '\
[ -d /root/.yarn/berry/cache ] && exit 0; \
cd .yarn/cache && \
mkdir -p /root/.yarn/berry/cache && \
for F in *; do \
  [[ $F =~ (.*-) ]] && ln $F /root/.yarn/berry/cache/${BASH_REMATCH[1]}8.zip; \
done'
