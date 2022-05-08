#!/bin/sh

# Crash on the first failure.
set -e

# Install Heroku Command Line Interface.
sudo snap install --classic heroku
# Install PostgreSQL.
sudo apt --yes install postgresql
# Install the standard Ubuntu terminal (if necessary).
sudo apt --yes install gnome-terminal
