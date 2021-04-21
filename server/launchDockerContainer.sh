NETWORK_NAME="project_tyrann_network"
CONTAINER_NAME="project/tyrann-server"

# Create network if it does not exist already
docker network create $NETWORK_NAME &>/dev/null;

# Get the current gateway of the network
NETWORK_GATEWAY=$(docker network inspect $NETWORK_NAME | grep 'Gateway' | cut -d':' -f2 | xargs)

docker run -dit --rm \
  --name server_$1 \
  --network=$NETWORK_NAME \
  --env SERVER_NETWORK_IP="$NETWORK_GATEWAY"\
  --env SERVER_PORT="$1" \
  -p $1:8080 \
  $CONTAINER_NAME