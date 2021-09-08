require('dotenv').config()
const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const Reminder = require('./config/mongodb');


//DB config
mongoose.connect('mongodb://localhost:27017/reminderAppDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, () => console.log("Database connected"))


//APP config
const app = express()
app.use(express.json())
app.use(express.urlencoded())
app.use(cors())
app.use('/', require(__dirname + '/routes'));

//Whatsapp reminding functionality
setInterval(() => {
    Reminder.find({}, (err, reminderList) => {
        if (err) {
            console.log(err)
        }
        if (reminderList) {
            reminderList.forEach(reminder => {
                if (!reminder.isReminded) {
                    const now = new Date()
                    if ((new Date(reminder.remindAt) - now) < 0) {
                        Reminder.findByIdAndUpdate(reminder._id, { isReminded: true }, (err, remindObj) => {
                            if (err) {
                                console.log(err)
                            }
                            const accountSid = process.env.ACCOUNT_SID
                            const authToken = process.env.AUTH_TOKEN
                            const client = require('twilio')(accountSid, authToken);
                            const whatsAppnum = 'whatsapp:'.concat(reminder.whatsAppNumber)
                            client.messages
                                .create({
                                    body: reminder.reminderMsg,
                                    from: 'whatsapp:+14155238886',
                                    to: whatsAppnum
                                })
                                .then(message => console.log(message.sid))
                                .done()
                        })
                    }
                }
            })
        }
    })
}, 1000);


app.listen(9000, () => console.log("Be started"))
