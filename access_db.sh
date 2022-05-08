#!/bin/bash

# This is a quick script to pull up the Heroku Postgres interface for this
# application.

# Constants.
APP_NAME="st-marys-edlington"

# Crash on the first failure.
set -e

# Check that we're logged into Heroku.
if ! heroku whoami >/dev/null 2>&1; then
    if ! heroku login; then
        exit 1
    fi
fi

gnome-terminal -- heroku pg:psql --app $APP_NAME

# Run the below in order to run an SQL script.
#     heroku pg:psql --app st-marys-edlington < path/to/script
