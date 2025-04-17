import React, { useEffect } from "react";
import { useGetallcabsummaryMutation } from "./apislice";
import "./GetAllCabSummary.css";

const GetAllCabSummary = ({ user, onClose }) => {
  const [triggerCabSummary, { data = {}, error, isLoading }] = useGetallcabsummaryMutation();

  useEffect(() => {
    triggerCabSummary({
      adminusername: user.username,
      adminpassword: user.password
    });
  }, [user, triggerCabSummary]);

  const { totalcabsummary = [], cabsummary = [] } = data || {};

  return (
    <div className="activity-container">
      <h2>Cab Summary & Ride History</h2>

      {isLoading && <p>Loading...</p>}
      {error && <p className="error">Error: {error.message}</p>}

      {totalcabsummary.length > 0 ? (
        <div className="transaction-list-container">
          {totalcabsummary.map((summary, index) => (
            <div key={summary.userid} className="cab-summary-section">
              <div className="summary-header">
                <p><strong>Cab ID:</strong> {summary.userid}</p>
                <p><strong>No. of Trips:</strong> {summary.trips}</p>
                <p><strong>Total Fare Collected:</strong> ₹{summary.fare}</p>
                <p><strong>Total Commission:</strong> ₹{summary.commission}</p>
              </div>

              <h4>Trip Details:</h4>
              <ul className="transaction-list">
                <li className="transaction-item transaction-header">
                  <div>Source</div>
                  <div>Destination</div>
                  <div>Customer Id</div>
                  <div>Fare</div>
                  <div>Commission</div>
                </li>
                {Array.isArray(cabsummary[index]) &&
                  cabsummary[index].map((ride, i) => (
                    <li className="transaction-item" key={i}>
                      <div className="transaction-details">
                        <div>{ride.source}</div>
                        <div>{ride.destination}</div>
                        <div>{ride.customerid}</div>
                        <div>₹{ride.fare}</div>
                        <div>₹{ride.commission}</div>
                      </div>
                    </li>
                  ))}
              </ul>
              <hr />
            </div>
          ))}
        </div>
      ) : (
        !isLoading && <p>No Cab Summaries Found</p>
      )}

      <button className="close-btn" onClick={onClose}>Close</button>
    </div>
  );
};

export default GetAllCabSummary;
