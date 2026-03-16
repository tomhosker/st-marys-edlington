#!/bin/sh

# This script runs browserify on the desired JavaScript files.

# Constants.
PATH_TO_THIS_DIR=$(dirname $(realpath $0))
PATH_TO_FRONTEND_SCRIPTS="$PATH_TO_THIS_DIR/../public/frontend_scripts"
PATH_TO_FOLDER_TO_BROWSERIFY="$PATH_TO_FRONTEND_SCRIPTS/to_browserify"
PATH_TO_BROWSERIFIED_FOLDER="$PATH_TO_FRONTEND_SCRIPTS/browserified"

# Crash on the first failure.
set -e

# Let's get cracking...
for filepath in $PATH_TO_FOLDER_TO_BROWSERIFY/*.js; do
    browserify $filepath > $PATH_TO_BROWSERIFIED_FOLDER/$(basename $filepath)
done
