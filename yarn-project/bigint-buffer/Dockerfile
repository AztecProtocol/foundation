FROM 278380418400.dkr.ecr.eu-west-2.amazonaws.com/yarn-project AS builder

COPY bigint-buffer bigint-buffer
WORKDIR /usr/src/yarn-project/bigint-buffer
RUN yarn build && yarn formatting && yarn test --passWithNoTests

# Prune dev dependencies. See comment in base image.
RUN yarn cache clean
RUN yarn workspaces focus --production > /dev/null

FROM node:18-alpine
COPY --from=builder /usr/src/yarn-project/bigint-buffer /usr/src/yarn-project/bigint-buffer
WORKDIR /usr/src/yarn-project/bigint-buffer
ENTRYPOINT ["yarn"]