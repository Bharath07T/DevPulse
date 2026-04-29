import { validationResult } from "express-validator";

const validate = (req, res, next) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        const error = new Error(
            errors.array().map(e => e.msg).join(" | ")
        );
        error.statusCode = 400;
        error.errors = errors.array();
        return next(error);
    }

    next();
}

export default validate;