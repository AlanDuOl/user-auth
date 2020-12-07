# User-Auth
The focus of this project is to create an authentication/authorization system (token/bearer Authentication) to allow access to an API. The project is composed of a front-end built with Angular.js and a RESTful API built with Node.js and Express.js. The API uses an SqLite database built with Typeorm using migrations. Both front-end and API are written in Typescript.

 - Account creation summarized steps:
	- User sends its data to API endpoint.
	- Create a user password Hash with bcrypt using a salt.
	- Store user data with the password hash in the database.
	- Generate a random string with Node.js crypto module to verify the account.
	- Hash and store the random string in the database.
	- Send an email message to user email address with a clickable route to validate the account.

 - Account validation summarized steps:
	- Send an email message to user email address with a clickable route to validate the account.
	- User access email account and click the verification link to verify the account.
	
 - Authentication summarized steps:
	- User send credential to API endpoint.
	- If credentials are valid, generete a jwt token with jsonwebtoken package and send it to the client.
	- Client stores the token in localStorage or sessionStorage.
	- Every subsequent request from client will send the token in 'Authorization' header.
	- Routes that require authentication will validate the token before allow access to resources.

 - Reset password summarized steps:
	- User request password change.
	- A vefication code is sent to account email.
	- Verification code is validated in the API.
	- User is allowed to change password.

The account verification and reset password functionalities use a test Ethereal email account, not the email used in the account creation. The account email is used to identify the user.

# Run in your machine

# 1 - Windows 10
 - You need basic understanding of Windows to follow this guide.
 - You need admin rights to install the tools without aditional configuration.

## 1.1 - Install tools
 - Node.js:
	- Download: https://nodejs.org/en/download/.
	- Run the wizard and install everything that is suggested.
	- When Node.js installation is finished, a window will open to install chocolatey (a software needed to install dependencies for Node.js). Just hit the space key twice and the installation will proceed to new window 'PowerShell'.
	- When the installation in PowerShell is finished type 'ENTER' and hit enter key to finish.
 - Visual Studio Code:
	- Download the installer: https://code.visualstudio.com/Download
	- Run the installer, accept the terms, uncheck everything that is checked as default and click next until the installation is finished.

## 1.2 - Get the project repository to your machine
 - Choose one of the two options bellow:
	- Download the project:
		- Access the link 'https://github.com/AlanDuOl/'.
		- Locate a green button called 'Code' in the '<> Code' menu.
		- Click the 'Code' button and click the option 'Download ZIP' inside the pop-up menu. This will download the project to your machine in a compressed format (.zip/rar). The file name is 'user-auth-main'. Extract it and a folder named 'user-auth-main' will be created.
	- Clone the project with Git (advanced user):
		- Install Git in your machine if you don't have it already.
		- Right click inside a folder of your choice and choose 'Git Bash Here' in the pop-up menu or open 'Git Bash' in the Windows start menu and navigate to the folder you want. Inside Git Bash Terminal type 'git clone https://github.com/AlanDuOl/user-auth.git'. This will create a folder called 'user-auth'.

## 1.3 - Open the project with Visual Studio Code
 - Open Visual Studio Code.
 - Go to 'File' menu and choose 'Open Folder' option.
 - Locate the folder created in section 1.2.
 - Select the folder (click it) and click the select button.
 - The project folder will open in Visual Studio Code.

## 1.4 - Run projects
- Both projects bellow must be running in order for you to use the app.

### 1.4.1 - Start front-end project
 - Inside Visual Studio Code:
	- Open a terminal (a window):
		- Go to 'Terminal' menu option and choose 'New Terminal'. A window will open at the bottom of Visual Studio Code.
	- Inside the terminal type: 'cd web'.
	- Hit Enter key.
	- Type: 'npm install'.
	- Hit Enter key.
	- Wait (some tools will be installed).
	- Type 'npm start'.
	- Hit Enter key.
	- Wait until the project loaded.
	- The project will be ready to use when you see a message 'Compiled successfully' inside the terminal.
	- Obs:
		- To stop the project press 'Ctrl + C' inside the terminal window then type 's' and hit 'Enter' key.
		- To start the project again you don't need to repeat steps 4 and 5. They are needed only once.

### 1.4.2 - Start back-end project
 - Inside Visual Studio Code:
 	- Configure send email service:
		- Create and Ethereal email account (this is used to test the send email functionality):
			- Access this link 'https://ethereal.email/' and click the button 'Create Ethereal Account'.
			- Save the the account credentials for latter use.
			- We will need the SMTP service 'UserName' and 'Password' information.
		- Use the Ethereal email account credentials inside the project:
			- Go to 'View' menu and choose 'Explorer' option (if nothing happens it's because it is already opened). It is a side window usually in the left.
			- Inside Explorer window extend the folder structure of 'backend' folder (click it).
			- Inside 'backend' folder show the content of folder 'src' (click it).
			- Inside 'src' folder find a file named 'utils.ts' and double click it (it will open in the right).
			- Click inside the file and then press 'Ctrl + F' (a box will be shown). Inside the box copy and paste 'getSMTPTransporter'. It will highlight the begin of the code block you need to change.
			- Inside 'getSMTPTransporter' locate this: 
				auth: {
					user: '',
					pass: ''
				}
			- Inside 'auth' locate 'user' and put the your Ethereal email SMTP 'UserName' inside the empty quotation marks ('').
			- Inside 'auth' locate 'pass' and put the your Ethereal email SMTP 'Password' inside the empty quotation marks ('').
			- Save the file: press 'Ctrl + S' or go to 'File' menu and choose 'Save' option.
			- Close the file.
	- Open a new terminal:
		- Go to 'Terminal' menu option and choose 'Split Terminal'. A second terminal will open at the bottom of Visual Studio Code.
    - Inside the terminal type: 'cd backend'.
	- Hit Enter key.
	- Type 'npm install'.
	- Hit Enter key.
	- Wait (some tools will be installed).
    - Type 'npm run typeorm migration:run'.
	- Hit Enter key.
	- Wait (some tools will be installed).
    - Type 'npm run dev'.
	- Hit Enter key.
	- Wait until the project is loaded.
	- The project will be ready to use when you see a message 'server listening on port 2000' inside the terminal.
	- Obs:
		- To stop the project press 'Ctrl + C' inside the terminal window then type 's' and hit 'Enter' key.
		- To start the project again you don't need to repeat steps 4, 5, 6, 7 and 8. They are needed only once.

### 1.4.3 - View project
 - In a browser of your choice:
	1 - Go to address bar and type: 'localhost:4200'.
	2 - Hit Enter key.

# How to use it
 - Project structure:
	- Home page:
		- It contains three buttons that allow the user to make requests to the database. Every button has a different access restriction.
		- Access it clicking on 'Home' menu option at the top of the page.
	- User page:
		- It contains just a simple text message.
		- Access it 'User' menu option at the top of the page.
	- Admin page:
		- It contains just a simple text message.
		- Access it clicking on 'Admin' menu option at the top of the page.
	- Login page:
		- Allow user the authenticate.
		- Access it clicking on 'Login' menu option at the top of the page.
	- Register page:
		- Allow user to create an account.
		- Access it inside 'Login' page.
	- Request reset password page:
		- Allow user to request a password change.
		- Access it inside 'Login' page.
	- Send reset code page:
		- Allow user to send a verification code to allow password change.
		- Accessed inside the reset password flow.
	- Reset password page:
		- Allow user to change password.
		- Accessed inside the reset password flow.
 - Create user account:
 	- Click 'Login' menu option on top left. The login page will be shown.
	- In login page locate 'Create Account' and click it. The register page will be shown.
	- Fill the text boxes and send the information (if you put invalid data a red text message will be shown to tell you what is wrong).
 - Validate account:
	- When an account is created an email message is sent to the provided Ethereal email account.
	- Access your Ethereal email account (you should have received a verification email).
	- Click the link inside the email message.
	- A page will show that your account is verified and you can login to the app.
 - Log-in:
	- Click 'Login' menu option on top left.
	- In the page shown, fill the text boxes with the account information.
	- If you provide the correct user name and password and your account is verified, you should be logged to the app.
 - Resend verification email:
	- If you attempt to log-in to the app and your account is not verified yet, a link will be shown in the login page that allows you to resend the verification email.
 - Change password:
	- If you forgot your password or want to change it, you can do so in the Login page.
	- Access the login page, locate the link 'Forgot password' and click it. The 'Request reset password page' will be shown.
	- Put your email used to log-in inside the text box and click 'Send' button. An email message will be sent to the Ethereal email account.
	- The 'Send reset code page' will be shown. Access the email message and put to code into the text box and send it to be validated.
	- If the code is valid the 'Reset password page' will be shown and you can change your password.
 - Access restrictions:
	- Any account created is an 'User Account'. It does not have access to the 'Admin' menu and can not make a request in the 'Admin Request' button inside the Home page. All other functionalities are permitted to a 'User Account'.
	- The 'Admin' user can access everything in the app. To login as an 'Admin' user use the user name 'boris@gmail.com' and the password 'Ab1234/5'.
	- An user without an account can't access the 'Admin' and 'User' menus and can't make the 'User Request' and 'Admin Request' in the Home page.

# License & copyright

Licensed under the [MIT License](LICENSE.txt).

© Alan D Oliveira