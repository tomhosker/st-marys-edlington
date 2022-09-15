### This script adds enables an automatically generated SSL certificate for a
### Heroku app with a custom domain.

# Local constants.
APP_ID="st-marys-sacred-heart"

# Fail on the first error.
set -e

# Let's get cracking...
heroku certs:auto:enable --app $APP_ID
