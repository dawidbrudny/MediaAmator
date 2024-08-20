# MediaAmator - store app
> Store app created with React, TypeScript and Firebase technologies.
> The application also includes login and registration functions plus an administrator panel.
> 
> Live demo [_here_](https://mediaamator-779dd.web.app/). <!-- If you have the project hosted somewhere, include the link here. -->

## Table of Contents
* [General Info](#general-information)
* [Technologies Used](#technologies-used)
* [Features](#features)
* [Screenshots](#screenshots)
* [Project Status](#project-status)
* [Usage](#usage)
* [Room for Improvement](#room-for-improvement)


## General Information
- An online store application in which, after logging in (or registering if you do not have an account yet), you can purchase a given product.
  Communication with the Firebase database takes place on the administrator's side (more precisely, through the administration panel). It comes with pre-built functions based on Firebase's built-in methods. These methods include adding and removing products from the store and the ability
  to ban/unban users.


## Technologies Used
- React + TypeScript + Vite
- Firebase (Firestore + Storage)


## Features
List the ready features here:
- Redux
- React styled components
- React Helmet Async
- React Router DOM
- React Stripe.js
- React Places Autocomplete
- Zod Security
- Fontawesome Icons


## Screenshots
![Example screenshot](https://firebasestorage.googleapis.com/v0/b/mediaamator-779dd.appspot.com/o/mediaamator-screen.jpg?alt=media&token=5a5d2135-d4fc-4668-bd01-4d683e40015c)

## Project Status
Project is: _in progress_


## Usage
If you want to test this app you can click a link above that provides you to live demo version hosted on Firebase Hosting. You don't need to create new user by registration. There is a
test user which you can use to see what happens after signing in to application:

Test user:
- login: user@mediaamator.pl
- password: user-amator


## Room for Improvement
The application requires some improvements and the addition of some content and functions. 
First of all, the application is not fully adapted to be used on mobile devices. For this purpose, I would like to use React Native technology in the future. 
I would like to add the ability to add comments to products for users and the ability for the administrator to delete them.
In the case of these comments, I would also like to add artificial intelligence, which would relieve some work from the administrator by censoring the content or blocking the publication of vulgar comments.
Moreover, some missing content should also be added. In the user panel, some subpages are empty, and the products do not have their own pages with details about them (the 'more info' button is temporarily not working).

Room for improvement:
- User panel have some empty subpages.
- App should be more adapted to mobile devices.
- Add pages for given products that will contain more information about them.

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
  },
}
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list
