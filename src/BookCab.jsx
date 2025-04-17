import React, { useState, useEffect } from "react";
import { useAvailablecabsMutation, useBookcabMutation, useRideconfirmMutation } from "./apislice";

function BookCab({user}) {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [ackData, setAckData] = useState(null);
  const [message, setMessage] = useState("");
  const [refreshCabs, setRefreshCabs] = useState(false);
  const [bookcab, { isLoading: requesting }] = useBookcabMutation();
  const [rideconfirm, { isLoading: confirming }] = useRideconfirmMutation();
  const [getAvailableCabs, { data, error, isLoading }] = useAvailablecabsMutation();

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
    } catch (err) {
      setMessage(err.data?.error || "Request failed");
    }
  };

  const handleConfirm = async () => {
    if (!ackData) return;
    try {
      const response = await rideconfirm({
        customerusername: user.username,
        customerpassword: user.password,
        ...ackData,
        confirm: true , 
    }).unwrap();
      setMessage("Cab confirmed successfully!");
      setRefreshCabs(prev => !prev);
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
