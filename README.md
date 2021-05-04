# TouchPoint


## client folder (frontend)
- contains React.js frontend code
- runs on localhost:3000

#### Starting the server
1. go into terminal and cd into `client` folder
```
cd client
```
2. install dependencies 
```
npm i 
```
3. start the server
```
npm start
```
4. go to [localhost:3000](http://localhost:3000) on the browser

- _changes on the browser are made as you code_
- _if you want to interact with backend you need to start it as well_

## api folder (backend)
- contains Node.js with Express backend code
- runs on localhost:8000

#### Starting the server
1. go into terminal and cd into `api` folder
```
cd api
```
2. install dependencies 
```
npm i 
```
3. start the server
```
npm start
```
- _the server needs to be restarted for every code change_
- _alternatively, if you don't want to restart every time then use [nodemon](https://nodemon.io/) and start server by running `nodemon api`._
