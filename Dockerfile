### STAGE 1: Build ###

# We label our stage as 'builder'
FROM node:9-alpine as builder
ARG APP_PATH=/webapp/
ARG ENVIRONMENT
ARG PROFILE

#RUN apk update && apk upgrade && \
#  apk add build-base  curl dpkg python2
RUN apk update && apk upgrade && \
    apk add --no-cache git curl dpkg g++ gcc libgcc libstdc++ linux-headers make python

WORKDIR ${APP_PATH}

RUN npm set progress=false && npm config set depth 0 && npm cache clean --force

COPY . ${APP_PATH}/

## Storing node modules on a separate layer will prevent unnecessary npm installs at each build
RUN npm i --no-optional

EXPOSE 80

##CMD /etc/init.d/filebeat start

## Build the angular app in production mode and store the artifacts in dist folder
RUN npm rebuild node-sass
RUN $(npm bin)/ng build --aot -c $ENVIRONMENT

### STAGE 2: Setup ###

FROM nginx:1.13.3-alpine

## Copy our default nginx config
COPY nginx/default.conf /etc/nginx/conf.d/

## Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

## From 'builder' stage copy over the artifacts in dist folder to default nginx public folder
COPY --from=builder /webapp/dist/exrates-front-new /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]
