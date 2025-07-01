# Ted Auth Microservice

This project is an **Autentication Microservice** built with [NestJS](https://nestjs.com/) that communicates with microservices via **Redis**. It uses **JWT for authentication** and is fully written in TypeScript.

## 📦 Main Technologies

- [NestJS v11](https://docs.nestjs.com/)
- [Redis (ioredis)](https://redis.io/)
- [PostgreSQL (pg)](https://www.postgresql.org/)
- [TypeORM](https://typeorm.io/)
- [JWT (@nestjs/jwt)](https://jwt.io/)
- [Bcrypt](https://github.com/kelektiv/node.bcrypt.js) — password hashing
- [RxJS](https://rxjs.dev/)
- [Jest](https://jestjs.io/)
- [ESLint](https://eslint.org/)
- [Prettier](https://prettier.io/)
- [TypeScript](https://www.typescriptlang.org/)

---

## 🚀 Available Scripts

| Command               | Description                                    |
|----------------------|-------------------------------------------------|
| `npm run start`      | Starts the application                          |
| `npm run start:dev`  | Starts with watch mode (development)            |
| `npm run start:debug`| Starts in debug mode                            |
| `npm run start:prod` | Starts in production mode (compiled)            |
| `npm run build`      | Compiles the project (dist/)                    |
| `npm run format`     | Formats files using Prettier                    |
| `npm run lint`       | Runs ESLint on `.ts` files                      |
| `npm run test`       | Runs unit tests                                 |
| `npm run test:watch` | Runs unit tests in watch mode                   |
| `npm run test:cov`   | Runs tests with coverage report                 |
| `npm run test:e2e`   | Runs end-to-end tests                           |

---

## 🔄 Redis
Communication between microservices is done via Redis (pub/sub mode), using NestJS’s `ClientProxy` with `REDIS` transport.  
Make sure Redis is running locally (default port `6379`).

---

## 🧪 Tests

- Unit tests are located in `*.spec.ts` files.  
- To run tests with coverage:

```bash
npm run test:cov
```

---

## 📁 Project Structure

```
src/
├── auth/                   
│   ├── controllers/               # Authentication route controllers
│   │   ├── auth.controller.spec.ts
│   │   └── auth.controller.ts
├   |── services/                  # Authentication business logic services
│   │   ├── auth.service.spec.ts
│   │   └── auth.service.ts  
├── common/                        # Reusable common code across modules
│   ├── exceptions/                # Custom exception handling
│   │   ├── http-exception.spec.ts
│   │   └── http-exception.ts    
│   ├── validations/               # Data validation according to DTOs
│   │   ├── dto-validator.service.spec.ts
│   │   └── dto-validator.service.ts               
├── dto/                           # DTOs used for Swagger documentation and validation
│   ├── auth.dto.spec.ts
│   └── auth.dto.ts
├── schema/                         # Auth entities          
│   ├── user.entity.spec.ts
│   └── user.entity.ts
├── app.module.ts                  # Root module of the application
└── main.ts                        # Application entry point

```

---

## ⚙️ Requirements

* Node.js 18+
* Redis running locally
* Environment variables in .env file, including:

```

JWT_SECRET= yoursecretkey
REDIS_PORT = 6379
REDIS_HOST = localhost
DATABASE_URL= yoursecretkey

```
---

## 🔗 Related Microservices

- [🔗 Api Gateway (NestJS)](https://github.com/MoniqueMiko/ted-api-gateway-app)
- [🧩 Url Shortener Microservice (NestJS)](https://github.com/MoniqueMiko/ted-url-shortener-microservice)

---

## 🛠️ Build

To compile the project:

```bash
npm run build
```

The compiled code will be generated in the dist/ folder.

---

## 🧭  Future Improvements

- Create endpoint to deactivate or update a user  
- Implement SSO login in the future  

---

## 🧑‍💻 Author
- 👩‍💻 Monique Lourenço -> monique_lourenzia@hotmail.com
---

## 📄 License

This project is UNLICENSED. Usage is restricted as specified.