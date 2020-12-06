# User-Auth
The focus of this project is to create an authentication/authorization system (token/bearer Authentication) to allow access to an API. The project is composed of a front-end built with Angular.js and a RESTful API built with Node.js and Express.js. The API uses an SqLite database built with Typeorm using migrations. Both front-end and API are written in Typescript.
Authentication strategy sumarized steps:
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

# 1 Run in your machine (Windows 10)
 - You need basic understanding of Windows to follow this guide.
 - You need admin rights to install the tools without aditional configuration.

## 1.1 Install tools
 - Node.js:
	- Download: https://nodejs.org/en/download/.
	- Run the wizard and install everything that is suggested.
	- When Node.js installation finish, a window will open to install chocolatey (a software needed to install dependencies for Node.js). Just hit the space key twice and the installation will proceed to new window 'PowerShell'.
	- When the installation in PowerShell is finished type 'ENTER' and hit enter to finish.
 - Visual Studio Code:
	- Download the installer: https://code.visualstudio.com/Download
	- Install #####

## 1.2 Get the project repository to your machine
 - Choose one of the two options bellow:
	1 - Download the project:
On project repository (https://github.com/AlanDuOl/):
Locate a green button called 'Code' in the '<> Code' menu. Click the 'Code' button and click the option 'Download ZIP' inside the pop-up menu. This will download the project to your machine in a compressed format (.zip). Extract the project file. It will generate a folder called '#'.
	2 - Clone the project with Git (advanced user):
Install Git in your machine if you don't have it already. Then right click inside a folder of your choice and choose 'Git Bash Here' in the pop-up menu or open 'Git Bash' in the Windows start menu. Inside Git Bash Terminal type 'git clone ##'. This will create a folder called '#'.

## 1.3 Open the project with Visual Studio Code
 - Open Visual Studio Code.
 - Got 'File' menu and choose 'Open Folder'.
 - Locate the folder create in section 1.2.
 - Select the folder and hit the select button or duble click the folder.

## 1.4 Run projects
- Both projects bellow must be running in order for you to use the application.

### 1.4.1 Start front-end project
 - Inside Visual Studio Code
	1 - Open a terminal (a window):
		- Go to 'Terminal' menu option and choose 'New Terminal' (a window will open at the bottom of Visual Studio Code).
	2 - Inside the terminal type: 'cd web'.
	3 - Hit Enter key.
	4 - Type: 'npm install'.
	5 - Hit Enter key.
	6 - Wait (some tools will be installed).
	7 - Type 'npm start'.
	8 - Hit Enter key.
	9 - Wait for the project to load.
	10 - The project will be ready to use when you see a message 'Compiled successfully' inside the terminal.
	- Obs:
		- To stop the project press 'Ctrl + C' inside the terminal window, type 's' then hit 'Enter'. key.
		- To start the project again you don't need to repeat steps 4 and 5. They are needed only once.

### 1.4.2 Start back-end project
 - Inside Visual Studio Code
 	1 - Configure send email service:
		- Create and Ethereal email account (this is used to test the send email functionality):
			- Access this link https://ethereal.email/ and click the button 'Create Ethereal Account'.
			- Save the the account credentials for latter use.
			- We will need the SMTP service 'UserName' and 'Password'.
		- Use the Ethereal email account credential inside the project:
			- Go to 'View' menu and choose 'Explorer' option (if nothing happens it's because it is already opened). It is a side window in the left.
			- Inside Explorer window extend the folder structure of 'backend' folder (click it).
			- Inside 'backend' folder show the content of folder 'src' (click it).
			- Inside 'src' folder find a file named 'utils.ts' and double click it (it will open in the right).
			- Click inside the file and the press 'Ctrl + F' (a box will be shown). Inside the box copy and paste 'getSMTPTransporter'. It will hight light the code the you need to change.
			- Inside 'getSMTPTransporter' locate this: 
				auth: {
					user: '',
					pass: ''
				}
			- Inside 'auth' locate 'user' and put the your Ethereal email SMTP 'UserName' inside ''.
			- Inside 'auth' locate 'pass' and put the your Ethereal email SMTP 'Password' inside ''.
			- Save the file: press 'Ctrl + S' or go to 'File' menu and choose 'Save' option.
			- Close the file.
	2 - Open a new terminal:
		- Go to 'Terminal' menu option and choose 'Split Terminal' (a second terminal will open).
    3 - Inside the terminal type: 'cd backend'.
	4 - Hit Enter key.
	5 - Type 'npm install'.
	6 - Hit Enter key.
	7 - Wait (some tools will be installed).
    8 - Type 'npm run typeorm migration:run'.
	9 - Hit Enter key.
	10 - Wait (some tools will be installed).
    11 - Type 'npm run dev'.
	12 - Hit Enter key.
	13 - Wait for the project to load.
	14 - The project will be ready to use when you see a message 'server listening on port 2000' inside the terminal.
	- Obs:
		- To stop the project press 'Ctrl + C' inside the terminal window, type 's' then hit 'Enter'. key.
		- To start the project again you don't need to repeat steps 4, 5, 6, 7 and 8. They are needed only once.

### 1.4.3 View project
 - In a browser of your choice:
	1 - Go to address bar and type: 'localhost:4200'.
	2 - Hit Enter key.

## 1.5 How to use it
 - Project structure:
	- Home page:
		- It contains three buttons that allow the user to make requests to the database. Every button has a different access restriction.
	- User page:
		- It contains just a simple text message.
	- Admin page:
		- It contains just a simple text message.
	- Login page:
		- Allow user the authenticate.
	- Register page:
		- Allow user to create an account.
	- Request reset password page:
		- Allow user to request a password change.
	- Send reset code page:
		- Allow user to send a verification code to allow password change.
	- Reset password page:
		- Allow user to change password.
 - Create user account:
 	- Click 'Login' menu option on top left.
	- Locate 'Create Account' inside the page and click it.
	- Fill the text boxes and send the information (if you put invalid data a red text will be shown to tell you what is wrong).
	- Validate account:
		- Access your Ethereal email account (you should have received a verification email).
		- Click the link inside the email message.
		- If nothing wrong happens, your account should be verified and you can login to the app.
 - Access restrictions:
	- Any account created is an 'User Account' and therefore does not have access to the 'Admin' menu and can not make a request in the 'Admin Request' button in the Home page.
	- The 'Admin' user can access everything in the app.
	- An user without an account can't access the 'Admin' and 'User' menus and can't make the 'User Request' and 'Admin Request' in the Home page.

# License & copyright

Licensed under the [MIT License](LICENSE.txt).

© Alan D Oliveira
