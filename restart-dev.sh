docker stop exrates-client
docker rm exrates-client
docker rmi exrates-front:integration

./start-dev.sh
