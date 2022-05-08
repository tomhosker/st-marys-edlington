#!/bin/sh

### This code runs prettier on all the code in this repo.

# Crash on the first failure.
set -e

npx prettier --write .
