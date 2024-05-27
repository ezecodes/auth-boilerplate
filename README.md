## Overview

Buildkit is designed to serve as a robust foundation for bootstrapping MERN stack software projects. With Buildkit, you focus on what really matters—building amazing applications. Say goodbye to the complexities of setting up a MERN stack project and hello to a smoother, more efficient development experience. Get ready to bring your projects to life in record time.

## Key Features

### Authentication and Authorization

Buildkit includes robust authentication and authorization features to ensure secure access control for your application. It includes features such as:

- Sign-in
- Reset password
- Signup
- Google sign-in and signup

### Database Support

Buildkit seamlessly integrates with multiple databases, providing support for efficient data storage and retrieval. It supports:

- MySQL
- PostgreSQL
- MongoDB
- MariaDB

### Email Sending

Buildkit includes email sending capabilities, making it easy to implement email functionality in your application.

### Image Upload

Buildkit offers seamless integration with AWS S3 buckets for efficient image upload and retrieval.
To utilize the image upload feature:

- #### Setup AWS S3 Bucket
  Create an AWS S3 bucket, and a directory within the bucket to store your images. Note down the bucket name, access keys and the name of the directory.
- #### Configure AWS Credentials:
  Add your AWS access keys to your environment variables in the `.env` file.
- #### Update Config File:
  Add your bucket name and image upload directory to the `server/config/aws.js` file. You can also modify the region found in the config file if it varies from yours.

### Logging

Buildkit's logging system is dynamic, allowing you to choose between logging to the console or to a file. In production, you can either log to the console for console logging or to a file for file logging. This ensures that you can easily manage and track your application's logs for debugging and monitoring purposes.

### CSS Styling

For styling, Buildkit utilizes Tailwind CSS along with vanilla CSS. This combination provides a powerful yet straightforward way to design your application's user interface.

### View Rendering

Buildkit supports multiple view rendering engines, including EJS and React, to provide flexibility in building your frontend. You can find ready-made starter templates in the `views` folder.

### Webpack Integration

Buildkit integrates Webpack for efficient bundling of React components, ensuring a streamlined development process.

## Getting Started

### API Documentation

Full API Documentation can be found here

```sh
https://documenter.getpostman.com/view/32891465/2sA3Qs9XYw#a1990c13-75e3-4a81-b7d3-a849bf06a7df
```

### Setting Up Environment Variables

Start by creating a new file named `.env` in the root directory of your project. Copy the contents from `.env.sample` into this new file. Update the variables in the `.env` file to match your local environment settings.

### Setting Up and Spinning Up a Database

Buildkit supports multiple databases including MySQL, PostgreSQL, MongoDB, and MariaDB. Install and set up your preferred database system on your local machine. Update the database dialect in the `server/config/index.js` file to match your choice of database.

### Installing Packages

All packages for this project can be found in the `package.json` file. Run `npm install` to install packages from the npm repository.

### Understanding `package.json` Scripts

The `package.json` file contains scripts that automate various tasks in your project. Here are the key scripts:

- `start`: Starts the server in production mode.
- `css`: Watches for changes in CSS files and compiles them using Tailwind CSS.
- `dev`: Starts the server in development mode using nodemon.
- `webpack:dev`: Compiles JSX files using webpack in development mode.
- `webpack:prod`: Compiles JSX files using webpack in production mode.
- `all`: Runs the server, watches CSS files, and compiles JSX files concurrently in development mode.

For example, to start the development server along with CSS and JSX compilation, you can run:

```sh
npm run all
```

### Is there an available frontend page already built?

Yes. The Authentication pages are already built. You can find them in the `/views` and `/react` directories of the root directory.

## Folder Structure

### Root Directory

- `.env.sample`
- `.gitignore`
- `.sequelizerc`
- `app.js`
- `emailTemplates/`
- `eslint.config.mjs`
- `LICENSE`
- `logs/`
- `node_modules/`
- `package-lock.json`
- `package.json`
- `public/`
- `migrations/`
- `react/`
- `README.md`
- `server/`
- `tailwind.config.js`
- `views/`
- `webpack.config.js`

### `server/` Directory

- `bin/` Directory containing executable scripts.
  - `www` Script to start the server.
- `config/` Directory containing configuration files for the server.
  - `aws.js` Configuration file for AWS services.
  - `index.js` Main configuration file importing other configuration files.
  - `sequelize.js` Configuration file for Sequelize ORM.
- `controllers/` Directory containing controller logic for handling HTTP requests.
  - `auth.js` Controller for authentication-related logic.
  - `pages.js` Controller for rendering pages.
  - `user.js` Controller for user-related activities.
- `database/` Directory containing database-related code.
  - `connect.js` File for establishing database connection.
  - `models/` Directory containing Sequelize models for database tables.
    - `AuthCodes.js` Model for authentication codes.
    - `index.js` Main file importing all models.
    - `ResetLinks.js` Model for reset password links.
    - `Users.js` Model for user data.
  - `repository/` Directory containing repository modules for database operations.
    - `authCode.js` Repository for authentication codes.
    - `resetLink.js` Repository for reset password links.
    - `user.js` Repository for user data.
- `logger/` Directory containing logging configuration and utilities.
  - `index.js` Server logging configuration.
- `middleware/` Directory containing middleware functions.
  - `cors.js` Middleware for CORS configuration.
  - `error.js` Middleware for error handling.
  - `http-logger.js` Middleware for logging HTTP requests.
  - `security-headers.js` Middleware for server security configurations.
- `routes/` Directory containing route definitions.
  - `api/` Directory containing API route definitions.
  - `page/` Directory containing route definitions for rendering pages.
- `utils/` Directory containing utility functions.
  - `core.js` Core utility functions.
  - `errors.js` Error handling utility functions.

## Contribution Guidelines

To contribute to the project, follow these guidelines:

1. **File Organization**: Keep the file organization consistent with the existing structure to maintain readability and ease of navigation.
2. **Coding Standards**: Follow the coding standards and guidelines specified in the project's ESLint configuration to ensure consistency in coding style.
3. **Documentation**: Update the README.md file with any new features, changes, or setup instructions.
4. **Branching Strategy**: Use a branching strategy (e.g., Git Flow) to manage feature development and bug fixes.

Feel free to reach out if you have any questions or need further clarification on the project's structure and guidelines.

## License

Buildkit is released under the MIT License. See LICENSE for more information.
