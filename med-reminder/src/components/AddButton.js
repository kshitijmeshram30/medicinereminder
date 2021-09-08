import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from 'react-modal';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';

Modal.setAppElement('#root')

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

const AddButton = () => {
    const [modalIsOpen, setIsOpen] = React.useState(false);

    function openModal() {
        setIsOpen(true);
    }

    function closeModal() {
        setIsOpen(false);
    }

    function isAnyValueEmpty() {
        return reminderMsg === "" || whatsAppNumber === "" || remindAt === ""
    }

    const [reminderMsg, setReminderMsg] = useState("")
    const [errorMessage, setErrorMessage] = useState("")
    const [whatsAppNumber, setwhatsAppNumber] = useState("")
    const [numberStart, setnumberStart] = useState("")
    const [remindAt, setRemindAt] = useState("")
    const [reminderList, setReminderList] = useState([])

    useEffect(() => {
        axios.get("http://localhost:9000/getAllReminder").then(res => setReminderList(res.data))
    }, [])

    const addReminder = () => {
        if (!isAnyValueEmpty()) {
            closeModal()
            setErrorMessage("")
            axios.post("http://localhost:9000/addReminder", { reminderMsg, remindAt, numberStart, whatsAppNumber })
                .then(res => setReminderList(res.data))
            setReminderMsg("")
            setRemindAt()
            setwhatsAppNumber("")
        } else {
            closeModal()
            setErrorMessage("* Please add all fields")
            openModal()
        }
    }

    const deleteReminder = (id) => {
        axios.post("http://localhost:9000/deleteReminder", { id })
            .then(res => setReminderList(res.data))
    }
    return (
        <>
            <div className="container">
                <div>
                    <button id="white" className="add-button fa fa-plus" onClick={openModal} />
                    <Modal
                        isOpen={modalIsOpen}
                        onRequestClose={closeModal}
                        style={customStyles}
                        contentLabel="Add Medicines"
                    >
                        <div className="model-title-container">
                            <h2 className="modal-title">Add your medicine reminder</h2>
                            <button id="white" className="circle fa fa-close" onClick={closeModal} />
                        </div>
                        <p id="margin-top" className="red">{errorMessage}</p>
                        <div id="margin-top" className="form-group">
                            <label for="medicineName">Medicine Name</label>
                            <input type="text" className="form-control" id="medicineName" placeholder="Enter Medicine Name" value={reminderMsg} onChange={e => setReminderMsg(e.target.value)} />
                        </div>
                        <div id="margin-top" className="form-group">
                            <label for="whatsAppNumber">Your WhatsApp Number</label>
                            <div id="margin-top-6" className="row">
                                <div className="col-md-5">
                                    <input type="number" className="form-control" id="numberStart" placeholder="+91" value={numberStart} onChange={e => setnumberStart(e.target.value)} />
                                </div>
                                <div className="col-md-7">
                                    <input type="number" className="form-control" id="whatsAppNumber" placeholder="8888888888" value={whatsAppNumber} onChange={e => setwhatsAppNumber(e.target.value)} />
                                </div>
                            </div>
                        </div>

                        <div id="margin-top" className="form-group">
                            <label for="time">Select Time</label>
                            <input type="datetime-local" className="form-control" id="time" placeholder="Enter WhatsApp Number" value={remindAt} onChange={e => setRemindAt(e.target.value)} />
                        </div>
                        <div type="submit" id="margin-top" className="btn btn-primary btn-block" onClick={addReminder}>Add Reminder</div>
                    </Modal>
                </div>
                {
                    <div className="row">
                        {reminderList.map(reminder => (
                            <div className="col-md-4">
                                <div className="card" key={reminder._id}>
                                    <div className="card-header">
                                        {reminder.reminderMsg}
                                    </div>
                                    <div className="card-body">
                                        <p className="card-text">Remind me at {String(new Date(reminder.remindAt.toLocaleString('en-US', { timezone: "Asia/Kolkata" })))}</p>
                                        <p className="card-text small">Sending to {reminder.whatsAppNumber}</p>
                                        <button onClick={() => deleteReminder(reminder._id)} className="btn btn-primary">Delete</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                }
            </div>
        </>
    )
}
export default AddButton;
