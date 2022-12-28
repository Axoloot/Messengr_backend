# Fundy

## Backend

### Installation
First of all, make sure that you have installed on your machine:
- npm
- ts-node
- ts-node-dev
- docker
- docker-compose

You will also need an env loader, we currently use a .envrc and we recommend you to install `direnv`

Now you can launch the backend

- load the env (`direnv allow` if you have it)
- `docker-compose up redis postgres`
- `yarn db:up` initialise the database
- `yarn start:dev` launch the server locally (http://localhost:8000)

You can run `yarn docs` to generate the routes documentation then `open out/index.html` to read it

### Technologies

Jessie is our [node](https://nodejs.org/en/) backend server of our Fundy eip developed in [typescript](https://www.typescriptlang.org/).
We use a lot of external tools for this project.

- api: [express](https://expressjs.com/fr/) rooter
- database: [Postgresql](https://www.postgresql.org/) with [Prisma](https://github.com/prisma/prisma) as [orm](https://www.altexsoft.com/blog/object-relational-mapping/#:~:text=Object%2Drelational%20mapping%20(ORM),data%20without%20the%20OOP%20paradigm.)
### Repository

at the root of the project we can find the files useful for the installation as well as for the launching of the server such as:
- docker-compose.yaml
- Dockerfile
- prisma/ (you will find the definition of our tables in the schema.prisma)

All the source files of our project are in the src/ folder. 
<br />The assets/ folder is used for the mail templates we use.
<br /> The components/ folder is used to define our routes.
For each group of routes you will have a folder with the same pattern:
- routes.ts: for the list of routes
- components.ts: the functions used in the routes
- entities.ts: the definition of the classes that are used

Group of routes:
- /conversations: get, post, patch conversations
- /messages: get, post, patch messages
- /auth: authentication of a user, signin, singup ...
- /users: update and get connected user information like

Reminder: you can find all of our routes by opening `out/index.html` after generating the doc.

### Norm

#### Code

We use babel-eslint, a module that offers a strict but customizable code norm, you can find the configuration in the .eslintrc.js and in the .babelrc

You can run ```yarn lint:fix``` to modify your files with the good norm.
### Middlewares

Most of our routes use one or more middlewares, they are there to facilitate the development of the routes.
The different middlewares:

#### Auth Middleware

The user must be logged in to use the route, returns a 401 if not.

```ts
// src/components/conversations/routes.ts
router.use(authMiddleware);
```

#### Validation Middleware

Allows to validate the body or the query of a request

```ts
// src/components/conversations/routes.ts
/**
 * Create a new conversation.
 * @name POST /conversations
 * @function
 * @memberof module:partner
 * @inner
 * @param {string[]} Users - usersId Array
 */
router.post('/conversations', bodyMiddleware(CreateConversationBody), asyncHandler(async (req, res) => {
  return res.status(StatusCodes.OK).send(await createConversations(res.locals.user.id, req.body));
}));
```

This will return a 400 if the following body is not respected

```ts
// src/components/conversations/entities.ts
export class CreateConversationBody {
  @IsArray()
  Users: string[];

}
```

### Merge Request

We have a pipeline system allowing the server to be prodded as soon as a new commit is pushed on the main branch. Once you have made your changes, you will need to create a merge request. After its merge your changes will be directly in production

### Tests

Tests are named {componenet}.test.ts it can be run with ```yarn test```


### Contact

The developer in charge of this stack is Cyril de Lajudie, if you have a problem or a question use cyril.de-lajudie@epitech.eu
