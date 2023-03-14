FROM node:18-alpine
RUN apk update && apk add --no-cache build-base git python3 curl bash jq
WORKDIR /usr/src/foundation
RUN yarn build && yarn formatting && yarn test