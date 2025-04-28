import React, { useState, useEffect } from "react";
import "./CustomerDashboard.css";
import Profile from "./Profile";
import CabSummary from "./CabSummary";
import ChatComponent from "./ChatComponent"; // ✅ Import ChatComponent

function CabDashboard({ user, onLogout }) {
  const [activeComponent, setActiveComponent] = useState(null);
  const [rideUpdate, setRideUpdate] = useState(null); // Stores ride info object
  const [roomId, setRoomId] = useState(null); // Stores room ID

  useEffect(() => {
    const socket = new WebSocket(`ws://localhost:8080/cab/cab/${user.userid}`);

    socket.onopen = () => {
      console.log("Driver WebSocket connected for ride updates.");
    };

    socket.onmessage = (event) => {
      console.log("Received ride update:", event.data);
      try {
        const rideInfo = JSON.parse(event.data); // Assuming JSON format
        setRideUpdate(rideInfo);
        setRoomId(rideInfo.roomId); // ✅ Extract roomId
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
      case "chat":
        // Show chat only if roomId is available
        return roomId ? (
          <ChatComponent roomId={roomId} userId={user.userid} userType="CAB" rideUpdate={rideUpdate} />
        ) : (
          <p>No active ride to chat yet.</p>
        );
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
          {roomId && (
            <>
              <button className="btn" onClick={() => setActiveComponent("chat")}>Chat</button>
            </>
          )}
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










// import React, { useState, useEffect } from "react";
// import "./CustomerDashboard.css";
// import Profile from "./Profile";
// import CabSummary from "./CabSummary";
// import ChatComponent from "./ChatComponent"; // ✅ Add Chat Component

// function CabDashboard({ user, onLogout }) {
//   const [activeComponent, setActiveComponent] = useState(null);
//   const [rideUpdate, setRideUpdate] = useState(null); // Stores entire ride info object
//   const [roomId, setRoomId] = useState(null); // ✅ Store room ID

//   useEffect(() => {
//     const socket = new WebSocket(`ws://localhost:8080/cab/cab/${user.userid}`);

//     socket.onopen = () => {
//       console.log("Driver WebSocket connected for ride updates.");
//     };

//     socket.onmessage = (event) => {
//       console.log("Received ride update:", event.data);
//       try {
//         const rideInfo = JSON.parse(event.data); // Assuming JSON format
//         setRideUpdate(rideInfo);
//         setRoomId(rideInfo.roomId); // ✅ Extract roomId to initiate chat WebSocket
//       } catch (err) {
//         console.error("Invalid ride update format", err);
//       }
//     };

//     socket.onclose = () => {
//       console.log("WebSocket connection closed.");
//     };

//     return () => {
//       socket.close();
//     };
//   }, [user.userid]);

//   const handleClosePopup = () => {
//     setRideUpdate(null);
//   };

//   const renderComponent = () => {
//     switch (activeComponent) {
//       case "profile":
//         return <Profile user={user} />;
//       case "cabsummary":
//         return <CabSummary user={user} onClose={() => setActiveComponent(null)} />;
//       default:
//         return <Profile user={user} />;
//     }
//   };

//   return (
//     <div className="dashboard-container">
//       <div className="top-section">
//         <h2>Welcome, {user.name}</h2>
//         <p><strong>Cab ID:</strong> {user.userid}</p>
//         <p><strong>Name:</strong> {user.name}</p>
//       </div>

//       <div className="main-content">
//         <div className="sidebar">
//           <button className="btn" onClick={() => setActiveComponent("profile")}>Profile</button>
//           <button className="btn" onClick={() => setActiveComponent("cabsummary")}>Cab Summary</button>
//           <button className="btn logout" onClick={onLogout}>Logout</button>
//         </div>

//         <div className="content-area">
//           {renderComponent()}
          
//           {/* ✅ Show Chat if roomId is set */}
//           {roomId && (
//             <div className="chat-container">
//               <ChatComponent roomId={roomId} userId={user.userid} userType="CAB" />
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Optional Ride Pop-up */}
//       {roomId && (
//         <div className="popup">
//           <div className="popup-content">
//             <h3>New Ride Assigned</h3>
//             <p>Source: {rideUpdate.source}</p>
//             <p>Destination: {rideUpdate.destination}</p>
//             <button onClick={handleClosePopup}>Close</button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default CabDashboard;