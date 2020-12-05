# User-Auth
The focus of this project is to create an authentication/authorization system (token/bearer Authentication). This project is composed of a front-end built with 
Angular JS and a RESTful API built with Node.js and Express.js. The API uses an SqLite database built with Typeorm. Both front-end and API are written in Typescript.
The authentication strategy sumarized steps are:
	1 - Hash the password with bcrypt using a salt.
	2 - Stored the password hash in the database.
	3 - Generate a random string with Node.js built-in crypto to validate the account.
	4 - Hash and store the string in the database.
	5 - Send an email message to user email address with a clickble route to validate the account.
	6 - On successful login generete a jwt token with jsonwebtoken package and send it to the client.
	7 - Client stores the token in localStorage or sessionStorage.
	8 - Every subsequent request will send the token in 'Authorization' header.
	9 - Routes that require authentication will validate the token before allow access to resources.
The authentication system also allows to change password with verification code sent by email and validated in the API and to 
re-send account validation email.

## Install tools
	- Node.js
	- Visual Studio Code
        
## Run projects
- Both projects bellow must be running before you use system.

### Start front-end project
Inside Visual Studio Code
	1 - Open a terminal (a window):
		- Go to 'Terminal' menu option and choose 'New Terminal'
	2 - Inside the terminal type: 'cd web'
	3 - Hit Enter key
	4 - Type: 'npm install'
	5 - Hit Enter key
	6 - Wait (some tools will be installed)
        7 - Type 'npm start'
	8 - Hit Enter key
	9 - Wait for the project to load
	10 - The project will be ready to use when you see a message 'Compiled successfully' inside the terminal
	- Obs: to start the project again you don't need to repeat steps 4 and 5. They are needed only once.

### Start back-end project
Inside Visual Studio Code
	1 - Open a new terminal:
		- Go to 'Terminal' menu option and choose 'Split Terminal' (a second terminal will open)
    	2 - Inside the terminal type: 'cd backend'
	3 - Hit Enter key
	4 - Type 'npm install'
	5 - Hit Enter key
	6 - Wait (some tools will be installed)
        7 - Type 'npm run typeorm migration:run'
	8 - Hit Enter key
	9 - Wait (some tools will be installed)
        10 - Type 'npm run dev'
	11 - Hit Enter key
	12 - Wait for the project to load
	13 - The project will be ready to use when you see a message 'server listening on port 2000' inside the terminal
	- Obs: to start the project again you don't need to repeat steps 4, 5, 6, 7 and 8. They are needed only once.

### View project
In a browser of your choice:
	1 - Go to address bar and type: 'localhost:4200'
	2 - Hit Enter key

# How to use it

# License & copyright

Licensed under the [MIT License](LICENSE.txt).

© Alan D Oliveira
