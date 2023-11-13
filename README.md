# Learning-Management-System

## Backend of the Project

### Technologies Used
  - Languages: [Typescript](https://www.npmjs.com/package/typescript)
  - Frameworks: [ExpressJs](https://www.npmjs.com/package/express), [JSONWebToken](https://www.npmjs.com/package/jsonwebtoken), [Redis](https://www.npmjs.com/package/redis), [Mongoose](https://www.npmjs.com/package/mongoose)
  - Mailing: HTML, CSS, [EJS](https://www.npmjs.com/package/ejs)
  - Password Hashing: [BCrypt](https://www.npmjs.com/package/bcrypt#nodebcryptjs)
  - Database: MongoDB
  - Route Testing: POSTMAN
  - Data Caching: Redis
  - Cloud Data Management: Cloudinary

### Table of Contents
  1. [Authentication System](https://github.com/kartik1601/Learning-Management-System/edit/main/README.md#authentication-system)
  2. [Error Handling](https://github.com/kartik1601/Learning-Management-System/edit/main/README.md#error-handling)
  3. [User Model and Services]()
  4. [Course Model and Services]()
  5. [Order and Layout System]()
  6. [Notifications and Mailing System]()
  7. [Analytics System for Admin]()
  8. [Advanced Caching mechasim with REDIS]()
  9. [Route testing with POSTMAN]()

##
## Authentication System
The login system:-
  1. Via Email and Password
  2. Via authenticated Google account (Social-Authentication system)
  3. Via authenticated Github account (Social-Authentication system)

- #### When the user tries to login to the system, the following queries are generated at the same time:
  - Whether the user exist in the database or not. If yes, the user is logged in to the account. If not, it generates error.
  - If the user tries to sign up or register for the first time, the following fields are required to be filled by the user: "NAME", "EMAIL", "PASSWORD".
  - If the "EMAIL" entered already exist in the database, an error is generated telling user to proceed with the login page.
  - If the "EMAIL" does not exist in the database, the "EMAIL" expression is validated with a proper syntax using "emailRegexPattern" function. If it returns a false value, then an error is generated.
  - Once the "EMAIL" is validated, the "PASSWORD" is validated with the help of [BCrypt](https://www.npmjs.com/package/bcrypt#nodebcryptjs), the minimum length for the password is 6 characters (any of the valid 128 ASCII characters).
  - Once both "EMAIL" and "PASSWORD" are validated, an activation email is sent to the respective email containing the "TOKEN", a 4-Digit random number. It has to be filled by the user in the disgnated route within 5 minutes.
  - If the "TOKEN" entered is correct, the user is activated. Otherwise, in case of incorrect or null token within the expiry, the user is shown with an error and an option to get a new token via email again.
  - If the user is completes all the steps correctly, then the user is authenticated and activated, and logged in to the system.

- #### Security Features:
  - **Password Hashing by [BCrypt](https://www.npmjs.com/package/bcrypt#nodebcryptjs)**: The BCrypt turns the inputed password into a random hash value. It uses an One-way Hash function, which means once the password has been hashed, it cannot be retrieved into it's original form. Apart from this, Bcrypt also hashes the password everytime the user login to the system and checks it with the version stored in the system's memory.
  - **Updating Access Token periodically**: After every 5 minutes the access token value expires, also expiring the user's current session. User have to login again to access the system. In this security system the user's access token refreshes every 5 minutes, so that it cannot be hacked easily. With the frontend the access token is refreshed in the background, without interrupting the user's session. While the refresh token is refreshed every 3 days.
  - **Caching with [Redis](https://www.npmjs.com/package/redis)**: Every user's data that is currently logged in to the system is stored in the cache with the help of Redis. Once every 7 days, the cache memory is cleared to boost performance as well as to maintain security for inactive users.

##
## Error Handling
### Status Code - This property stores the HTTP status code associated with the error.
### Message - This property displays the custom information, provided to the user, associated with the error.
The following types of Errors are generated throughout the system:
  - #### JSON WEB TOKEN EXPIRED: Status-Code:400 , Message:"Json web token has expired, try again!"
