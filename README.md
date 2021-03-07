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
![monitors-main-screen](https://user-images.githubusercontent.com/36458741/110242864-9945ab80-7f60-11eb-9103-7e1c286ae854.png)

### Main screen - Graphs view:
![graphs-main-screen](https://user-images.githubusercontent.com/36458741/110242824-6a2f3a00-7f60-11eb-9069-0f4a81272e96.png)

### Graph create screen:
![create-graph](https://user-images.githubusercontent.com/36458741/110242872-a82c5e00-7f60-11eb-8420-2660543a34f2.png)

### Monitor create screen:
![create-monitor](https://user-images.githubusercontent.com/36458741/110242873-a95d8b00-7f60-11eb-907f-094d88ca0caa.png)

### Priviledges screen:
#### Users Manage screen:
![users-screen](https://user-images.githubusercontent.com/36458741/110242890-b8dcd400-7f60-11eb-86e3-e2944474390d.png)

#### Users Priviledges Manage screen:
![users-privileges-screen](https://user-images.githubusercontent.com/36458741/110242909-c6925980-7f60-11eb-906a-713ee70f644d.png)

#### Users Dashboard View Manage screen:
![users-view](https://user-images.githubusercontent.com/36458741/110242915-d3af4880-7f60-11eb-87d3-ae614692c759.png)

### Create User screen:
![create-user](https://user-images.githubusercontent.com/36458741/110242929-dca01a00-7f60-11eb-9bab-1cfedf17afa0.png)

### Admin screen:
#### Excel File Check & Upload screen:
![upload-xlsx](https://user-images.githubusercontent.com/36458741/110242936-e7f34580-7f60-11eb-9896-1dfc96fd5d97.png)

#### Database Manage and Export to Excel File screen:
![manage-view-xlsx](https://user-images.githubusercontent.com/36458741/110242941-ee81bd00-7f60-11eb-810c-4d417af26370.png)
