# Matpash Dashboard Generator

## - What is all the fuzz about?
We've established that some organizations still use the form of excels to store and analyze their data. We all know that in some point no one wants to stare at numbers and hope to get to any good conclusion about the data that has been filled in excel sheets.
So, what is our solution to the problem? make it easier to read and analyze data over graphs representation.

**Due to the subject of the project any excel conversion which isn't in the form we suggested won't work**


If an individual wants to have a look at the project at live view please visit: 185.60.170.80:5050 with user and password set as: 'tester'

## Steps to install:
### inside the project directory: `npm install` - will install any node module needed for the server
### inside the project directory: `pip install -r requirements.txt` - will install any conversion script modules needed
### inside the client directory: `npm install` - - will install any node module needed for the client

## Configure database:
### First install Postgresql server + pgadmin v4. afterwards please create a server and a user which autherized to log-in with the name matpash (Both are names matpash), with password equal to '1234'.
### Set up databases: dashboardsdb, usersdb and maindb all be with the same owner - matpash.
### Upload the database files located in the base dir of the project as a restored databases.

## run client & server:
### `npm run dev`

## run only the client:
### `npm run client`

## run only the server:
### `npm run server`


## Screenshots from desktop view
### Main screen - Goldens view:
![alt text](https://github.com/ishaishai/screeenshots/blob/main/matpash/desktop/monitors-main-screen.png?raw=true)


### Main screen - Graphs view:
![alt text](https://github.com/ishaishai/screeenshots/blob/main/matpash/desktop/graphs-main-screen.png?raw=true)

### Graph create screen:
![alt text](https://github.com/ishaishai/screeenshots/blob/main/matpash/desktop/create-graph.png?raw=true)

### Monitor create screen:
![alt text](https://github.com/ishaishai/screeenshots/blob/main/matpash/desktop/create-monitor.png?raw=true)

## Previledges screen:
### Users Manage screen:
![alt text](https://github.com/ishaishai/screeenshots/blob/main/matpash/desktop/users-screen.png?raw=true)

### Admin screen:

