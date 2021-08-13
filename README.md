[Source YouTube-video](https://www.youtube.com/watch?v=fN25fMQZ2v0)

## 1. JWT Token:

   - HEADER  
     ```
     { "alg": "HS256", "typ": "JWT" }
     ```
   - DATA  
     ```
     { 
       "sub": "1234567890",
       "name": "John Doe",
       "iat": 1516239022 
     }
     ```
   - SIGNATURE

## 2. Tokens
   1. Access (15-30 minutes) - save to **localstorage** & put it into header "Authorization" of each http-request;
   2. Refresh (15-30 days) - save into **httpOnly cookie**

## 3. Install client react app:
```
.\client> npx create-react-app my-app --template typescript
```
Delete all thash after that.

## 4. Init server node.js:
```
.\server> npm init -y
```

## 5. Server NPM packeges:
  1. express
  2. express-validator
  3. cors
  4. cookie-parser
  5. dotenv
  6. mongodb (DB)
  7. mongoose (DB)
  8. jsonwebtoken
  9. bcryptjs
  10. uuid
  11. nodemailer
  12. nodemon (dev)

## 6. Client NPM packeges:
  1. mobx
  2. mobx-react-lite
  3. axios
  4. @types/axios

## 7. Server develop proccess:
  1. [.\index.js] express instance, express middleware, DB connect
  2. [.\models] User & Token DB models
  3. [.\router\index.js] Make routers
  4. [.\controllers\user-controller.js] Make handler for router `/registration`
  5. [.\services\user-service.js] Make `registration` service function
  6. [.\controllers\user-controller.js] Make handler for router `/activate/:link`
  15. [.\services\user-service.js] Make `activate` service function
  7. [.\dtos\user-dto.js] The helper for cutting User data befor put it into token
  8. [.\services\mail-service.js] Sending the activation e-mail _// TODO: handle the error of impossibility sending email_
  9. [.\exceptions\api-error.js] Create handler for errors on server side (middleware)
  10. [.\middlewares\error-middleware.js] Create express middleware for handling unauthorized & bad request errors by `api-error.js`. Error handler MUST be LAST in chain of middlewares
  11. [.\services\user-service.js] Use `ApiError` class for throw errors in user service
  12. [.\controllers\user-controller.js] Use `next(e)` into `catch(e) { }` block of user controller
  13. [.\router\index.js] Add `body` validation from `express-validator`. Add validation parameters for `email` & `password` fields of `body` POST request on `/registration`
  14. [.\controllers\user-controller.js] Handle the result of validation in `registration` function of user controller by using `ApiError` class


  15. [.\controllers\user-controller.js] Make handler for router `/login`
  16. [.\services\user-service.js] Make `login` service function


  17. [.\controllers\user-controller.js] Make handler for router `/logout`
  18. [.\services\token-service.js] Make `removeToken` function of token service
  19. [.\services\user-service.js] Make `logout` service function


  20. [.\controllers\user-controller.js] Make handler for router `/refresh`
  21. [.\services\token-service.js] Make `findToken` & `validateRefreshToken` functions of token service
  22. [.\services\user-service.js] Make `refresh` service function

Demo authorized access to the list of users :
  23. [.\controllers\user-controller.js] Make handler `getUsers` for router `/users`
  24. [.\services\user-service.js] Make `getAllUsers` function
  25. [.\services\token-service.js] Make `validateAccessToken` functions of token service
  26. [.\middlewares\auth-middleware.js] Create express middleware for check user authorization
  27. [.\router\index.js] Add middleware for check user authorization to router

## 8. Server develop proccess:
  1. [.\src\App.tsx] React Functional Component (FC)
  2. [.\src\http\index.ts] Handle client request by interceptors
  3. [.\src\services\AuthService.ts] Service of authentification (login, registration, logout)
  4. [.\src\models\response\AuthResponse.ts] Response authentification interface
  5. [.\src\models\IUser.ts] User interface
  6. [.\src\services\UserService.ts] Service for getting user list
  7. [.\src\components\LoginForm.tsx] Login form component
  8. [.\src\store\store.ts] Global store
  9. [.\src\index.ts] Add global store (Context) to application
  10. [.\src\components\LoginForm.tsx] Add Context
  11. [.\src\App.tsx] Add Login form component. Add useEffect hook for execute `checkAuth()` once
  12. [.\src\http\index.ts] Create interceptor for update access token by refresh token