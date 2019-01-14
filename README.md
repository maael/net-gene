# Net Gene

Do you have the net terminal gene?

Or rather, does your internet work as well as it should?

Net Gene is a simple web app to monitor speedtest and ping information, and provides it via a dashboard.

Once running it will do a speedtest via speedtest.net and ping of Facebook, Google, and Google's DNS (8.8.8.8) every 5 minutes, and it will keep the most recent 1000 of these.

## Install

### Requirements

* Node v8+

### Steps

```sh
git clone git@github.com:maael/net-gene.git
yarn
```

## Running

### Dev

```yarn dev```

### Prod

```yarn build && yarn start```
