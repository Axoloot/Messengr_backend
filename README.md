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
- `npm run db:up` initialise the database
- `npm run db:seed` (optional) if you want to feed the databse with mocked value
- `npm run start:dev` launch the server locally (http://localhost:8000)

You can run `npm run docs` to generate the routes documentation then `open out/index.html` to read it

### Technologies

Jessie is our [node](https://nodejs.org/en/) backend server of our Fundy eip developed in [typescript](https://www.typescriptlang.org/).
We use a lot of external tools for this project.

- api: [express](https://expressjs.com/fr/) rooter
- database: [Postgresql](https://www.postgresql.org/) with [Prisma](https://github.com/prisma/prisma) as [orm](https://www.altexsoft.com/blog/object-relational-mapping/#:~:text=Object%2Drelational%20mapping%20(ORM),data%20without%20the%20OOP%20paradigm.)
- bank access: [nordigen](https://nordigen.com/en/?gclid=CjwKCAjw9NeXBhAMEiwAbaY4lv39AHfS3Kcz547_YHtz-b5fQWJsRUrQ-AgswvduEdL3EblQ8xIe6xoCht4QAvD_BwE) to access a user's bank account
- rounding: [stripe](https://stripe.com/en-gb-fr) to round up transactions on an iban
- mail: [node mailer](https://nodemailer.com/about/) to send email with [mjml](https://mjml.io/) template

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
- /auth: authentication of a user, signin, singup ...
- /associations: create, list, update
- /projects: create, list, update
- /partner: create, list, update your associations and projects as a partner
- /tags: list of all possible tags
- /location: validate given coordinates
- /nordigen: user bank authentication
- /users: update and get connected user information like
  - transactions
  - following projects
  - following associations

Reminder: you can find all of our routes by opening `out/index.html` after generating the doc.

### Norm

#### Code

We use babel-eslint, a module that offers a strict but customizable code norm, you can find the configuration in the .eslintrc.js and in the .babelrc

You can run ```npm run lint:fix``` to modify your files with the good norm.

### Commit

This documentation is in the NormCommit.md

### Middlewares

Most of our routes use one or more middlewares, they are there to facilitate the development of the routes.
The different middlewares:

#### Auth Middleware

The user must be logged in to use the route, returns a 401 if not.

```ts
// src/components/partner/routes.ts
router.use(authMiddleware);
```

#### Validation Middleware

Allows to validate the body or the query of a request

```ts
// src/components/partner/routes.ts
/**
 * Create a new association.
 * @name POST /associations/:id
 * @function
 * @memberof module:partner
 * @inner
 * @param {string} email - Association email
 * @param {string} name - Association name
 * @param {string} description - Association description
 * @param {string} image - Association image url
 * @param {string} title - Association email
 * @param {number} longitude - Association location longitude
 * @param {number} latitude - Association location latitude
 */
router.post('/associations', bodyMiddleware(CreateAssociationBody), asyncHandler(async (req, res) => {
  return res.status(StatusCodes.OK).send(await createAssociation(res.locals.user.id, req.body));
}));
```

This will return a 400 if the following body is not respected

```ts
// src/components/partner/entities.ts
export class CreateAssociationBody {
  @IsEmail()
  email: string

  @IsString()
  name: string

  @IsString()
  description: string

  @IsString()
  image: string;

  @IsString()
  title: string;

  @IsNumber()
  longitude = 0;

  @IsNumber()
  latitude = 0;
}
```

### Merge Request

We have a pipeline system allowing the server to be prodded as soon as a new commit is pushed on the main branch. Once you have made your changes, you will need to create a merge request. After its merge your changes will be directly in production

### Tests

Tests are in the `src/__tests__` it can be run with ```npm run test```


### Contact

The developer in charge of this stack is Vincent Lemesle, if you have a problem or a question, the Jessie channel of our discord is there for that
