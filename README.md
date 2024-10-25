## FULL STACK MONOREPO
- pnpm
- monorepo
- Nest.js
- postgres
- React
- Ant Design

## SETUP ENVIRONMENT
- create a file `.env` with variables from `.env.example`
- use `node` major to 20
- use `pnpm` as global(install it with `npm i -g pnpm`)

## SETUP API
- run API in dev mode
```
pnpm api start:dev
```
- run API in prod mode
```
pnpm api build
```
```
pnpm api start:prod
```

## SETUP DATABASE
- migrate database
```
pnpm api migrate:run
```
**Notice**: first to setup database is necesary `run api in dev | prod` mode to generate the `"/dist"` folder needed to run migration


## SETUP FRONTEND
- run FRONTEND in dev mode
```
pnpm client dev
```
- run FRONTEND in prod mode
```
pnpm client build
```
```
pnpm client preview
```

## SETUP FULL STACK APP WITH DOCKER
- Needed `docker` and `docker-compose`
```
docker-compose up
```