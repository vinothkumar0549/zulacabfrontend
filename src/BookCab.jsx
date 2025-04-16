import React, { useState } from "react";
import { useBookcabMutation, useRideconfirmMutation } from "./apislice";

function BookCab({user}) {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [ackData, setAckData] = useState(null);
  const [message, setMessage] = useState("");

  const [bookcab, { isLoading: requesting }] = useBookcabMutation();
  const [rideconfirm, { isLoading: confirming }] = useRideconfirmMutation();

  const handleRequest = async (e) => {
    e.preventDefault();
    try {
      const response = await bookcab({
        customerusername: user.username,
        customerpassword: user.encryptedpassword,
        source,
        destination

     }).unwrap();
      setAckData(response);
      setMessage("Cab request acknowledged. Please confirm.");
    } catch (err) {
      setMessage(err.data?.error || "Request failed");
    }
  };

  const handleConfirm = async () => {
    if (!ackData) return;
    try {
      const response = await rideconfirm({
        customerusername: user.username,
        customerpassword: user.encryptedpassword,
        ...ackData,
        confirm: true , 
    }).unwrap();
      setMessage("Cab confirmed successfully!");
      setAckData(null); // clear after confirmation
    } catch (err) {
      setMessage(err.data?.error || "Confirmation failed");
    }
  };

  const handleReject = () => {
    setAckData(null);
    setMessage("Cab request rejected.");
  };

  return (
    <div className="cab-form-container">
      <form onSubmit={handleRequest}>
        <input
          type="text"
          placeholder="Source"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          required
        />
        <button type="submit" disabled={requesting}>
          {requesting ? "Requesting..." : "Request Cab"}
        </button>
      </form>

      {ackData && (
        <div className="confirmation-box">
        <p>Acknowledged! Cab Details:</p>
        <ul>
          <li>Cab ID: {ackData.cabid}</li>
          <li>Distance: {ackData.distance} KM</li>
          <li>Fare: {ackData.fare}</li>
        </ul>
        <button onClick={handleConfirm} disabled={confirming}>
          {confirming ? "Confirming..." : "Confirm Cab"}
        </button>
        <button onClick={handleReject} disabled={confirming} style={{ marginLeft: "10px" }}>
            Reject Cab
        </button>
        </div>
      )}

      {message && <p>{message}</p>}
    </div>
  );
}

export default BookCab;
