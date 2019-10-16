docker build -t exrates-front:integration .
docker run -d -p 4200:80 --name exrates-client --restart always exrates-front:integration
