#!/usr/bin/env sh
# Run database migrations
npm run prisma:deploy

# Run the main container command
exec "$@"
