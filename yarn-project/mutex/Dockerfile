FROM 278380418400.dkr.ecr.eu-west-2.amazonaws.com/yarn-project AS builder

COPY mutex mutex
WORKDIR /usr/src/yarn-project/mutex
RUN yarn build && yarn formatting && yarn test

# Prune dev dependencies. See comment in base image.
RUN yarn cache clean
RUN yarn workspaces focus --production > /dev/null

FROM node:18-alpine
COPY --from=builder /usr/src/yarn-project/mutex /usr/src/yarn-project/mutex
WORKDIR /usr/src/yarn-project/mutex
ENTRYPOINT ["yarn"]