This is a project to develop a comprehensive bootcamp project for a Javascript Fullstack Developer. The project should integrate:

- Frontend: HTML, CSS, Javascript, Bootstrap 5.3+ (CDN), Fontawesome.
- Imagenes with Lorem Picsum endpoints
- Backend with Node.js Express, Postgresql, pg, sequelize, jwt, bcryptjs and handlebars, Multer, mime-types.

The .env is at [./.env](./.env) and you should know the database is already created.

The topic of the project is any project suitable for a bootcamp that solves a real world problem, like a task manager, a blog, a portfolio, a social media app, etc. You are free to choose the topic as long as it is fully implemented and documented.

The architecture should be clean and modular, and the file uploads should be handled renaming the files to uuid+timestamp to avoid name collisions, but keeping the original name in the database. Also, you should implement enough validations to ensure data integrity and security.

All the documentation should be comprehensive and be in Spanish, targetting junior developers that want to learn fullstack development with Javascript. You're free to choose the structure of the documentation while comprehensive. Remember to include images as lorem picsum for placeholders where needed for best presentation, I will change them for the final version later.

Server, routes, middlewares, models, controllers, views, public assets, everything should be included and properly structured.

Use package.json engines and nvmrc to specify Node.js version 22.18.0 so `fnm` can automatically switch and freeze the dependencies to patches only. Document all of these.

Remember to use localstorage for persistence in the frontend where needed and session management with JWT tokens in the backend.

Finally, include instructions to set up and run the project locally, including database setup and any necessary environment variables.