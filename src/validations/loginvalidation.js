const {body}=require("express-validator");

 const loginValidation=[
body('email').not().isEmpty().withMessage("Email should not be empty"),
body('email').isEmail().withMessage("Invalid email"),
body('password').isLength({min:6}).withMessage("The minimum password length is 6 characters"),
body ('password').not().isEmpty().withMessage("Password should not be empty")
];

const registerValidation=[
];


module.exports={loginValidation,registerValidation}