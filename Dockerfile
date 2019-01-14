FROM mhart/alpine-node:10
WORKDIR /app
COPY package.json ./
COPY yarn.lock ./
COPY server/ ./server
COPY pages/ ./pages
RUN ls -al
RUN ls -al ./pages
RUN yarn
RUN yarn build
RUN rm -rf node_modules && yarn --production --pure-lockfile

FROM mhart/alpine-node:base-8
WORKDIR /app
COPY --from=0 /app .
COPY . .
EXPOSE 3000
ARG NODE_ENV=production
CMD ["node", "server"]
