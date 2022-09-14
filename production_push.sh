#!/bin/sh

### This script:
###     (1) runs browserify;
###     (2) pushes the local master branch to the master branch of Heroku's
###         main remote;
###     (3) pushes said local branch to the "origin" remote.

# Crash on the first failure.
set -e

# Let's get cracking...
sh run_browserify.sh
git push heroku master
git push origin master
