#!/bin/sh

### This scripts runs prettier on all the code in this repo.

# Local constants.
PATH_TO_THIS_DIR=$(dirname $(realpath $0))
PATH_TO_TARGET_DIR="$PATH_TO_THIS_DIR/.."

# Crash on the first failure.
set -e

# Let's get cracking...
npx prettier --write $PATH_TO_TARGET_DIR
