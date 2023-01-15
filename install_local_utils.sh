#!/bin/sh

### This script installs those packages which cannot be installed by naming
### them in package.json.

# Local constants.
APT_PACKAGES="gnome-terminal postgresql" # Space-separated list.

# Crash on the first failure.
set -e

# Install APT packages.
sudo apt install $APT_PACKAGES --yes
# Install Heroku CLI.
sudo npm install -g heroku
# Install the browserify command.
sudo npm install -g browserify
