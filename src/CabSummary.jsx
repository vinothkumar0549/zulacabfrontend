import React, { useEffect } from "react";
import { useCabsummaryMutation } from "./apislice"; // Import RTK API slice
import "./CustomerSummary.css";

const CustomerSummary = ({ user, onClose }) => {
  const [cabsummary, { data, error, isLoading }] = useCabsummaryMutation();

  useEffect(() => {
      cabsummary({
        // cabusername: user.username,
        // cabpassword: user.password // Ensure field matches backend
      });
  }, [user, cabsummary]);

  const totals = data?.reduce(
    (acc, ride) => {
      acc.fare += ride.fare;
      acc.commission += ride.commission;
      acc.trips += 1;
      return acc;
    },
    { fare: 0, commission: 0, trips: 0 }
  ) || { fare: 0, commission: 0, trips: 0 };

  return (
    <div className="activity-container">
      <h2>Cab Ride History</h2>
      {isLoading && <p>Loading...</p>}
      {error && <p className="error">Error: {error.message}</p>}
      {data?.length > 0 ? (
        <div className="transaction-list-container">
          <p><strong>Cab Id: </strong> {user.userid}</p>
          <p><strong>Cab Name: </strong>{user.name} </p>
          <p><strong>Total Fare Collected: </strong>{totals.fare}</p>
          <p><strong>Total Commission: </strong>{totals.commission}</p>
          <p><strong>Total Trips: </strong>{totals.trips}</p>
          <ul className="transaction-list">
            <li className="transaction-item transaction-header">
              <div>Source</div>
              <div>Destination</div>
              <div>Customer Id</div>
              <div>Fare</div>
              <div>Commission</div>
            </li>
            {data.map((ride) => (
              <li className="transaction-item" key={ride.rideid}>
                <div className="transaction-details">
                  <div>{ride.source}</div>
                  <div>{ride.destination}</div>
                  <div>{ride.customerid}</div>
                  <div>{ride.fare}</div>
                  <div>{ride.commission}</div>
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
