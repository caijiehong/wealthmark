#/bin/bash

set -e

pnpm install

npx turbo run web#build

