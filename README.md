![Build Status](http://gitlab.youvolio.com/gapi/gapi-starter-postgres-sequelize/badges/master/build.svg)

# @Gapi Advanced Starter 
##### @Nginx, @Rabbitmq, @Postgres, @Sequelize, @Docker, @Graphql

## This is advanced example project related with [GAPI](https://github.com/Stradivario/gapi)
## To check basic example project go to [basic-example](https://github.com/Stradivario/gapi-starter)

## Included [gapi-sequelize](https://github.com/Stradivario/gapi-sequelize) module


#### To start developing clone repository

```bash
git clone https://github.com/Stradivario/gapi-starter-postgres-sequelize
```

#### Better use command line utility(gapi-cli) to install it type following command:

```bash
npm i -g gapi-cli
```



#### Type the following command to create new project from scratch via CLI

```bash
gapi-cli new my-project --advanced
```

#### To start project for "development" type:

```bash
npm start
```

#### To stop project for "production" type:
Following command will stop pm2 processes started
```bash
npm run stop:prod
```

###### Following commands will start RabbitMQ, PostgreSQL, API, NGINX as a services you need DOCKER for them
###### API will be served on https://localhost:80 and https://localhost:80/subscriptions

### Docker

#### To build project with Docker type:
```bash
gapi-cli app build
```

#### To start project with Docker type:
```bash
gapi-cli app start
```

#### To stop project type:
```bash
gapi-cli app stop
```

### Workers
###### All workers will be mapped as Proxy and will be reverted to https://localhost:80 and https://localhost:80/subscriptions
###### So you don't have to worry about if some of your workers stopped responding
###### TODO: Create monitoring APP for all workers and main API

#### To start workers type:
```bash
gapi-cli workers start
```

#### To stop workers type:
```bash
gapi-cli workers stop
```

###### To add more workers
###### By default there are 4 workers with 4 processes with "exec_mode: cluster" of the original process inside single docker container
###### You can control Processes inside single docker container from "root/process.yml" file.
```yml
apps:
  - script   : './src/main.ts'
    name     : 'APP'
    exec_mode: 'cluster'
    instances: 4

```

###### To map new worker as a stream open root/nginx/config/private/default


```nginx
upstream app_servers {
    server 182.10.0.3:9000; # Main process
    server 182.10.0.21:9000; # Worker 1
    server 182.10.0.22:9000; # Worker 2
    server 182.10.0.23:9000; # Worker 3
    server 182.10.0.24:9000; # Worker 4

    # Add more workers here
    # server 182.10.0.25:9000; # Worker 5
}

server {
    listen 80;
    server_name api.yourdomain.com;
    access_log api-yourdomain.access.log;

    location / {
       proxy_set_header Upgrade $http_upgrade;
       proxy_set_header Connection "upgrade";
       client_max_body_size 50M;
       proxy_set_header Host $http_host;
       proxy_set_header X-Real-IP $remote_addr;
       proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
       proxy_set_header X-Forwarded-Proto $scheme;
       proxy_set_header X-Frame-Options SAMEORIGIN;
       proxy_buffers 256 16k;
	     proxy_buffering off;
       proxy_buffer_size 16k;
       proxy_read_timeout 600s;
       proxy_pass http://app_servers;
    }

    location /subscriptions {
         # prevents 502 bad gateway error
        proxy_buffers 8 32k;
        proxy_buffer_size 64k;

        # redirect all HTTP traffic to localhost:9000;
        proxy_pass http://app_servers/subscriptions;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header Host $http_host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        #proxy_set_header X-NginX-Proxy true;

        # enables WS support
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
	      proxy_buffering off;
        proxy_read_timeout 999999999;

    }
    if ($scheme = http) {
       return 301 https://$server_name$request_uri;
    }
    listen 443;
    ssl on;
    ssl_certificate         /usr/share/certs/cert.pem;
    ssl_certificate_key     /usr/share/certs/cert.key;
}


```

###### When you add another worker it should be on different IP with same port 9000
###### Open root/gapi-cli.conf.yml file you will find this file:

```yml

commands:
  workers:
    start: 'gapi-cli workers start-1 && gapi-cli workers start-2 && gapi-cli workers start-3 && gapi-cli workers start-4'
    stop: 'docker rm -f gapi-api-prod-worker-1 && docker rm -f gapi-api-prod-worker-2 && docker rm -f gapi-api-prod-worker-3 && docker rm -f gapi-api-prod-worker-4'
    start-1: 'docker run -d --network=gapiapiprod_gapi --ip=182.10.0.21 --name gapi-api-prod-worker-1 -p 9001:9000 gapi/api/prod'
    start-2: 'docker run -d --network=gapiapiprod_gapi --ip=182.10.0.22 --name gapi-api-prod-worker-2 -p 9002:9000 gapi/api/prod'
    start-3: 'docker run -d --network=gapiapiprod_gapi --ip=182.10.0.23 --name gapi-api-prod-worker-3 -p 9003:9000 gapi/api/prod'
    start-4: 'docker run -d --network=gapiapiprod_gapi --ip=182.10.0.24 --name gapi-api-prod-worker-4 -p 9004:9000 gapi/api/prod'
    example-worker-with-port: 'docker run -d --network=gapiapiprod_gapi --ip=182.10.0.25 --name gapi-api-prod-worker-5 -p 9001:9000 gapi/api/prod'
  app: 
    start: 'docker-compose -p gapi-api-prod up --force-recreate'
    stop: 'docker rm -f gapi-api-nginx && docker rm -f gapi-api-prod && docker rm -f gapi-api-rabbitmq'
    build: 'docker build -t gapi/api/prod .'
    rm-app: 'docker rm -f gapi-api-nginx && docker rm -f gapi-api-prod && docker rm -f gapi-api-rabbitmq'
  rabbitmq:
    enable-dashboard: 'docker exec gapi-api-rabbitmq rabbitmq-plugins enable rabbitmq_management'

  # To run these commands you need to type "gapi-cli docker start|stop|build|worker1|worker2|worker3|etc"
  
  # You can define your custom commands for example 
  # commands:
  #   your-cli:
  #     my-command: 'npm -v'
  # This command can be executed as "gapi-cli your-cli my-command"

```
###### Adding one more worker:
```yml
start-5: 'docker run -d --network=gapiapiprod_gapi --ip=182.10.0.25 --name gapi-api-prod-worker-5 -p 9005:9000 gapi/api/prod'
```
###### Then edit start task inside workers to start new worker 5 
```yml
start: 'gapi-cli workers start-1 && gapi-cli workers start-2 && gapi-cli workers start-3 && gapi-cli workers start-4 & gapi-cli workers start-5'
```

###### Thats' it!! Now you have 4 processes like CLUSTERS inside 1 docker container with ip 182.10.0.25 and external port(optional) 9005;
###### You can specify worker also without port because all workers are inside internal network called "gapiapiprod_gapi" 
###### 182.10.0.21/22/23/24/25:9000 

```yml
start-5: 'docker run -d --network=gapiapiprod_gapi --ip=182.10.0.25 --name gapi-api-prod-worker-5 gapi/api/prod'
```

###### If you want to change port forwarding to another port you need to set just nginx configuration:

```yml
  nginx:
    image: sameersbn/nginx:1.10.1-5
    ports:
      - "81:80"
      - "443:443"
```

###### Now you can find your API served onto https://localhost:81/ and https://localhost:81/subscriptions
###### All workers don't care about that  because they will be served and mapped from nginx to port 80.

###### You can check docker-compose file to configurate environment variables
```yml
version: '2'
services:

  nginx:
    image: sameersbn/nginx:1.10.1-5
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/config:/etc/nginx
      - ./nginx/html:/usr/share/nginx/html/
      - ./nginx/certs:/usr/share/certs
    restart: always
    container_name: gapi-api-nginx
    networks:
      default:
        ipv4_address: 182.10.0.2

  api:
    image: gapi/api/prod:latest
    ports:
      - "9000:9000"
    environment:
      - NODE_ENV=production
      - API_PORT=9000
      - GRAPHIQL_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRhNGVuc3RvcmVAZ21haWwuY29tIiwic2NvcGUiOlsiQURNSU4iXSwiaWQiOjIsImlhdCI6MTUxMTk3NDkzNX0.M9PnW2IrVp4XGRvbzFrl0tx6vqs6oXItFK-wF5roneI
      - AMQP_HOST=182.10.0.5
      - AMQP_PORT=5672
      - CERT_PATH=

      # Production db config
      - DB_HOST=182.10.0.4
      - DB_PORT=5432
      - DB_NAME=postgres
      - DB_USERNAME=dbuser
      - DB_PASSWORD=dbuserpass

    restart: always
    mem_limit: 1000000000
    cpu_shares: 73
    container_name: gapi-api-prod
    depends_on:
      - nginx
    networks:
      default:
        ipv4_address: 182.10.0.3

  PostgreSQLDev:
    image: sameersbn/postgresql:9.5-3
    ports:
      - "5432:5432"
    environment:
      - DEBUG=false
      - TIMEZONE=Europe/Sofia
      - LOCALE=bg_BG.UTF-8

      - DB_USER=dbuser
      - DB_PASS=dbuserpass
      - DB_NAME=postgres
      - DB_TEMPLATE=

      - DB_EXTENSION=

      - REPLICATION_MODE=
      - REPLICATION_USER=
      - REPLICATION_PASS=
      - REPLICATION_SSLMODE=
    restart: always
    container_name: gapi-api-postgres

    networks:
      default:
        ipv4_address: 182.10.0.4

  rabbitMq:
    image: rabbitmq:3.7.2
    ports:
      - "15672:15672"
      - "5672:5672"
      - "5671:5671"
      - "4369:4369"
    restart: always
    container_name: gapi-api-rabbitmq
    networks:
      default:
        ipv4_address: 182.10.0.5

networks:
  default:
    driver: bridge
    ipam:
     config:
       - subnet: 182.10.0.0/16
         gateway: 182.10.0.1


```

##### After successfully started project you can open your browser to localhost:80 or 182.10.0.3:9000 the api will be served there


TODO: Better documentation...

Enjoy ! :)
