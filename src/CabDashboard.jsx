import React, { useState } from "react";
import "./CustomerDashboard.css";
import Profile from "./Profile";
import CabSummary from "./CabSummary"
//import App from "./App";


function CabDashboard({ user, onLogout }) {

    const [activeComponent, setActiveComponent] = useState(null);

  const renderComponent = () =>{
    switch (activeComponent) {
      case "profile":
        return <Profile user={user} />;
      case "cabsummary":
        return <CabSummary user= {user} onClose= {() => setActiveComponent(null)} />
      default:
        return <Profile user={user} />;

    }
  };


  return (
    <div className="dashboard-container">
      <div className="top-section">
        <h2>Welcome, {user.name}</h2>
        <p><strong>Cab ID: </strong> {user.userid}</p>
        <p><strong>Name: </strong>{user.name}</p>
      </div>
      <div className="main-content">
        <div className="sidebar">
          <button className="btn" onClick={() => setActiveComponent("profile")}>Profile</button>
          <button className="btn" onClick={() => setActiveComponent("cabsummary")}>Cab Summary</button>
          <button className="btn logout" onClick={onLogout}>Logout</button>
        </div>
        <div className="content-area">
          {renderComponent()}
        </div>
      </div>
    </div>
  );
}

export default CabDashboard;