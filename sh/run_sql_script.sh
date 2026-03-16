### This code run a given SQL script against the database.

# Local constants.
APP_ID="st-marys-sacred-heart"

# Fail on the first error.
set -e

# Check input.
if [ $# -ne 1 ]; then
    echo "Usage: $0 path-to-script" >&2
    exit 1
fi
path_to_script=$1

# Run that script!
heroku pg:psql --app $APP_ID < $path_to_script
