import yup from 'yup';  // 1. import yup

//register validation
const registerSchema = yup.object().shape({
    name: yup.string().required(),
    email: yup.string().email().required(),
    password: yup.string().required().min(6),
});

//login validation
const loginSchema = yup.object().shape({
    email: yup.string().email().required(),
    password: yup.string().required().min(6),
});

// 1. create registerValidate function
async function registerValidate(req, res, next) {
    try{
        await registerSchema.validate(req.body);
        next();
    }catch(err){
        next(err);
    }
}

// 2. create loginValidate function
async function loginValidate(req, res, next) {
    try{
        await loginSchema.validate(req.body);
        next();
    }catch(err){
        next(err);
    }
} 

export {registerValidate, loginValidate}; 