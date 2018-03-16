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

#### Better use command line utility(gapi) to install it type following command:

```bash
npm i -g gapi-cli
```



#### Type the following command to create new project from scratch via CLI

```bash
gapi new my-project --advanced
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


### Testing

###### To start developing with testing GAPI uses JEST and gapi-cli is preconfigurated for your needs! :)

#### To run single test type:
```bash
gapi test
```

#### Testing watch mode
###### Note: You need to start server before running tests 
###### Note: Everytime you make change to server it will restart server and execute tests
###### Note: To add more tests just create e2e.spec.ts or unit.spec.ts somewhere inside the application

##### Start the application
```bash
gapi start
```
##### Execute test with --watch argument
```bash
gapi test --watch
```
###### You will end up with something like this
 ![Alt Text](https://raw.githubusercontent.com/Stradivario/gapi-cli/master/docs/assets/images/sidebyside.png)

#### Custom logic before testing ( for example creating MOCK users to database before testing)
s
##### Create file test.ts inside root/src/test.ts with this content
##### Everytime you run test with --before argument it will set environment variable BEFORE_HOOK
```typescript
  if (process.env.BEFORE_HOOK) {
    // do something here
  }
```

##### Then execute tests with --before
```bash
gapi test --before
```

###### This command will start root/src/test.ts file and will wait for process.exit(0) so you can customize your before logic check [this](https://github.com/Stradivario/gapi-starter-postgres-sequelize-rabbitmq/blob/master/src/test.ts#L73) link for reference


###### Following commands will start RabbitMQ, PostgreSQL, API, NGINX as a services you need DOCKER for them
###### API will be served on https://localhost:80 and https://localhost:80/subscriptions

### Docker

#### To build project with Docker type:
```bash
gapi app build
```

#### To start project with Docker type:
```bash
gapi app start
```

#### To stop project type:
```bash
gapi app stop
```


### Workers
###### All workers will be mapped as Proxy and will be reverted to https://localhost:80 and https://localhost:80/subscriptions
###### So you don't have to worry about if some of your workers stopped responding
###### TODO: Create monitoring APP for all workers and main API

#### To start workers type:
```bash
gapi workers start
```

#### To stop workers type:
```bash
gapi workers stop
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
###### Open root/gapi.conf.yml file you will find this file:

```yml
config:
# Application configuration
  app: 
    local:
      API_PORT: 9000
      API_CERT: ./cert.key
      NODE_ENV: development
      AMQP_HOST: 182.10.0.5
      AMQP_PORT: 5672
      DB_PORT: 5432
      DB_NAME: postgres
      DB_HOST: 182.10.0.4
      DB_USERNAME: dbuser
      DB_PASSWORD: dbuserpass
      GRAPHIQL: true
      ENDPOINT_TESTING: http://localhost:9000/graphql
      TOKEN_TESTING: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImtyaXN0aXFuLnRhY2hldkBnbWFpbC5jb20iLCJzY29wZSI6WyJBRE1JTiJdLCJpZCI6MSwiaWF0IjoxNTE2OTk2MzYxfQ.7ANr5VHrViD3NkCaDr0nSWYwk46UAEbOwB52pqye4AM
      GRAPHIQL_TOKEN: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImtyaXN0aXFuLnRhY2hldkBnbWFpbC5jb20iLCJpZCI6MSwic2NvcGUiOlsiQURNSU4iXSwiaWF0IjoxNTIwMjkxMzkyfQ.9hpIDPkSiGvjTmUEyg_R_izW-ra2RzzLbe3Uh3IFsZg
    prod:
      API_PORT: 9000
      API_CERT: ./cert.key
      NODE_ENV: production
      AMQP_HOST: 182.10.0.5
      AMQP_PORT: 5672
      DB_PORT: 5432
      DB_HOST: 182.10.0.4
      DB_USERNAME: dbuser
      DB_PASSWORD: dbuserpass
      DB_NAME: postgres
# Testing configuration for local(dev) or worker(running tests as a separate worker with separate database)
  test: 
    local: extends app/local
    worker:
      API_PORT: 9000
      API_CERT: ./cert.key
      NODE_ENV: production
      DB_PORT: 5432
      DB_HOST: 182.10.0.99
      AMQP_HOST: 182.10.0.5
      AMQP_PORT: 5672
      DB_USERNAME: dbuser
      DB_PASSWORD: dbuserpass
      DB_NAME: postgres
      ENDPOINT_TESTING: http://182.10.0.101:9000/graphql
      TOKEN_TESTING: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImtyaXN0aXFuLnRhY2hldkBnbWFpbC5jb20iLCJzY29wZSI6WyJBRE1JTiJdLCJpZCI6MSwiaWF0IjoxNTE2OTk2MzYxfQ.7ANr5VHrViD3NkCaDr0nSWYwk46UAEbOwB52pqye4AM
  schema:
    introspectionEndpoint: http://localhost:9000/graphql
    introspectionOutputFolder: ./src/app/core/api-introspection

commands:
  testing:
    stop:
      - docker rm -f gapi-api-prod-worker-tests-executor
      - docker rm -f gapi-api-prod-worker-tests-provider
    start:
      - gapi testing start-provider
      - sleep 10
      - gapi testing start-executor
      - echo Cleaning...
      - gapi testing stop
    start-executor:
      - docker run -d --network=gapiapiprod_gapi --ip=182.10.0.100 --name gapi-api-prod-worker-tests-executor gapi/api/prod
      - docker exec gapi-api-prod-worker-tests-provider npm -v
      - gapi test --worker --before
    start-provider: docker run -d --network=gapiapiprod_gapi --ip=182.10.0.101 --name gapi-api-prod-worker-tests-provider gapi/api/prod
  workers:
    start:
      - gapi workers start-1
      - gapi workers start-2
      - gapi workers start-3
      - gapi workers start-4
    stop:
      - docker rm -f gapi-api-prod-worker-1
      - docker rm -f gapi-api-prod-worker-2
      - docker rm -f gapi-api-prod-worker-3
      - docker rm -f gapi-api-prod-worker-4
    start-1: docker run -d --network=gapiapiprod_gapi --ip=182.10.0.21 --name gapi-api-prod-worker-1 gapi/api/prod
    start-2: docker run -d --network=gapiapiprod_gapi --ip=182.10.0.22 --name gapi-api-prod-worker-2 gapi/api/prod
    start-3: docker run -d --network=gapiapiprod_gapi --ip=182.10.0.23 --name gapi-api-prod-worker-3 gapi/api/prod
    start-4: docker run -d --network=gapiapiprod_gapi --ip=182.10.0.24 --name gapi-api-prod-worker-4 gapi/api/prod
    example-worker-with-port: docker run -d --network=gapiapiprod_gapi --ip=182.10.0.25 --name gapi-api-prod-worker-5 -p 9001:9000 gapi/api/prod
  app:
    start:
      - docker-compose -p gapi-api-prod up --force-recreate -d
      - gapi rabbitmq enable-dashboard
    stop:
      - gapi nginx stop
      - gapi api stop
      - gapi rabbitmq stop
      - gapi postgres stop
    build: docker build -t gapi/api/prod .
  api:
    stop: docker rm -f gapi-api-prod
  nginx:
    stop: docker rm -f gapi-api-nginx
  postgres:
    stop: docker rm -f gapi-api-postgres
  rabbitmq:
    stop: docker rm -f gapi-api-rabbitmq
    restart: docker restart gapi-api-rabbitmq
    enable-dashboard: docker exec gapi-api-rabbitmq rabbitmq-plugins enable rabbitmq_management

# You can define your custom commands for example 
# commands:
#   your-cli:
#     my-command: 'npm -v'
# This command can be executed as "gapi your-cli my-command"
```
###### Adding one more worker:
```yml
start-5: 'docker run -d --network=gapiapiprod_gapi --ip=182.10.0.25 --name gapi-api-prod-worker-5 -p 9005:9000 gapi/api/prod'
```
###### Then edit start task inside workers to start new worker 5 
```yml
start: 'gapi workers start-1 && gapi workers start-2 && gapi workers start-3 && gapi workers start-4 & gapi workers start-5'
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
      - "81:80"
      - "444:443"
    volumes:
      - ./nginx/config:/etc/nginx
      - ./nginx/html:/usr/share/nginx/html/
      - ./nginx/certs:/usr/share/certs
    restart: always
    container_name: gapi-api-nginx
    networks:
      gapi:
        ipv4_address: 182.10.0.2

  api:
    image: gapi/api/prod:latest
    ports:
      - "9000"
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
      - rabbitMq
      - PostgreSQLDev
    networks:
      gapi:
        ipv4_address: 182.10.0.3

  PostgreSQLDev:
    image: sameersbn/postgresql:9.5-3
    ports:
      - "5432"
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
      gapi:
        ipv4_address: 182.10.0.4

  PostgreSQLDevTesting:
    image: sameersbn/postgresql:9.5-3
    ports:
      - "5432"
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
    container_name: gapi-api-postgres-testing
    networks:
      gapi:
        ipv4_address: 182.10.0.99

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
      gapi:
        ipv4_address: 182.10.0.5

  pgadmin:
    image: thajeztah/pgadmin4
    ports:
      - "5050"
    volumes:
      - /usr/bin/:/usr/pg
      - /usr/database/:/usr/database
      - /tmp/:/tmp
    restart: always
    container_name: gapi-api-pg-admin
    networks:
      gapi:
        ipv4_address: 182.10.0.6

networks:
  gapi:
    driver: bridge
    ipam:
     config:
       - subnet: 182.10.0.0/16
         gateway: 182.10.0.1


```

##### After successfully started project you can open your browser to localhost:80 or 182.10.0.3:9000 the api will be served there


TODO: Better documentation...

Enjoy ! :)
