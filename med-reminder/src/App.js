import './App.css'
import React from "react";
import Navbar from "./components/Navbar";
import ReminderCard from "./components/ReminderCard";
import AddButton from "./components/AddButton";

function App() {
  return <>
  <Navbar />
  <AddButton />
  <ReminderCard />
  </>
}

export default App;