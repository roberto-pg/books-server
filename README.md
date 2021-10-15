# My Books Api
### Restfull API for the My Books app
<br/>
<br/>


## Installation:
<br/>

<h3>Clone the repository: </h3>

```
git clone https://github.com/roberto-pg/mybooks-back
```
```
cd mybooks-back
```
```
yarn
```
```
touch .env
```

</br>

<h3>Enter static values into the .env file:</h3>

```
PORT=3333
DB_HOST=mybooks-postgres
DB_NAME= <database_name>
DB_USER= <username>
DB_PASS= <password>
JWT_SECRET= (choose a password to generate the jwt token)
IMAGE_STORAGE=./public/images/
DIR_IMAGE=http://localhost:8181/
```

<br/>
<br/>
<br/>

## Create Docker Containers:
<br/>
<h3>Run the command at the root of the project:</h3>

```
docker-compose up -d
```
```
docker ps -a
```

<br/>
<br/>

<h3>Access the Docker container from the terminal:</h3>

```
docker exec -it mybooks-postgres bash
```
```
psql -U postgres
```

<br/>
<br/>

<h3>Create Database and User (inside the mybooks-postgres container):</h3>

```
create database <database_name>;
```
```
create user <username> with password "<password>";
```
```
grant all privileges on database "<database_name>" to <username>;
```
```
Ctrl + C
```

<br/>
<br/>

<h3>Run Migrations (Inside the mybooks container):</h3>

```
docker exec -it mybooks sh
```
```
yarn knex migrate:latest
```
```
Ctrl + C
```

<br/>
<br/>

## Okay, it's working!
