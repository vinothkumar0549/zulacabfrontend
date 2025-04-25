import React, { useState, useEffect } from "react";
import "./CustomerDashboard.css";
import Profile from "./Profile";
import CabSummary from "./CabSummary";
import ChatComponent from "./ChatComponent"; // ✅ Add Chat Component

function CabDashboard({ user, onLogout }) {
  const [activeComponent, setActiveComponent] = useState(null);
  const [rideUpdate, setRideUpdate] = useState(null); // Stores entire ride info object
  const [roomId, setRoomId] = useState(null); // ✅ Store room ID

  useEffect(() => {
    const socket = new WebSocket(`ws://localhost:8080/cab/driver/${user.userid}`);

    socket.onopen = () => {
      console.log("Driver WebSocket connected for ride updates.");
    };

    socket.onmessage = (event) => {
      console.log("Received ride update:", event.data);
      try {
        const rideInfo = JSON.parse(event.data); // Assuming JSON format
        setRideUpdate(rideInfo);
        setRoomId(rideInfo.roomId); // ✅ Extract roomId to initiate chat WebSocket
      } catch (err) {
        console.error("Invalid ride update format", err);
      }
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed.");
    };

    return () => {
      socket.close();
    };
  }, [user.userid]);

  const handleClosePopup = () => {
    setRideUpdate(null);
  };

  const renderComponent = () => {
    switch (activeComponent) {
      case "profile":
        return <Profile user={user} />;
      case "cabsummary":
        return <CabSummary user={user} onClose={() => setActiveComponent(null)} />;
      default:
        return <Profile user={user} />;
    }
  };

  return (
    <div className="dashboard-container">
      <div className="top-section">
        <h2>Welcome, {user.name}</h2>
        <p><strong>Cab ID:</strong> {user.userid}</p>
        <p><strong>Name:</strong> {user.name}</p>
      </div>

      <div className="main-content">
        <div className="sidebar">
          <button className="btn" onClick={() => setActiveComponent("profile")}>Profile</button>
          <button className="btn" onClick={() => setActiveComponent("cabsummary")}>Cab Summary</button>
          <button className="btn logout" onClick={onLogout}>Logout</button>
        </div>

        <div className="content-area">
          {renderComponent()}
          
          {/* ✅ Show Chat if roomId is set */}
          {roomId && (
            <div className="chat-container">
              <ChatComponent roomId={roomId} userId={user.userid} userType="CAB" />
            </div>
          )}
        </div>
      </div>

      {/* Optional Ride Pop-up */}
      {rideUpdate && (
        <div className="popup">
          <div className="popup-content">
            <h3>New Ride Assigned</h3>
            <p>Source: {rideUpdate.source}</p>
            <p>Destination: {rideUpdate.destination}</p>
            <button onClick={handleClosePopup}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CabDashboard;






// import React, { useState, useEffect } from "react";
// import "./CustomerDashboard.css";
// import Profile from "./Profile";
// import CabSummary from "./CabSummary"
// //import App from "./App";


// function CabDashboard({ user, onLogout }) {

//     const [activeComponent, setActiveComponent] = useState(null);
//     const [rideUpdate, setRideUpdate] = useState(null);  // Store the received ride update message

    
//     useEffect(() => {
//       const socket = new WebSocket(`ws://localhost:8080/cab/driver/${user.userid}`);
      
//       // Handle WebSocket open event
//       socket.onopen = () => {
//           console.log("Driver WebSocket connected for ride updates.");
//       };

//       // Handle incoming messages from WebSocket
//       socket.onmessage = (event) => {
//           const message = event.data;
//           console.log("Received ride update:", message);

//           // You can store the message in the state and trigger a pop-up or display it
//           setRideUpdate(message);
//       };

//       // Handle WebSocket close event
//       socket.onclose = () => {
//           console.log("WebSocket connection closed.");
//       };

//       // Cleanup WebSocket connection on component unmount
//       return () => {
//           socket.close();
//       };
//   }, [user.userid]);

//   const handleClosePopup = () => {
//     setRideUpdate(null);  // Close the pop-up by clearing the message
// };


//   const renderComponent = () =>{
//     switch (activeComponent) {
//       case "profile":
//         return <Profile user={user} />;
//       case "cabsummary":
//         return <CabSummary user= {user} onClose= {() => setActiveComponent(null)} />
//       default:
//         return <Profile user={user} />;

//     }
//   };


//   return (
//     <div className="dashboard-container">
//       <div className="top-section">
//         <h2>Welcome, {user.name}</h2>
//         <p><strong>Cab ID: </strong> {user.userid}</p>
//         <p><strong>Name: </strong>{user.name}</p>
//       </div>
//       <div className="main-content">
//         <div className="sidebar">
//           <button className="btn" onClick={() => setActiveComponent("profile")}>Profile</button>
//           <button className="btn" onClick={() => setActiveComponent("cabsummary")}>Cab Summary</button>
//           <button className="btn logout" onClick={onLogout}>Logout</button>
//         </div>
//         <div className="content-area">
//           {renderComponent()}
//         </div>
//       </div>
//       {/* Display a pop-up if there is a ride update */}
//       {rideUpdate && (
//                 <div className="popup">
//                     <div className="popup-content">
//                         <h3>New Ride Update</h3>
//                         <p>{rideUpdate}</p>
//                         <button onClick={handleClosePopup}>Close</button>
//                     </div>
//                 </div>
//             )}
//     </div>
//   );
// }

// export default CabDashboard;