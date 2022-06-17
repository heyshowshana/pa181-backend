const express = require('express');
const app = express()
const Bree = require('bree')

const bree = new Bree({
    jobs : [{
        name : 'sendEmail',
        cron : '30 14 * * *', // runs every day at 14:30
        worker : {
            workerData : {
                description : "This job will send emails."
            }
        }
    }]
})

bree.start()

app.listen(5001, () => console.log("Listening on port 5001"))


