docker run -dit --rm \
  --name server$1 \
  -p 300$1:8080 \
  --network bully \
  --env SERVER_PORT=300$1 \
  project/tyrann-server