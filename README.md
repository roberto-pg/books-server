# My Books Api

### Restfull API for the My Books app

<br/>
<br/>

## Installation:

<br/>

<h3>Clone the repository: </h3>

```
git clone https://github.com/roberto-pg/mybooks-back.git books
```

```
cd books
```

```
npm install
```

```
touch .env
```

</br>

<h3>Enter static values into the .env file:</h3>

```
PORT=3333
DB_HOST=books-db
DB_NAME= <database_name>
DB_USER= <username>
DB_PASS= <password>
JWT_SECRET= (choose a password to generate the jwt token)
IMAGE_STORAGE=./public/images
DIR_IMAGE=http://localhost:8080/
```

<br/>
<br/>
<br/>

## Create Docker Containers:

<br/>

### This Server uses Nginx to provide static images of the book covers. Install the Nginx container before running docker-compose:

```
docker run -d --name nginx -p 8080:80 --restart always -v /home/<user>/docker/nginx/books:/usr/share/nginx/html/books nginx
```

<br/>

<h3>Run the command at the root of the project:</h3>

```
docker compose up -d
```

```
docker ps -a
```

<br/>
<br/>

<h3>Access the Docker container from the terminal:</h3>

```
docker exec -it books-db bash
```

```
psql -U postgres
```

<br/>
<br/>

<h3>Create Database and User (inside the books-db container):</h3>

```
create database <database_name>;
```

```
create user <username> with password '<password>';
```

```
grant all privileges on database "<database_name>" to <username>;
```

```
\c books
```

```
grant usage, create on schema public to <username>;
```

```
Ctrl + D
```

<br/>
<br/>

<h3>Run Migrations (Inside the books container):</h3>

```
docker exec -it books sh
```

```
npx knex migrate:latest
```

```
Ctrl + D
```

<br/>
<br/>

## Okay, it's working!
