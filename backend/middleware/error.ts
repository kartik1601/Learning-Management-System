import { error } from 'console';
import ErrorHandler from '../utils/ErrorHandler';
import {NextFunction, Request,Response} from 'express';

export const ErrorMiddleware = (err:any , req: Request, res:Response, next:NextFunction) => {
    err.statusCode = err.statusCode || 500 ;
    err.message = err.message || 'Internal server error';

    //wrong mongodb id
    if(err.name === 'CastError'){
        const message = `Resouce not found. Invalid: ${err.path}`;
        err = new ErrorHandler(message,400);
    }

    //duplicate key
    if(err.code === 11000){
        const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
        err = new ErrorHandler(message,400);
    }

    // wrong jwt error
    if(err.name === 'JsonWebTokenError'){
        const message = `Json web token is invalid, try again!`;
        err = new ErrorHandler(message,400);
    }

    //Jwt expired error
    if(err.name === 'TokenExpiredError'){
        const message = `Json web token has expired, try again!`;
        err = new ErrorHandler(message,400);
    }

    res.status(err.statusCode).json({
        success: false,
        message:err.message
    })
}