import React from "react";
import "./Profile.css";

function Profile({ user }) {

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>User Profile</h3>
        {user.role === "CUSTOMER" && (
          <p><strong>Customter Id: </strong> {user.userid}</p>
        )}   
        {user.role === "ADMIN" && (
          <p><strong>Admin Id: </strong> {user.userid}</p>
        )}     
        {user.role === "CAB" && (
          <p><strong>CAB Id: </strong> {user.userid}</p>
        )} 
        <p><strong>Name: </strong>{user.name}</p> 
        <p><strong>Username: </strong> {user.username}</p>
        <p><strong>Age: </strong> {user.age}</p>
        <p><strong>Gender: </strong> {user.gender}</p>

      </div>
    </div>
  );
}

export default Profile;
