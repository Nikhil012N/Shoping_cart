const nodemailer=require("nodemailer");

const transport= nodemailer.createTransport({
    host:process.env.MAIL_SERVICE_PROVIDER,
    port:587,
    auth:{
        user:process.env.MAIL_USERNAME,
        pass:process.env.MAIL_PASSWORD
    }
})