require('dotenv').config()
const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const routes = express.Router();
const Reminder = require('./config/mongodb');

routes.get("/getAllReminder", (req, res) => {
    Reminder.find({}, (err, reminderList) => {
        if (err) {
            console.log(err)
        }
        if (reminderList) {
            res.send(reminderList.reverse())
        }
    })
})

routes.post("/addReminder", (req, res) => {
    console.log("request received")
    const { reminderMsg, remindAt, numberStart, whatsAppNumber } = req.body
    const reminder = new Reminder({
        reminderMsg,
        remindAt,
        isReminded: false,
        whatsAppNumber: "" + numberStart + whatsAppNumber
    })
    reminder.save(err => {
        if (err) {
            console.log(err)
        }
        Reminder.find({}, (err, reminderList) => {
            if (err) {
                console.log(err)
            }
            if (reminderList) {
                res.send(reminderList.reverse())
            }
        })
    })

})

routes.post("/deleteReminder", (req, res) => {
    Reminder.deleteOne({ _id: req.body.id }, () => {
        Reminder.find({}, (err, reminderList) => {
            if (err) {
                console.log(err)
            }
            if (reminderList) {
                res.send(reminderList)
            }
        })
    })
})

module.exports = routes;