# Learning-Management-System

## Backend of the Project

### Technologies Used
  - Languages: [Typescript](https://www.npmjs.com/package/typescript)
  - Frameworks: [ExpressJs](https://www.npmjs.com/package/express), [JSONWebToken](https://www.npmjs.com/package/jsonwebtoken), [Redis](https://www.npmjs.com/package/redis), [Mongoose](https://www.npmjs.com/package/mongoose)
  - Mailing: HTML, CSS, [EJS](https://www.npmjs.com/package/ejs)
  - Password Hashing: [BCrypt](https://www.npmjs.com/package/bcrypt#nodebcryptjs)
  - Database: [MongoDB](https://www.mongodb.com/)
  - Route Testing: [POSTMAN](https://www.postman.com/)
  - Data Caching: [Upstash](https://upstash.com/)
  - Cloud Data Management: [Cloudinary](https://cloudinary.com/)

### Table of Contents
  1. [Authentication System](https://github.com/kartik1601/Learning-Management-System/tree/main#authentication-system)
  2. [Error Handling](https://github.com/kartik1601/Learning-Management-System/tree/main#error-handling)
  3. [User Model and Services](https://github.com/kartik1601/Learning-Management-System/tree/main#user-model-and-services)
  4. [Course Model and Services]()
  5. [Order and Layout System]()
  6. [Notifications and Mailing System]()
  7. [Analytics System for Admin]()
  8. [Advanced Caching mechasim with REDIS]()
  9. [Route testing with POSTMAN]()

##
## AUTHENTICATION SYSTEM
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
## ERROR HANDLING
### `Status Code` - This property stores the HTTP status code associated with the error.
### `Message` - This property displays the custom information, provided to the user, associated with the error.
The following common types of Errors are generated throughout the system:
  - #### JSON WEB TOKEN EXPIRED: Status-Code:`400` , Message:"Json web token has expired, try again!"
  - #### USER SESSION EXPIRED: Status-Code:`400` , Message:"Please login to access this resource!"
  - #### UPDATING USER EMAIL-ID TO EXISTING EMAIL-ID: Status-Code:`400` , Message:"Email already exist"
  - #### USER-ID (_id) MISMATCH: Status-Code:`404` , Message:"User not found!"
  - #### ACCESSING UNPURCHASED COURSES: Status-Code:`500` , Message:"User is not eligible to access this course!"
  - #### ADDING QUESTIONS/ANSWERS/REPLIES ERRORS: Status-Code:`400` , Message:"Invalid Content Id!"
  - #### COURSE/QUESTION/ANSWER/REPLY NON-EXISTING: Status-Code:`500` , Message:"Course does not exists!" or "Question not found!"

##
## USER MODEL AND SERVICES

## User Database Model
### Schema
The `IUser` interface defines the structure of a user document in the MongoDB database. It includes the following fields:

- **name:** The user's name.
- **email:** The user's email address, validated using a regular expression.
- **password:** The user's password, hashed using [BCrypt](https://www.npmjs.com/package/bcrypt#nodebcryptjs) for security.
- **avatar:** User's public avatar or profile picture that is uploaded with the help of [Cloudinary](https://cloudinary.com/).
- **role:** The user's role, with a default value of "user". "admin" or "moderator" are examples of other roles.
- **isVerified:** Indicating whether the user's email is verified, with a default value of `false`.
- **courses:** Courses that user have purchased, each containing a `courseId` string.

### Password Hashing
There is a pre-save hook that hashes the user's password using [BCrypt](https://www.npmjs.com/package/bcrypt#nodebcryptjs) before saving it to the database.

### Methods
- **comparePassword:** A method that compares the entered password with the stored hashed password to verify user login credentials.
- **SignAccessToken:** A method that signs and returns an access token using the user's ID as the payload, valid for 5 minutes.
- **SignRefreshToken:** A method that signs and returns a refresh token using the user's ID as the payload, valid for 3 days.

### Model
The `userModel` variable is an instance of the `Model<IUser>` class provided by Mongoose, representing the "User" collection or folder in the MongoDB database.

## User Services

### `getUserById` Service
- **Description:** Retrieves a user by their ID from the Redis cache and sends the user information in the response.
- **Parameters:**
  - `id:` The user ID.
  - `res:` The Express response object.

### `getAllUsersService` Service
- **Description:** Retrieves all users from the MongoDB database, sorted by creation date, and sends the user information in the response.
- **Parameters:**
  - `res:` The Express response object.

### `updateUserRoleService` Service
- **Description:** Updates the role of a user in the MongoDB database and sends the updated user information in the response.
- **Parameters:**
  - `res:` The Express response object.
  - `id:` The user ID.
  - `role:` The new role to be assigned.

##
## COURSE MODEL AND SERVICES

## Course Database Model

### Schemas
- `IComment`: Represents a comment on a course, with a user, a question, and optional question replies.
- `IReview`: Represents a review of a course, with a user, a rating, a comment, and optional comment replies.
- `ILink`: Represents a link associated with a course, with a title and a URL.
- `ICourseData`: Represents additional data associated with a course, including a title, description, video details, links, suggestions, and questions.
- `ICourse`: Represents the main Course document, including name, description, price, thumbnail, tags, level, demo URL, benefits, prerequisites, reviews, course data, ratings, and purchase count.

### Model Creation
- The model is created using Mongoose's `Schema` and `Model` classes.
- Sub-schemas (`linkSchema`, `commentSchema`, `reviewSchema`, `courserDataSchema`) are defined using their respective interfaces and attached to the main course schema.

### Fields
- Various fields such as `name`, `description`, `price`, `tags`, `level`, `demoUrl`, `benefits`, `prerequisites`, `reviews`, `courseData`, `ratings`, and `purchased` are defined based on the respective interfaces.

## Course Services

### `createCourse` Service
- **Description:** Creates a new course and returns it in the response.
- **Parameters:**
  - `data:` Object containing course data.
  - `res:` Express response object.

### `getAllCoursesService` Service
- **Description:** Retrieves all courses from the MongoDB database, sorted by creation date, and sends the course information in the response.
- **Parameters:**
  - `res:` Express response object.
