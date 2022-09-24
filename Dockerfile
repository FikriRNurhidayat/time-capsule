FROM node:latest
MAINTAINER Fikri Rahmat Nurhidayat <fikrirnurhidayat@gmail.com>
ENV PORT="8080" \
    HOME="/opt/timecapsule"
RUN mkdir -p ${HOME}
WORKDIR ${HOME}
COPY package.json yarn.lock ./
RUN yarn install --production --silent
COPY . .
RUN yarn docs:compile
RUN mkdir -p ${HOME}/public/uploads
CMD ["sh", "-c", "yarn", "start"]
