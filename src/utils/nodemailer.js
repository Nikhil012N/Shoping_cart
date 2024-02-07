const nodemailer=require("nodemailer");

const nodeMailer= nodemailer.createTransport({
    host:process.env.MAIL_SERVICE_PROVIDER,
    port:587,
    auth:{
        user:process.env.MAIL_USERNAME,
        pass:process.env.MAIL_PASSWORD
    },
   
})
nodeMailer.verify(function(error, success) {
    if (error) {
          console.log(error);
    } else {
          console.log('Server is ready to take our messages');
    }
  });
  module.exports=nodeMailer;