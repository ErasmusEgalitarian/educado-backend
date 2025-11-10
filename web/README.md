## Setting up and running the content creator web application (frontend)

1. Clone **educado-frontend** repository from Github
2. Add .env file in the **app** folder with the following values:
   - VITE_CERT_URL
   - VITE_BACKEND_URL
3. Navigate to **app** folder: `cd app`
4. Run in terminal: `npm install`
5. Run in terminal: `npm run dev`
6. Open link from terminal to visit the page

Requires that the backend and certificate services are running. Check their respective guides to run them.
If run successfully you will be met by the login screen when you open the page:
![image](https://github.com/Educado-App/resources/assets/65400638/66636a5c-1eea-43d0-9b22-20669741c2a6)

Create a new user by clicking the *Cadastre-se agora* button and fill out the required information. If you can't be bothered to use use your own mail then use a temporary mail. After logging in, you will be redirected to the courses page, which can be seen below. Note that the page looks different if there aren't any courses in the database.
![image](https://github.com/Educado-App/resources/assets/65400638/ef965ec7-74ac-4595-be77-e1ad6d582ace)

# Educado frontend

Frontend for the Educado webpage (content creator platform) 

Main dependencies:

- Nodejs
- Express
- MongoDB/Mongoose
- Axios

## Step-by-step guide to run Educado development setup

Below is a short guide explaining how to set up and run the educado backend in development mode.


### Setting up Node environment

- Ensure that local version of Node.js is latest stable version (v20.10.0, at the time of writing this)
  - run `node --version`
  - if version == v20.10.0, then all is good :)
  - if version is NOT v20.10.0 then do the following
    - Ensure that you have npm installed
    - run `npm install -g n` to install node version manager
    - when installed, run `n stable`, to install latest stable version of node


### Setting up local repository
Get the .env file from whoever is in charge of the secrets. The 2023 responsible was Frederik Bode Thorbensen: from Software semester 7 of AAU CPH. The dev keys contain the following values:

### The .env file should contain the following values:
VITE_S3_SECRET 
VITE_S3_BUCKET
VITE_S3_REGION
VITE_BACKEND_URL


### Installing node dependencies

- In root folder of the repo run `npm install`
- Run `npm install` again


### Run app in development mode

- Run `npm run dev` to start application
- Rest api runs on ://localhost:8888


## Tests 
- Run `npm run test` to run ALL jest test for the front end 
- Run `npm test "TestFileName.test.js"` to run a single jest test suite for the front end 
 
### Creating and running tests - Cypress

- Run `npm run cypress-server` to run the server for Cypress
- In a new terminal, run `npx cypress open` to open the Cypress test runner
- Choose the type of test you want to run/create, will open a new browser

For test running:
- Select the test you want to run
- The test will run in the browser, and you can see the results in the Cypress test runner

For test creation:
- Create a new test
- A new file will be created in the Cypress folder


## Deploment 
- Changes pushed to the staging branch on Github will automaticly complited an run on https://app-staging.educado.io/ 
- Staging has very strick rules and will go to 404 page if any error accoces
- Imports are more strick on Staging for example "import  Icon  from '@mdi/react'" and "import { Icon } from '@mdi/react'" works on dev, but only "import { Icon } from '@mdi/react'"; works staging.


***
