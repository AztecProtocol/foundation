FROM node:18-alpine
WORKDIR /usr/src/foundation
RUN yarn build && yarn formatting && yarn test