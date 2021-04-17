#!bash

# Build the project if it has not been made before.
npm run build

# Build the image for the server.
docker build -t project/tyrann-server:latest .