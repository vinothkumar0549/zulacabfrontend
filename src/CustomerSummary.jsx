import React, { useEffect } from "react";
import { useCustomersummaryMutation } from "./apislice"; // Import RTK API slice
import "./CustomerSummary.css";

const CustomerSummary = ({ user, onClose }) => {
  const [customersummary, { data, error, isLoading }] = useCustomersummaryMutation();

  useEffect(() => {
      customersummary({
        customerusername: user.username,
        customerpassword: user.encryptedpassword // Ensure field matches backend
      });
  }, [user, customersummary]);

  return (
    <div className="activity-container">
      <h2>Customer Ride History</h2>
      {isLoading && <p>Loading...</p>}
      {error && <p className="error">Error: {error.message}</p>}
      {data?.length > 0 ? (
        <div className="transaction-list-container">
          <p><strong>Customer Id: </strong> {user.userid}</p>
          <p><strong>Customer Name: </strong>{user.name} </p>
          <ul className="transaction-list">
            <li className="transaction-item transaction-header">
              <div>Source</div>
              <div>Destination</div>
              <div>Cab Id</div>
              <div>Fare</div>
            </li>
            {data.map((ride) => (
              <li className="transaction-item" key={ride.rideid}>
                <div className="transaction-details">
                  <div>{ride.source}</div>
                  <div>{ride.destination}</div>
                  <div>{ride.cabid}</div>
                  <div>{ride.fare}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        !isLoading && <p>No Transactions</p>
      )}
      
      <button className="close-btn" onClick={onClose}>Close</button>
    </div>
  );
};

export default CustomerSummary;
