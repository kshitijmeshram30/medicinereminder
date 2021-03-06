const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
    reminderMsg: String,
    remindAt: String,
    isReminded: Boolean,
    whatsAppNumber: String
})

module.exports = mongoose.model("Reminder", reminderSchema)