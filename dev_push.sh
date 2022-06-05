#!/bin/sh

### This script (1) pushes the local development branch to the master branch of
### Heroku's "dev" remote, and (2) pushes said local branch to the "origin"
### remote.

# Local constants.
DEV_REMOTE_NAME="heroku-dev"
DEVELOPMENT_BRANCH_NAME="devel"

# Crash on the first failure.
set -e

# Let's get cracking...
sh run_browserify.sh
git push $DEV_REMOTE_NAME $DEVELOPMENT_BRANCH_NAME:master
git push origin $DEVELOPMENT_BRANCH_NAME
