# Templates managment admin panel frontend

Templates managment admin panel frontend

## Overview

Application was developed using following technologies: Reactjs, TypeScript Mui.

## Prerequisites

- **NodeJS** v18.13 or latest
- **npm** v8.19.3
- **vite** v5.3.1

## Links to Other Resources

- [React](https://react.dev/)
- [Mui](https://mui.com/material-ui)
- [Vite](https://vitejs.dev/)

## Installation

To deploy this project, follow these steps:

1. Clone the repository:

   ```sh
   git clone git@gitlab.com:opie-software/application-development/templates/template-management-frontend.git
   ```

2. Navigate to the project directory:

   ```sh
   cd template-managment-frontend
   ```

3. Create **.env** file with these variables and define VITE_API_URL as template managment backend:

   ```sh
   VITE_AUTHHEADER=Authorization
   VITE_API_URL=http://localhost:3002
   ```

4. Install dependinces:
   ```sh
   npm i
   ```
5. Build project:

   ```sh
   npm run build
   ```

6. Run server:
   ```sh
   node server
   ```

Your application will now be available on port 5898. You can use pm2 or any other tool to run server.js, or change the port if necessary. Additionally, you can use NGINX or any proxy server to connect your port to your domain and make your application live on the internet.
