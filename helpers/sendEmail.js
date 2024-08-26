import sgMail from "@sendgrid/mail";
import "dotenv/config";

const {SENDGRID_API } = process.env;

sgMail.setApiKey(SENDGRID_API);

const sendEmail = async (data) =>{
    const email = {...data};
    return sgMail.send(email).then(()=> {
        console.log("Email sent!")
    })
    .catch((error)=> {
        console.log(error)
    });   
}

export default sendEmail;