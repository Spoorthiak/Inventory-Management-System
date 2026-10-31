
import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

function Report() {
  const [vendors, setVendors] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reportData, setReportData] = useState([]);

  useEffect(() => {
    // fetch("http://localhost:8081/inventory/vendors")
    fetch("http://localhost:8086/vendors")
      .then((response) => response.json())
      .then((data) => {
        console.log("Vendors:", data);
        setVendors(data);
      })
      .catch((error) => {
        console.error("Error fetching vendors:", error);
      });
  }, []);

  const handleSearch = async () => {
    if (!selectedVendor) {
      alert("Please select a vendor");
      return;
    }

    if (!fromDate || !toDate) {
      alert("Please select From Date and To Date");
      return;
    }

    if (fromDate > toDate) {
      alert("From Date cannot be greater than To Date");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:8086/report/controller/getPurchaseDetails",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            vendorName: selectedVendor.vendorName,
            fromDate: fromDate,
            toDate: toDate,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch report");
      }

      const data = await response.json();

      console.log("Report Data:", data);

      setReportData(data);
    } catch (error) {
      console.error("Error fetching report:", error);
      alert("Failed to load report");
    }
  };

  const formatDate = (date) => {
    if (!date) {
      return "";
    }

    const parts = date.split("-");

    if (parts.length !== 3) {
      return date;
    }

    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#eef2f6",
        padding: "30px",
        boxSizing: "border-box",
      }}
    >
      <Navbar />

      <div
        style={{
          maxWidth: "1250px",
          margin: "0 auto",
          backgroundColor: "#ffffff",
          padding: "30px",
          borderRadius: "8px",
          border: "1px solid #d9dee5",
          boxShadow: "0 3px 12px rgba(0,0,0,0.10)",
          boxSizing: "border-box",
        }}
      >
        {/* Page Title */}
        <h1
          style={{
            textAlign: "center",
            marginBottom: "35px",
            fontSize: "36px",
            color: "#26384a",
          }}
        >
          Vendor Purchase Report
        </h1>

        {/* Search Section */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            flexWrap: "wrap",
            marginBottom: "30px",
            padding: "18px",
            backgroundColor: "#f5f7f9",
            border: "1px solid #dfe4e9",
            borderRadius: "6px",
          }}
        >
          {/* Vendor */}
          <label
            style={{
              color: "#394957",
              fontWeight: "600",
            }}
          >
            Vendor Name
          </label>

          <select
            value={selectedVendor ? selectedVendor.vendorName : ""}
            onChange={(e) => {
              const vendor = vendors.find(
                (item) => item.vendorName === e.target.value
              );

              setSelectedVendor(vendor || null);
              setReportData([]);
            }}
            style={inputStyle}
          >
            <option value="">Select Vendor</option>

            {vendors.map((vendorItem) => (
              <option
                key={vendorItem.vendorId}
                value={vendorItem.vendorName}
              >
                {vendorItem.vendorName}
              </option>
            ))}
          </select>

          {/* From Date */}
          <label
            style={{
              color: "#394957",
              fontWeight: "600",
            }}
          >
            From Date
          </label>

          <input
            type="date"
            value={fromDate}
            onChange={(e) => {
              setFromDate(e.target.value);
              setReportData([]);
            }}
            style={dateStyle}
          />

          {/* To Date */}
          <label
            style={{
              color: "#394957",
              fontWeight: "600",
            }}
          >
            To Date
          </label>

          <input
            type="date"
            value={toDate}
            onChange={(e) => {
              setToDate(e.target.value);
              setReportData([]);
            }}
            style={dateStyle}
          />

          {/* Search */}
          <button
            type="button"
            onClick={handleSearch}
            style={buttonStyle}
          >
            Search
          </button>
        </div>

        {/* Vendor Details */}
        {selectedVendor && (
          <div
            style={{
              textAlign: "center",
              marginBottom: "30px",
              padding: "15px",
              fontSize: "16px",
              lineHeight: "1.8",
              backgroundColor: "#f8fafb",
              border: "1px solid #e0e5e9",
              borderRadius: "6px",
            }}
          >
            <p style={{ margin: "4px", color: "#536474" }}>
              <strong style={{ color: "#394957" }}>Address:</strong>{" "}
              {selectedVendor.vendorAddress}
            </p>

            <p style={{ margin: "4px", color: "#536474" }}>
              <strong style={{ color: "#394957" }}>
                Contact Number:
              </strong>{" "}
              {selectedVendor.contactNumber}
            </p>

            <p style={{ margin: "4px", color: "#536474" }}>
              <strong style={{ color: "#394957" }}>
                Contact Person:
              </strong>{" "}
              {selectedVendor.contactPerson}
            </p>
          </div>
        )}

        {/* Report Table */}
        {reportData.length > 0 && (
          <div
            style={{
              overflowX: "auto",
              marginTop: "20px",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                textAlign: "center",
              }}
            >
              <thead>
                <tr>
                  <th style={tableHeaderStyle}>
                    Material Category
                  </th>

                  <th style={tableHeaderStyle}>
                    Material Type
                  </th>

                  <th style={tableHeaderStyle}>
                    Brand
                  </th>

                  <th style={tableHeaderStyle}>
                    Quantity
                  </th>

                  <th style={tableHeaderStyle}>
                    Unit
                  </th>

                  <th style={tableHeaderStyle}>
                    Price
                  </th>

                  <th style={tableHeaderStyle}>
                    Balance
                  </th>

                  <th style={tableHeaderStyle}>
                    Purchase Date
                  </th>
                </tr>
              </thead>

              <tbody>
                {reportData.map((purchase) => (
                  <tr key={purchase.purchaseId}>
                    <td style={tableCellStyle}>
                      {purchase.materialCategoryName}
                    </td>

                    <td style={tableCellStyle}>
                      {purchase.materialTypeName}
                    </td>

                    <td style={tableCellStyle}>
                      {purchase.brandName}
                    </td>

                    <td style={tableCellStyle}>
                      {purchase.quantity}
                    </td>

                    <td style={tableCellStyle}>
                      {purchase.materialUnitName}
                    </td>

                    <td style={tableCellStyle}>
                      {Number(purchase.purchaseAmount).toFixed(2)}
                    </td>

                    <td style={tableCellStyle}>
                      {Number(purchase.balance).toFixed(2)}
                    </td>

                    <td style={tableCellStyle}>
                      {formatDate(purchase.purchaseDate)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* No Records */}
        {selectedVendor &&
          fromDate &&
          toDate &&
          reportData.length === 0 && (
            <p
              style={{
                textAlign: "center",
                marginTop: "30px",
                fontSize: "18px",
                color: "#536474",
              }}
            >
              No purchase records found for the selected vendor and date range.
            </p>
          )}
      </div>
    </div>
  );
}

/* Input styling */
const inputStyle = {
  padding: "10px",
  fontSize: "15px",
  border: "1px solid #b8c1ca",
  borderRadius: "5px",
  backgroundColor: "#ffffff",
  color: "#333333",
};

/* Date styling */
const dateStyle = {
  padding: "9px",
  fontSize: "15px",
  border: "1px solid #b8c1ca",
  borderRadius: "5px",
  backgroundColor: "#ffffff",
  color: "#333333",
};

/* Search button styling */
const buttonStyle = {
  padding: "10px 22px",
  fontSize: "15px",
  fontWeight: "600",
  cursor: "pointer",
  borderRadius: "5px",
  border: "1px solid #536b82",
  backgroundColor: "#536b82",
  color: "#ffffff",
};

/* Table styling */
const tableHeaderStyle = {
  border: "1px solid #c9d0d6",
  padding: "12px 8px",
  backgroundColor: "#e8edf2",
  color: "#26384a",
  fontWeight: "bold",
};

const tableCellStyle = {
  border: "1px solid #d5dbe0",
  padding: "12px 8px",
  color: "#394957",
};

export default Report;