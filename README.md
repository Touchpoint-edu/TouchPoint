# TouchPoint

Run `npm i` on both folders I believe and `npm start` with two terminals if you want it to work

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

_changes are made as you code_

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
- _alternatively, use [nodemon](https://nodemon.io/) and start server by running `nodemon api`_
