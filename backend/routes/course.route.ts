import express from "express";
import { addAnswer, addQuestion, addReplyToReview, addReview, deleteCourse, editCourse, getAllCourses, getAllCoursesAdmin, getCourseByUser, getSingleCourse, uploadCourse } from "../controllers/course.controller";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
const courseRouter = express.Router();

courseRouter.post("/create-course",isAuthenticated,authorizeRoles('admin'),uploadCourse);

courseRouter.put("/edit-course/:id",isAuthenticated,authorizeRoles('admin'),editCourse);

courseRouter.get("/get-course/:id",getSingleCourse);

courseRouter.get("/get-courses/:id",getAllCourses);

courseRouter.get("/get-course-content/:id",isAuthenticated,getCourseByUser);

courseRouter.put("/add-question/:id",isAuthenticated,addQuestion);

courseRouter.put("/add-answer/:id",isAuthenticated,addAnswer);

courseRouter.put("/add-review/:id",isAuthenticated,addReview);

courseRouter.put("/add-reply/:id",isAuthenticated,authorizeRoles('admin'),addReplyToReview);

courseRouter.get("/get-all-courses/:id",isAuthenticated,authorizeRoles('admin'),getAllCoursesAdmin);

courseRouter.delete("/delete-course/:id",isAuthenticated,authorizeRoles('admin'),deleteCourse);

export default courseRouter;