require("dotenv").config()
const { workerData } = require("worker_threads");
const nodeMailer = require("nodemailer")
const axios = require('axios').default;

/* returns tomorrow's date in YYYY-MM-DD format */
function getTomorrowsDate(){
   let date = new Date();
   date.setHours(date.getHours() + 24);
   return date.toJSON().slice(0,10).replace(/-/g,'-');
}

async function getEmails() {
    let res_cleanings = await axios.get(`https://pa181-block-cleaning-server.us-south.cf.appdomain.cloud/cleaning/on_date/${getTomorrowsDate()}`)
    let cleanings = res_cleanings.data.result

    let streets = cleanings.map(value => value.street);

    let res_users = await axios.get(`https://pa181-block-cleaning-server.us-south.cf.appdomain.cloud/user`)
    let users = res_users.data.result

    let emails = []
    for (const user of users){
        if(streets.includes(user.street)) {
            emails.push(user.email)
        }
    }

    return emails.join(", ")
}

async function main() {

    let transporter = nodeMailer.createTransport({
        host: "smtp.mail.yahoo.com",
        port: 465,
        service: "yahoo",
        secure: false,
        auth: {
            user: "pa181_block_cleaning@yahoo.com",
            pass: "**********"
        },
        tls: {
            rejectUnauthorized: false
        }
    })

    await transporter.sendMail({
        from: "pa181_block_cleaning@yahoo.com",
        to: await getEmails(),
        subject: "Block Cleaning On Your Street Tommorrow!",
        text: "PA181 Project on Block Cleaning and Evaluation would like to notify you ...",
        html: "<b>\PA181 Project on Block Cleaning and Evaluation would like to notify you ...\</b>",
    })
}

main().catch(err => console.log(err));


