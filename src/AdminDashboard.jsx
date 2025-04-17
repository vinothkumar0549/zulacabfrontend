import React, { useState } from "react";
import "./CustomerDashboard.css";
import Profile from "./Profile";
import CabRegister from "./CabRegister";
import GetAllCabSummary from "./GetAllCabSummary";
import GetAllCustomerSummary from "./GetAllCustomerSummary"
import AddLocation from "./AddLocation";
import RemoveLocation from "./RemoveLocation"
//import App from "./App";


function AdminDashboard({ user,setuser, onLogout }) {

    const [activeComponent, setActiveComponent] = useState(null);

  const renderComponent = () =>{
    switch (activeComponent) {
      case "profile":
        return <Profile user={user} onClose={() => setActiveComponent(null)} />;
      case "cabregister":
        return <CabRegister user = {user} onClose = {() => setActiveComponent(null)} />
      case "getallcabsummary":
        return <GetAllCabSummary user = {user} onClick = {() => setActiveComponent(null)} />
      case "getallcustomersummary":
        return <GetAllCustomerSummary user = {user} onClick = {() => setActiveComponent(null)} />
      case "addlocation":
        return <AddLocation user = {user} onClick = {() => setActiveComponent(null)} />
      case "removelocation":
        return <RemoveLocation user = {user} onClick = {() => setActiveComponent(null)} />
      default:
        return <Profile user={user} onClose={() => setActiveComponent(null)} />;

    }
  };


  return (
    <div className="dashboard-container">
      <div className="top-section">
        <h2>Welcome, {user.name}</h2>
        <p><strong>Admin ID: </strong> {user.userid}</p>
        <p><strong>Name: </strong>{user.name}</p>
      </div>
      <div className="main-content">
        <div className="sidebar">
          <button className="btn" onClick={() => setActiveComponent("profile")}>Profile</button>
          <button className="btn" onClick={() => setActiveComponent("cabregister")}>Cab Register</button>
          <button className="btn" onClick={() => setActiveComponent("addlocation")}>Add Location</button>
          <button className="btn" onClick={() => setActiveComponent("removelocation")}>Remove Location</button>
          <button className="btn" onClick={() => setActiveComponent("getallcabsummary")}>All Cab Summary</button>
          <button className="btn" onClick={() => setActiveComponent("getallcustomersummary")}>All Customer Summary</button>
          <button className="btn logout" onClick={onLogout}>Logout</button>
        </div>
        <div className="content-area">
          {renderComponent()}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;