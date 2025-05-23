import React, { useState } from "react";
import "./CustomerDashboard.css";
import Profile from "./Profile";
import BookCab from "./BookCab";
import CustomerSummary from "./CustomerSummary";
import PenaltySummary from "./PenaltySummary";
//import App from "./App";


function CustomerDashboard({ user, onLogout }) {

    const [activeComponent, setActiveComponent] = useState(null);
    const [bookcab, setBookcab] = useState(false);

  const renderComponent = () =>{
    switch (activeComponent) {
      case "profile":
        return <Profile user={user} />;
      case "bookcab":
        return <BookCab user = {user} setBookcab = {setBookcab} />
      case "customersummary":
        return <CustomerSummary user= {user} onClose={() => setActiveComponent(null)} />
      case "penalty":
        return <PenaltySummary user = {user} onClose={() => setActiveComponent(null)} />
      default:
        return <Profile user={user} />;

    }
  };


  return (
    <div className="dashboard-container">
      <div className="top-section">
        <h2>Welcome, {user.name}</h2>
        <p><strong>Customer ID: </strong> {user.userid}</p>
        <p><strong>Name: </strong>{user.name}</p>
      </div>
      <div className="main-content">
        <div className="sidebar">
          <button className="btn" disabled={bookcab} onClick={() => setActiveComponent("profile")}>Profile</button>
          <button className="btn" onClick={() => setActiveComponent("bookcab")}>Book Cab</button>
          <button className="btn" disabled={bookcab} onClick={() => setActiveComponent("customersummary")}>Customer Summary</button>
          <button className="btn" disabled={bookcab} onClick={() => setActiveComponent("penalty")}>Penalty Summary</button>
          <button className="btn logout" disabled={bookcab} onClick={onLogout}>Logout</button>
        </div>
        <div className="content-area">
          {renderComponent()}
        </div>
      </div>
    </div>
  );
}

export default CustomerDashboard;