import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function PurchaseEntry() {
  const navigate = useNavigate();
  const [vendor, setVendor] = useState("");
  const [category, setCategory] = useState("");
  const [materialType, setMaterialType] = useState("");
  const [unit, setUnit] = useState("");
  const [brandName, setBrandName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [purchaseAmount, setPurchaseAmount] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [vendors, setVendors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [materialTypes, setMaterialTypes] = useState([]);
  const [units, setUnits] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
  fetch("https://ims-main-service.onrender.com/vendors")
    .then((r) => r.json())
    .then(setVendors)
    .catch((error) => console.error("Error fetching vendors:", error));

  fetch("https://ims-main-service.onrender.com/categories")
    .then((r) => r.json())
    .then(setCategories)
    .catch((error) => console.error("Error fetching categories:", error));
}, []);

useEffect(() => {
  if (!category) {
    setMaterialTypes([]);
    setUnits([]);
    setMaterialType("");
    setUnit("");
    return;
  }

  fetch("https://ims-main-service.onrender.com/getUnitAndTypeList", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ materialCategoryId: category }),
  })
    .then((r) => r.json())
    .then((data) => {
      setMaterialTypes(data.materialTypeList || []);
      setUnits(data.unitList || []);
    })
    .catch((error) =>
      console.error("Error fetching type and unit:", error)
    );
}, [category]);

const resetForm = () => {
  setVendor("");
  setCategory("");
  setMaterialType("");
  setUnit("");
  setBrandName("");
  setQuantity("");
  setPurchaseAmount("");
  setPurchaseDate("");
  setErrors({});
};

const handleSubmit = async (event) => {
  event.preventDefault();

  const nextErrors = {};

  if (!vendor) nextErrors.vendor = "Please select a vendor.";
  if (!category) nextErrors.category = "Please select a material category.";
  if (!materialType) nextErrors.materialType = "Please select a material type.";
  if (!unit) nextErrors.unit = "Please select a unit.";
  if (!brandName.trim()) nextErrors.brandName = "Brand name is required.";

  if (!quantity) nextErrors.quantity = "Quantity is required.";
  else if (!/^\d+$/.test(quantity))
    nextErrors.quantity = "Enter a whole number.";

  if (!purchaseAmount)
    nextErrors.purchaseAmount = "Purchase amount is required.";
  else if (!/^\d+(\.\d{1,2})?$/.test(purchaseAmount))
    nextErrors.purchaseAmount = "Enter a valid amount (up to 2 decimals).";

  if (!purchaseDate)
    nextErrors.purchaseDate = "Purchase date is required.";

  setErrors(nextErrors);

  if (Object.keys(nextErrors).length) return;

  const purchaseData = {
    vendorName: vendor,
    materialCategoryId: category,
    materialTypeId: materialType,
    unitId: unit,
    brandName,
    quantity: Number(quantity),
    purchaseAmount: Number(purchaseAmount),
    purchaseDate,
  };

  try {
    const response = await fetch(
      "https://ims-main-service.onrender.com/addPurchaseDetail",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(purchaseData),
      }
    );

    if (!response.ok) throw new Error("Failed to save purchase entry");

    const data = await response.json();

    navigate("/purchase-success", {
      state: { transactionId: data.purchase.transactionId },
    });
  } catch (error) {
    console.error("Error saving purchase entry:", error);
    alert("Failed to save Purchase Entry");
  }
};
  const field = (id, label, control, error) => (
    <div className="field-group">
      <label htmlFor={id}>{label}<span className="required-mark"> *</span></label>
      {control}
      {error && <small className="field-error">{error}</small>}
    </div>
  );

  return (
    <div className="app-shell">
      <Navbar />
      <main className="content-wrap narrow-content">
        <div className="page-heading">
          <div><p className="eyebrow">PURCHASE MANAGEMENT</p><h1>Purchase entry</h1><p className="muted">Add a new material purchase transaction.</p></div>
          <span className="heading-icon">＋</span>
        </div>
        <section className="surface-card">
          <div className="card-heading"><div><h2>Purchase details</h2><p className="muted">Complete the information below to save a purchase.</p></div><span className="required-note">* Required fields</span></div>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              {field("vendor", "Vendor name", <select id="vendor" value={vendor} onChange={(e) => setVendor(e.target.value)}><option value="">Select vendor</option>{vendors.map((v) => <option key={v.vendorId} value={v.vendorName}>{v.vendorName}</option>)}</select>, errors.vendor)}
              {field("category", "Material category", <select id="category" value={category} onChange={(e) => setCategory(e.target.value)}><option value="">Select category</option>{categories.map((item) => <option key={item.categoryId} value={item.categoryId}>{item.categoryName}</option>)}</select>, errors.category)}
              {field("materialType", "Material type", <select id="materialType" value={materialType} onChange={(e) => setMaterialType(e.target.value)} disabled={!category}><option value="">Select material type</option>{materialTypes.map((item) => <option key={item.typeId} value={item.typeId}>{item.typeName}</option>)}</select>, errors.materialType)}
              {field("unit", "Unit", <select id="unit" value={unit} onChange={(e) => setUnit(e.target.value)} disabled={!category}><option value="">Select unit</option>{units.map((item) => <option key={item.unitId} value={item.unitId}>{item.unitName}</option>)}</select>, errors.unit)}
              {field("brandName", "Brand name", <input id="brandName" value={brandName} onChange={(e) => setBrandName(e.target.value)} placeholder="Enter brand name" />, errors.brandName)}
              {field("quantity", "Quantity", <input id="quantity" inputMode="numeric" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="Enter quantity" />, errors.quantity)}
              {field("purchaseAmount", "Purchase amount (₹)", <input id="purchaseAmount" inputMode="decimal" value={purchaseAmount} onChange={(e) => setPurchaseAmount(e.target.value)} placeholder="Enter amount" />, errors.purchaseAmount)}
              {field("purchaseDate", "Purchase date", <input id="purchaseDate" type="date" value={purchaseDate} onChange={(e) => setPurchaseDate(e.target.value)} />, errors.purchaseDate)}
            </div>
            <div className="form-actions"><button type="button" className="secondary-button" onClick={resetForm}>Reset</button><button type="submit" className="primary-button">Save purchase <span>→</span></button></div>
          </form>
        </section>
      </main>
    </div>
  );
}
