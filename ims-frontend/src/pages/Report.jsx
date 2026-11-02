import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

export default function Report() {
  const [vendors, setVendors] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reportData, setReportData] = useState([]);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    fetch("http://localhost:8086/vendors").then((response) => response.json()).then(setVendors)
      .catch((error) => console.error("Error fetching vendors:", error));
  }, []);

  const handleSearch = async () => {
    if (!selectedVendor) { alert("Please select a vendor"); return; }
    if (!fromDate || !toDate) { alert("Please select From Date and To Date"); return; }
    if (fromDate > toDate) { alert("From Date cannot be greater than To Date"); return; }
    try {
      const response = await fetch("http://localhost:8086/report/controller/getPurchaseDetails", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vendorName: selectedVendor.vendorName, fromDate, toDate }),
      });
      if (!response.ok) throw new Error("Failed to fetch report");
      setReportData(await response.json());
      setSearched(true);
    } catch (error) {
      console.error("Error fetching report:", error);
      alert("Failed to load report");
    }
  };

  const formatDate = (date) => {
    if (!date) return "";
    const parts = date.split("-");
    return parts.length === 3 ? `${parts[2]}-${parts[1]}-${parts[0]}` : date;
  };
  const totalAmount = reportData.reduce((sum, item) => sum + (Number(item.purchaseAmount) || 0), 0);

  return (
    <div className="app-shell">
      <Navbar />
      <main className="content-wrap">
        <div className="page-heading">
          <div><p className="eyebrow">ANALYTICS & RECORDS</p><h1>Vendor purchase report</h1><p className="muted">Review purchase details by vendor and date range.</p></div>
          <span className="heading-icon">▤</span>
        </div>
        <section className="surface-card report-filter-card">
          <div className="card-heading"><div><h2>Report filters</h2><p className="muted">Choose a vendor and reporting period.</p></div></div>
          <div className="filter-grid">
            <div className="field-group"><label htmlFor="reportVendor">Vendor name <span className="required-mark">*</span></label><select id="reportVendor" value={selectedVendor?.vendorName || ""} onChange={(e) => { const found = vendors.find((v) => v.vendorName === e.target.value); setSelectedVendor(found || null); setReportData([]); setSearched(false); }}><option value="">Select vendor</option>{vendors.map((v) => <option key={v.vendorId} value={v.vendorName}>{v.vendorName}</option>)}</select></div>
            <div className="field-group"><label htmlFor="fromDate">From date <span className="required-mark">*</span></label><input id="fromDate" type="date" value={fromDate} onChange={(e) => { setFromDate(e.target.value); setSearched(false); }} /></div>
            <div className="field-group"><label htmlFor="toDate">To date <span className="required-mark">*</span></label><input id="toDate" type="date" value={toDate} onChange={(e) => { setToDate(e.target.value); setSearched(false); }} /></div>
            <button type="button" className="primary-button filter-button" onClick={handleSearch}>Generate report <span>→</span></button>
          </div>
        </section>

        {selectedVendor && (
          <section className="vendor-info-card">
            <div className="vendor-avatar">♧</div>
            <div><strong>{selectedVendor.vendorName}</strong><p>{selectedVendor.vendorAddress || "Vendor address not available"}</p></div>
            <div className="vendor-meta"><small>CONTACT PERSON</small><strong>{selectedVendor.contactPerson || "—"}</strong></div>
            <div className="vendor-meta"><small>CONTACT NUMBER</small><strong>{selectedVendor.contactNumber || "—"}</strong></div>
          </section>
        )}

        {reportData.length > 0 && (
          <section className="surface-card report-results">
            <div className="card-heading report-results-heading"><div><h2>Purchase transactions</h2><p className="muted">{reportData.length} record(s) found for the selected period.</p></div><div className="total-pill"><small>Total purchase amount</small><strong>₹{totalAmount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></div></div>
            <div className="table-scroll"><table className="data-table"><thead><tr><th>Material category</th><th>Material type</th><th>Brand</th><th>Quantity</th><th>Unit</th><th>Price (₹)</th><th>Balance (₹)</th><th>Purchase date</th></tr></thead><tbody>{reportData.map((purchase) => <tr key={purchase.purchaseId}><td>{purchase.materialCategoryName}</td><td>{purchase.materialTypeName}</td><td>{purchase.brandName}</td><td>{purchase.quantity}</td><td>{purchase.materialUnitName}</td><td>{Number(purchase.purchaseAmount).toFixed(2)}</td><td>{Number(purchase.balance).toFixed(2)}</td><td>{formatDate(purchase.purchaseDate)}</td></tr>)}</tbody></table></div>
          </section>
        )}
        {searched && reportData.length === 0 && <section className="empty-state"><span>▤</span><h3>No purchase records found</h3><p>Try another vendor or date range.</p></section>}
      </main>
    </div>
  );
}
