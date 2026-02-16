#!/bin/bash

VERSION=$1

if [ -z "$VERSION" ]; then
  echo "Error: Version argument is required"
  exit 1
fi

echo "Building Docker image for version $VERSION..."

# Build and tag the image
# -f specifies the Dockerfile location
# context is still current directory (.)
docker build -f docker/release/Dockerfile . \
  -t ghcr.io/open-ev-data/open-ev-data-ui:$VERSION \
  -t ghcr.io/open-ev-data/open-ev-data-ui:latest

# Push the images if logged in (CI environment)
if [ "$CI" = "true" ]; then
  echo "Pushing Docker images..."
  docker push ghcr.io/open-ev-data/open-ev-data-ui:$VERSION
  docker push ghcr.io/open-ev-data/open-ev-data-ui:latest
fi
