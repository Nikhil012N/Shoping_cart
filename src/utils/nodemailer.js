const nodemailer=require("nodemailer");

const transporter= nodemailer.createTransport({
    host:process.env.MAIL_SERVICE_PROVIDER,
    port:465,
    auth:{
        user:process.env.MAIL_USERNAME,
        pass:process.env.MAIL_PASSWORD
    },
   
})
transporter.verify(function(error, success) {
    if (error) {
          console.log(error);
    } else {
          console.log('Server is ready to take our messages');
    }
  });
  