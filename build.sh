#!/usr/bin/bash

pm2 stop expedients
git pull
pnpm shared build
pnpm api build
export NODE_OPTIONS="--max-old-space-size=4096"
pnpm client build
pm2 start expedients
