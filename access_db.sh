#!/bin/bash

# This is a quick script to pull up the Heroku Postgres interface for this
# application.

# Constants.
APP_NAME="st-marys-sacred-heart"
APP_NAME_DEV="st-marys-sacred-heart-dev"

# Crash on the first failure.
set -e

# Process command line arguments.
local_app_name=$APP_NAME
for argument in $@; do
    if [ $argument = "--dev" ]; then
        local_app_name=$APP_NAME_DEV
    fi
done

# Check that we're logged into Heroku.
if ! heroku whoami >/dev/null 2>&1; then
    if ! heroku login; then
        echo "Unable to log in. Try running `heroku login` manually."
        exit 1
    fi
fi

# Let's get cracking...
gnome-terminal -- heroku pg:psql --app $local_app_name
