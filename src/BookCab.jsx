import React, { useState, useEffect } from "react";
import { useAvailablecabsMutation, useBookcabMutation, useRideconfirmMutation, useCancelrideMutation } from "./apislice";

function BookCab({user}) {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [ackData, setAckData] = useState(null);
  const [message, setMessage] = useState("");
  const [refreshCabs, setRefreshCabs] = useState(false);
  const [bookcab, { isLoading: requesting }] = useBookcabMutation();
  const [rideconfirm, { isLoading: confirming }] = useRideconfirmMutation();
  const [getAvailableCabs, { data, error, isLoading }] = useAvailablecabsMutation();
  const [cancelride] = useCancelrideMutation();
  const [timer, setTimer] = useState(null); // Timer state to track timeout
  const [countdown, setCountdown] = useState(60); // For showing 60 seconds


  useEffect(() => {
    const fetchCabs = async () => {
      try {
        const response = await getAvailableCabs({
          customerusername: user.username,
          customerpassword: user.password
        }).unwrap();
      } catch (err) {
        console.error("Failed to fetch cabs:", err);
      }
    };
    fetchCabs();
  }, [getAvailableCabs, refreshCabs]);

  const handleRequest = async (e) => {
    e.preventDefault();
    try {
      const response = await bookcab({
        customerusername: user.username,
        customerpassword: user.password,
        source,
        destination

     }).unwrap();
      setAckData(response);
      setMessage("Cab request acknowledged. Please confirm.");
      startConfirmationTimer(); // Start the timer for 1 minute
    } catch (err) {
      setMessage(err.data?.error || "Request failed");
    }
  };

  const startConfirmationTimer = () => {
    setCountdown(60); // Reset countdown
    const newTimer = setTimeout(() => {
      setAckData(null);
      setMessage("Cab request timed out. Please re-enter your details.");
      setCountdown(60); // Reset for future requests
    }, 60000);
    setTimer(newTimer);
  
    // Start visual countdown
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 60;
        }
        return prev - 1;
      });
    }, 1000);
  };
  
  const clearAllTimers = () => {
    clearTimeout(timer);
    setCountdown(60); // Reset countdown display
  };
  
  // In confirm and reject handlers
  const handleConfirm = async () => {
    if (!ackData) return;
    try {
      const response = await rideconfirm({
        customerusername: user.username,
        customerpassword: user.password,
        ...ackData,
        confirm: true,
      }).unwrap();
      setMessage("Cab confirmed successfully!");
      setRefreshCabs((prev) => !prev);
      setAckData(null);
      clearAllTimers();
    } catch (err) {
      setMessage(err.data?.error || "Confirmation failed");
    }
  };
  
  const handleReject = async () => {
    if (!ackData) return;
  
    try {
      const response = await cancelride({
        customerusername: user.username,
        customerpassword: user.password,
        cabid: ackData.cabid
      }).unwrap();
  
      setMessage("Cabid " + response.cancel + " request cancelled successfully.");
    } catch (err) {
      setMessage(err.data?.error || "Failed to cancel cab request.");
    }
  
    setAckData(null);
    clearAllTimers();
  };
  

  return (
    <div className="cab-form-container">
      <form onSubmit={handleRequest}>
        <input
          type="text"
          placeholder="Source"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          disabled={!!ackData} // disable input when ackData exists
          required
        />
        <input
          type="text"
          placeholder="Destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          disabled={!!ackData}
          required
        />
        <button type="submit" disabled={requesting || !!ackData}>
          {requesting ? "Requesting..." : "Request Cab"}
        </button>
      </form>

      <div className="available-cabs">
  <h4>Available Cabs:</h4>

  {data?.length > 0 ? (
    <table style={{ borderCollapse: "collapse", width: "100%" }}>
      <thead>
        <tr>
          <th style={{ border: "1px solid #ccc", padding: "8px" }}>Location</th>
          <th style={{ border: "1px solid #ccc", padding: "8px" }}>Cab ID's</th>
        </tr>
      </thead>
      <tbody>
        {data.map((loc, index) => (
          <tr key={index}>
            <td style={{ border: "1px solid #ccc", padding: "8px" }}>
              {loc.locationname}
            </td>
            <td style={{ border: "1px solid #ccc", padding: "8px" }}>
              {loc.cabid.split(",").map((id, idx) => (
                <span key={idx} style={{ marginRight: "6px" }}>
                  {id}
                </span>
              ))}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  ) : (
    <p>No cabs available</p>
  )}
</div>

      {ackData && (
        <div className="confirmation-box"  style={{ position: "relative" }}>
        <div style={{ position: "absolute", top: 0, right: 0, color: "red", fontWeight: "bold" }}>
          Time left: {countdown}s
        </div>
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
