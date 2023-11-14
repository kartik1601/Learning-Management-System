# Learning-Management-System

## Backend of the Project

### Technologies Used
  - Languages: [Typescript](https://www.npmjs.com/package/typescript)
  - Frameworks: [ExpressJs](https://www.npmjs.com/package/express), [JSONWebToken](https://www.npmjs.com/package/jsonwebtoken), [Redis](https://www.npmjs.com/package/redis), [Mongoose](https://www.npmjs.com/package/mongoose)
  - Mailing: HTML, CSS, [EJS](https://www.npmjs.com/package/ejs)
  - Password Hashing: [BCrypt](https://www.npmjs.com/package/bcrypt#nodebcryptjs)
  - Scheduling Jobs: [Cron](https://www.npmjs.com/package/cron)
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

##
## ORDER SYSTEM
## Order Database Model

### Schema
- `IOrder`: Represents an order document with courseId, userId, and payment_info.
- `orderSchema`: Defines the schema for the Order model, including courseId, userId, and payment_info.

### Model Creation
- `OrderModel`: Represents the Mongoose model for the "Order" collection, created using the `Model<IOrder>` class.

## Order Services

### `newOrder` Service
- **Description:** Creates a new order and returns it in the response.
- **Parameters:**
  - `data:` Object containing order data.
  - `next:` Next function.
  - `res:` Express response object.

### `getAllOrdersService` Service
- **Description:** Retrieves all orders from the MongoDB database, sorted by creation date, and sends the order information in the response.
- **Parameters:**
  - `res:` Express response object.

## Order Controller

### `createOrder` Controller
- **Description:** Creates a new order for a user and sends an order confirmation email.
- **Parameters:**
  - `req:` Express request object.
  - `res:` Express response object.
  - `next:` Next function.

### `getAllOrders` Controller
- **Description:** Retrieves all orders for an admin.
- **Parameters:**
  - `req:` Express request object.
  - `res:` Express response object.
  - `next:` Next function.

## Order Controller Explanation

- **createOrder Controller:**
  - Fetches the `courseId` and `payment_info` from the request body.
  - Checks if the user has already purchased the course; if yes, returns an error.
  - Fetches the course based on the `courseId`.
  - Creates an order data object with `courseId` and `userId`.
  - Sends an order confirmation email to the user using [EJS](https://www.npmjs.com/package/ejs) template rendering and the `sendMail` utility.
  - Updates the user's courses and saves the user.
  - Creates a notification for the user about the new order.
  - Increments the `purchased` count for the course and saves the course.
  - Calls the `newOrder` service to create the order document in the database.

- **getAllOrders Controller:**
  - Calls the `getAllOrdersService` to retrieve all orders and sends the response.

##
## NOTIFICATIONS AND MAILING SYSTEM
## Notification Database Model

### Schema
- `INotification`: Represents a notification document with title, message, status, and userId.
- `notificationSchema`: Defines the schema for the Notification model, including title, message, status, and userId.

### Model Creation
- `NotificationModel`: Represents the Mongoose model for the "Notification" collection, created using the `Model<INotification>` class.

## Notification Controller

### `getNotifications` Controller
- **Description:** Retrieves all notifications (for admin only) and sends the notification information in the response.
- **Parameters:**
  - `req:` Express request object.
  - `res:` Express response object.
  - `next:` Next function.

### `updateNotification` Controller
- **Description:** Updates the status of a notification to "read" and sends the updated notifications in the response.
- **Parameters:**
  - `req:` Express request object.
  - `res:` Express response object.
  - `next:` Next function.

### Delete Read Notifications ([Cron](https://www.npmjs.com/package/cron) Job)
- **Description:** Deletes read notifications older than 30 days using a cron job.
- **Cron Schedule:** Runs daily at midnight.

## Mailing Templates
### 1. Activation Email Template

- **Purpose:** Sent to users for account activation.
- **Key Features:**
  - Activation code included.
  - Code expiration information.
  - Contact information in the footer.

### 2. New Reply Notification Email Template

- **Purpose:** Notifies users of a new reply to their question.
- **Key Features:**
  - Personalized greeting.
  - Details about the new reply.
  - Call-to-action to log in and view the reply.
  - Contact information in the footer.

### 3. Order Confirmation Email Template

- **Purpose:** Sent to users to confirm their e-learning course order.
- **Key Features:**
  - Order details, including order number and date.
  - Itemized list of the ordered course.
  - Subtotal and total cost information.
  - Contact information in the footer.

##
## ANALYTICS SYSTEM FOR ADMIN
### Analytics Generator

- **Function:** `generateLast12MonthsData`
  - **Purpose:** Generates analytics data for the last 12 months for Users signed up, Courses purchased and Orders maintained.
  - **Parameters:**
    - `model`: A Mongoose model for which analytics data needs to be generated.
  - **Returns:**
    - An object containing an array of `MonthData` objects representing the count of documents for each month over the last 12 months.

### Analytics Controller

#### 1. Users Analytics

- **Purpose:** Provides User data analytics for the last 12 months to admin.
- **Steps:**
  1. Calls `generateLast12MonthsData` for the `userModel`.
  2. Sends the generated analytics data as a response.

#### 2. Courses Analytics

- **Purpose:** Provides course data analytics for the last 12 months to admin.
- **Steps:**
  1. Calls `generateLast12MonthsData` for the `CourseModel`.
  2. Sends the generated analytics data as a response.

#### 3. Orders Analytics

- **Purpose:** Provides order data analytics for the last 12 months to admin.
- **Steps:**
  1. Calls `generateLast12MonthsData` for the `OrderModel`.
  2. Sends the generated analytics data as a response.

### General Considerations:

- **Error Handling:** Errors are appropriately caught and handled using the `CatchAsyncError` middleware.

- **Modularity:** The use of a separate utility function (`generateLast12MonthsData`) enhances modularity and code readability.

- **Async/Await:** The use of `async/await` ensures proper handling of asynchronous operations.

##
## ADVANCED CACHING SYSTEM
### [Redis](https://www.npmjs.com/package/redis) Caching with [Upstash](https://upstash.com/)

[Redis](https://www.npmjs.com/package/redis) is an open-source, in-memory data structure store that can be used as a cache, message broker, and more. [Upstash](https://upstash.com/) is a Redis hosting service that provides a Redis server in the cloud, making it easy to integrate Redis into your applications.

#### Key Benefits of Redis Caching:

1. **In-Memory Storage:** Redis stores data in memory, making it incredibly fast for read-heavy operations.

2. **Key-Value Store:** Data is stored as key-value pairs, allowing for efficient retrieval.

3. **Expiration:** You can set expiration times for keys, making Redis suitable for caching.

4. **Data Structures:** Redis supports various data structures like strings, hashes, lists, sets, and more.

#### How Caching Works in the Provided Code:

##### 1. Redis Configuration:

The code checks if there's a `REDIS_URL` in the environment variables. If present, it creates a new Redis client using the provided URL. If not, it throws an error, indicating a failed Redis connection.

```
const redisClient = () => {
    if(process.env.REDIS_URL){
        console.log(`Redis connected`);
        return process.env.REDIS_URL;
    }
    throw new Error('Redis connection failed!');
};
```

##### 2. Creating a Redis Client Instance:

An instance of the Redis client is created using the `redisClient` function. This instance (`redis`) can now be used to interact with the Redis server.

```
export const redis = new Redis(redisClient());
```

##### 3. Caching Data in Controllers:

In each controller (`user.controller`, `course.controller`, `order.controller`), the code uses the `redis` instance to set data with a specified key and expiration time.

```
await redis.set(user._id, JSON.stringify(user), "EX", 604800);
```

In the above code example, it's setting the user data with the key being the user's ID and an expiration time of 604800 seconds (7 days).

#### Considerations:

- **Key Naming:** Using meaningful keys helps organize and retrieve cached data efficiently.
- **Expiration Time:** Setting an appropriate expiration time balances the freshness of the data and the performance gains from caching.
- **Cache Invalidation:** When relevant data is updated or deleted, the corresponding cache should be invalidated to avoid serving outdated information.
- **Monitoring:** Monitoring Redis usage and performance is essential for optimizing cache utilization.

##
## ROUTE TESTING SYSTEM
### [Postman](https://www.postman.com/) Service

[Postman](https://www.postman.com/) is a widely used API development and testing tool that simplifies the process of creating, testing, and managing APIs. [Here](https://learning.postman.com/docs/introduction/overview/) is the documentation for testing the APIs implemented in the given Express.js application. Below are the explanation of the various routes used for the application:

### User Router

1. **Registration**
   - **Endpoint:** `POST /registration`
   - **Description:** Register a new user.
   - **Test in POSTMAN:** Send a POST request to `http://test-url/registration` with the required parameters (e.g., username, email, password).

2. **Activate User**
   - **Endpoint:** `POST /activate-user`
   - **Description:** Activate a user account.
   - **Test in POSTMAN:** Send a POST request to `http://test-url/activate-user` with the required parameters (e.g., activation code).

3. **Login**
   - **Endpoint:** `POST /login`
   - **Description:** Log in a user.
   - **Test in POSTMAN:** Send a POST request to `http://test-url/login` with the required parameters (e.g., email, password).

4. **Logout**
   - **Endpoint:** `GET /logout`
   - **Description:** Log out the currently authenticated user.
   - **Test in POSTMAN:** Send a GET request to `http://test-url/logout` with the required authorization header.

5. **Refresh Token**
   - **Endpoint:** `GET /refresh`
   - **Description:** Refresh the access token.
   - **Test in POSTMAN:** Send a GET request to `http://test-url/refresh` with the required authorization header.

6. **Get User Info**
   - **Endpoint:** `GET /me`
   - **Description:** Get information about the currently authenticated user.
   - **Test in POSTMAN:** Send a GET request to `http://test-url/me` with the required authorization header.

7. **Social Authentication**
   - **Endpoint:** `POST /social-auth`
   - **Description:** Authenticate a user using a social platform.
   - **Test in POSTMAN:** Send a POST request to `http://test-url/social-auth` with the required parameters.

8. **Update User Info**
   - **Endpoint:** `PUT /update-user-info`
   - **Description:** Update user information.
   - **Test in POSTMAN:** Send a PUT request to `http://test-url/update-user-info` with the required parameters and authorization header.

9. **Update User Password**
   - **Endpoint:** `PUT /update-user-password`
   - **Description:** Update user password.
   - **Test in POSTMAN:** Send a PUT request to `http://test-url/update-user-password` with the required parameters and authorization header.

10. **Update User Avatar**
    - **Endpoint:** `PUT /update-user-avatar`
    - **Description:** Update user profile picture.
    - **Test in POSTMAN:** Send a PUT request to `http://test-url/update-user-avatar` with the required parameters and authorization header.

11. **Get All Users (Admin)**
    - **Endpoint:** `GET /get-users`
    - **Description:** Get a list of all users (admin only).
    - **Test in POSTMAN:** Send a GET request to `http://test-url/get-users` with the required authorization header.

12. **Update User Role (Admin)**
    - **Endpoint:** `PUT /update-user-role`
    - **Description:** Update user role (admin only).
    - **Test in POSTMAN:** Send a PUT request to `http://test-url/update-user-role` with the required parameters and authorization header.

13. **Delete User (Admin)**
    - **Endpoint:** `DELETE /delete-user`
    - **Description:** Delete a user (admin only).
    - **Test in POSTMAN:** Send a DELETE request to `http://test-url/delete-user` with the required parameters and authorization header.

### Course Router

1. **Create Course (Admin)**
   - **Endpoint:** `POST /create-course`
   - **Description:** Create a new course (admin only).
   - **Test in POSTMAN:** Send a POST request to `http://test-url/create-course` with the required parameters and authorization header.

2. **Edit Course (Admin)**
   - **Endpoint:** `PUT /edit-course/:id`
   - **Description:** Edit an existing course (admin only).
   - **Test in POSTMAN:** Send a PUT request to `http://test-url/edit-course/:id` with the required parameters and authorization header.

3. **Get Single Course**
   - **Endpoint:** `GET /get-course/:id`
   - **Description:** Get details of a single course.
   - **Test in POSTMAN:** Send a GET request to `http://test-url/get-course/:id` with the required parameters.

4. **Get All Courses**
   - **Endpoint:** `GET /get-courses/:id`
   - **Description:** Get a list of all courses.
   - **Test in POSTMAN:** Send a GET request to `http://test-url/get-courses/:id` with the required parameters.

5. **Get Course Content**
   - **Endpoint:** `GET /get-course-content/:id`
   - **Description:** Get the content of a course for the authenticated user.
   - **Test in POSTMAN:** Send a GET request to `http://test-url/get-course-content/:id` with the required parameters and authorization header.

6. **Add Question**
   - **Endpoint:** `PUT /add-question/:id`
   - **Description:** Add a question to a course.
   - **Test in POSTMAN:** Send a PUT request to `http://test-url/add-question/:id` with the required parameters and authorization header.

7. **Add Answer**
   - **Endpoint:** `PUT /add-answer/:id`
   - **Description:** Add an answer to a question in a course.
   - **Test in POSTMAN:** Send a PUT request to `http://test-url/add-answer/:id` with the required parameters and authorization header.

8. **Add Review**
   - **Endpoint:** `PUT /add-review/:id`
   - **Description:** Add a review to a course.
   - **Test in POSTMAN:** Send a PUT request to `http://test-url/add-review/:id` with the required parameters and authorization header.

9. **Add Reply to Review (Admin)**
   - **Endpoint:** `PUT /add-reply/:id`
   - **Description:** Add a reply to a review (admin only).
   - **Test in POSTMAN:** Send a PUT request to `http://test-url/add-reply/:id` with the required parameters and authorization header.

10. **Get All Courses (Admin)**
    - **Endpoint:** `GET /get-all-courses/:id`
    - **Description:** Get a list of all courses for admin purposes.
    - **Test in POSTMAN:** Send a GET request to `http://test-url/get-all-courses/:id` with the required authorization header.

11. **Delete Course (Admin)**
    - **Endpoint:** `DELETE /delete-course/:id`
    - **Description:** Delete a course (admin only).
    - **Test in POSTMAN:** Send a DELETE request to `http://test-url/delete-course/:id` with the required parameters and authorization header.

### Order Router

1. **Create Order**
   - **Endpoint:** `POST /create-order`
   - **Description:** Create a new order.
   - **Test in POSTMAN:** Send a POST request to `http://test-url/create-order` with the required parameters and authorization header.

2. **Get All Orders (Admin)**
   - **Endpoint:** `GET /get-orders`
   - **Description:** Get a list of all orders (admin only).
   - **Test in POSTMAN:** Send a GET request to `http://test-url/get-orders` with the required authorization header.

### Analytics Router

1. **Get Users Analytics (Admin)**
   - **Endpoint:** `GET /get-users-analytics`
   - **Description:** Get analytics data for user-related activities (admin only).
   - **Test in POSTMAN:** Send a GET request to `http://test-url/get-users-analytics` with the required authorization header.

2. **Get Courses Analytics (Admin)**
   - **Endpoint:** `GET /get-courses-analytics`
   - **Description:** Get analytics data for course-related activities (admin only).
   - **Test in POSTMAN:** Send a GET request to `http://test-url/get-courses-analytics` with the required authorization header.

3. **Get Orders Analytics (Admin)**
   - **Endpoint:** `GET /get-orders-analytics`
   - **Description:** Get analytics data for order-related activities (admin only).
   - **Test in POSTMAN:** Send a GET request to `http://test-url/get-orders-analytics` with the required authorization header.

### Notification Router

1. **Get All Notifications (Admin)**
   - **Endpoint:** `GET /get-all-notifications`
   - **Description:** Get a list of all notifications (admin only).
   - **Test in POSTMAN:** Send a GET request to `http://test-url/get-all-notifications` with the required authorization header.

2. **Update Notifications (Admin)**
   - **Endpoint:** `GET /update-notifications/:id`
   - **Description:** Update the status of a notification (admin only).
   - **Test in POSTMAN:** Send a GET request to `http://test-url/update-notifications/:id` with the required authorization header.

### Layout Router

1. **Create Layout (Admin)**
   - **Endpoint:** `POST /create-layout`
   - **Description:** Create a new layout (admin only).
   - **Test in POSTMAN:** Send a POST request to `http://test-url/create-layout` with the required parameters and authorization header.

2. **Edit Layout (Admin)**
   - **Endpoint:** `PUT /edit-layout`
   - **Description:** Edit an existing layout (admin only).
   - **Test in POSTMAN:** Send a PUT request to `http://test-url/edit-layout` with the required parameters and authorization header.

3. **Get Layout**
   - **Endpoint:** `GET /get-layout`
   - **Description:** Get layout details.
   - **Test in POSTMAN:** Send a GET request to `http://test-url/get-layout` with the required parameters.

> Authorization Header are of two types: `Authenticated-User` and `Authorized-Role`, meaning some routes can only be accessed by logged on users or admins.

> *__THIS IS THE END OF DESCRIPTION FOR THE BACKEND SERVICE PROVIDED FOR THE LEARNING-MANAGEMENT-SYSTEM.__*
