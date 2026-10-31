import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function PurchaseSuccess() {
  const location = useLocation();
  const navigate = useNavigate();

  const transactionId = location.state?.transactionId;

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#eef2f6",
      }}
    >
      <Navbar />

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "70px 20px",
        }}
      >
        <div
          style={{
            backgroundColor: "#ffffff",
            padding: "50px",
            borderRadius: "10px",
            border: "1px solid #d9dee5",
            boxShadow: "0 3px 12px rgba(0,0,0,0.10)",
            textAlign: "center",
            width: "500px",
          }}
        >
          <h1
            style={{
              color: "#3f7d4a",
              fontSize: "30px",
              marginBottom: "20px",
            }}
          >
            Purchase Successful!
          </h1>

          <p
            style={{
              color: "#536474",
              fontSize: "17px",
              marginBottom: "25px",
            }}
          >
            Your purchase has been saved successfully.
          </p>

          <p
            style={{
              color: "#394957",
              marginBottom: "8px",
            }}
          >
            <strong>Transaction ID</strong>
          </p>

          <p
            style={{
              color: "#26384a",
              fontSize: "18px",
              fontWeight: "600",
              backgroundColor: "#f5f7f9",
              padding: "12px",
              borderRadius: "5px",
              border: "1px solid #dfe4e9",
              marginBottom: "30px",
            }}
          >
            {transactionId}
          </p>

          <button
            onClick={() => navigate("/purchase-entry")}
            style={{
              padding: "11px 20px",
              marginRight: "10px",
              fontSize: "15px",
              fontWeight: "600",
              color: "#ffffff",
              backgroundColor: "#536b82",
              border: "1px solid #536b82",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Back to Purchase Entry
          </button>

          <button
            onClick={() => navigate("/report")}
            style={{
              padding: "11px 20px",
              fontSize: "15px",
              fontWeight: "600",
              color: "#536b82",
              backgroundColor: "#ffffff",
              border: "1px solid #536b82",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            View Reports
          </button>
        </div>
      </div>
    </div>
  );
}

export default PurchaseSuccess;