#!/bin/sh

# This script runs browserify on the desired JavaScript files.

# Constants.
PATH_TO_FOLDER_TO_BROWSERIFY="public/frontend_scripts/to_browserify"
PATH_TO_BROWSERIFIED_FOLDER="public/frontend_scripts/browserified"

# Crash on the first failure.
set -e

# Let's get cracking...
for filepath in $PATH_TO_FOLDER_TO_BROWSERIFY/*.js; do
    browserify $filepath > $PATH_TO_BROWSERIFIED_FOLDER/$(basename $filepath)
done
