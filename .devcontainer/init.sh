#!/bin/bash

set -xe

sudo chown -R node /workspace

pnpm config set store-dir /home/node/.local/share/pnpm/store

pnpm install --frozen-lockfile
cd packages/db && pnpm prisma db push
pnpm build