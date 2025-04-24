import React, { useEffect } from "react";
import { usePenaltysummaryMutation } from "./apislice"; // Import RTK API slice
import "./CustomerSummary.css";

const CustomerSummary = ({ user, onClose }) => {
  const [penaltysummary, { data, error, isLoading }] = usePenaltysummaryMutation();

  useEffect(() => {
      penaltysummary({
        cabusername: user.username,
        cabpassword: user.password // Ensure field matches backend
      });
  }, [user, penaltysummary]);

  const totals = data?.reduce(
    (acc, penalty) => {
      acc.penalty += penalty.penalty;
      return acc;
    },
    { penalty: 0 }
  ) || { penalty: 0};

  return (
    <div className="activity-container">
      <h2>Customer Penalty History</h2>
      {isLoading && <p>Loading...</p>}
      {error && <p className="error">Error: {error.message}</p>}
      {data?.length > 0 ? (
        <div className="transaction-list-container">
          <p><strong>Customer Id: </strong> {user.userid}</p>
          <p><strong>Total Penalty: </strong>{totals.penalty}</p>
          <ul className="transaction-list">
            <li className="transaction-item transaction-header">
              <div>Penalty</div>
              <div>Date</div>
            </li>
            {data.map((penalty) => (
              <li className="transaction-item" key={penalty.penaltyid}>
                <div className="transaction-details">
                  <div>{penalty.penalty}</div>
                  <div>{penalty.date}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        !isLoading && <p>No Penalty</p>
      )}
      
      <button className="close-btn" onClick={onClose}>Close</button>
    </div>
  );
};

export default CustomerSummary;
