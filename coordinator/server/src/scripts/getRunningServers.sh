CONTAINER_NAME='project/tyrann-server'

RUNNING_CONTAINERS=$(docker ps --filter "ancestor=$CONTAINER_NAME" --format '{{.Names}} {{.Ports}}')

RUNNING_CONTAINERS_INFORMATION=($RUNNING_CONTAINERS)
SERVER_STATUS=()
SERVER_ID=()

for ((i = 0; i < ${#RUNNING_CONTAINERS_INFORMATION[@]}; i += 2))
do
  RUNNING_CONTAINERS_INFORMATION[i+1]=$(echo ${RUNNING_CONTAINERS_INFORMATION[i+1]} | cut -d':' -f2 | cut -d'-' -f1)
  SERVER_STATUS+=($(curl -s 127.0.0.1:${RUNNING_CONTAINERS_INFORMATION[i+1]}/status))
  SERVER_ID+=($(curl -s 127.0.0.1:${RUNNING_CONTAINERS_INFORMATION[i+1]}/id | cut -d':' -f2 | cut -d'}' -f1))
done

RESULT="["
for ((i = 0; i < ${#RUNNING_CONTAINERS_INFORMATION[@]}; i += 2))
do
  RESULT+="{"
  RESULT+="\"serverName\":\"${RUNNING_CONTAINERS_INFORMATION[i]}\","
  RESULT+="\"serverPort\":\"${RUNNING_CONTAINERS_INFORMATION[i+1]}\","
  RESULT+="\"serverStatus\":\"${SERVER_STATUS[i]}\","
  RESULT+="\"serverId\":${SERVER_ID[i]}"
  RESULT+="},"
done
RESULT="${RESULT%,*}"
RESULT+="]"

echo $RESULT