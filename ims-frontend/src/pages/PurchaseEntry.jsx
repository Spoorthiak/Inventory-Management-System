
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const API_BASE_URL = "https://ims-main-service.onrender.com";

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
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(true);
  const [typeLoading, setTypeLoading] = useState(false);

  // Fetch vendors and categories
  useEffect(() => {
    const fetchDropdownData = async () => {
      setLoading(true);
      setApiError("");

      const [vendorResult, categoryResult] =
        await Promise.allSettled([
          fetch(`${API_BASE_URL}/vendors`),
          fetch(`${API_BASE_URL}/categories`)
        ]);

      let hasError = false;

      try {
        if (vendorResult.status === "fulfilled") {
          const response = vendorResult.value;

          if (!response.ok) {
            throw new Error(`Vendor API error: ${response.status}`);
          }

          const data = await response.json();

          if (!Array.isArray(data)) {
            throw new Error("Invalid vendor response");
          }

          setVendors(data);
        } else {
          throw vendorResult.reason;
        }
      } catch (error) {
        console.error("Vendor loading error:", error);
        setVendors([]);
        hasError = true;
      }

      try {
        if (categoryResult.status === "fulfilled") {
          const response = categoryResult.value;

          if (!response.ok) {
            throw new Error(`Category API error: ${response.status}`);
          }

          const data = await response.json();

          if (!Array.isArray(data)) {
            throw new Error("Invalid category response");
          }

          setCategories(data);
        } else {
          throw categoryResult.reason;
        }
      } catch (error) {
        console.error("Category loading error:", error);
        setCategories([]);
        hasError = true;
      }

      if (hasError) {
        setApiError(
          "Some dropdown data could not be loaded. Please refresh and try again."
        );
      }

      setLoading(false);
    };

    fetchDropdownData();
  }, []);

  // Fetch material types and units
  useEffect(() => {
    if (!category) {
      setMaterialTypes([]);
      setUnits([]);
      setMaterialType("");
      setUnit("");
      return;
    }

    const fetchTypeAndUnit = async () => {
      setTypeLoading(true);
      setMaterialType("");
      setUnit("");
      setMaterialTypes([]);
      setUnits([]);

      try {
        const response = await fetch(
          `${API_BASE_URL}/getUnitAndTypeList`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              materialCategoryId: category
            })
          }
        );

        if (!response.ok) {
          throw new Error(
            `Material API error: ${response.status}`
          );
        }

        const data = await response.json();

        if (
          !Array.isArray(data.materialTypeList) ||
          !Array.isArray(data.unitList)
        ) {
          throw new Error("Invalid material type or unit response");
        }

        setMaterialTypes(data.materialTypeList);
        setUnits(data.unitList);

      } catch (error) {
        console.error("Error fetching type and unit:", error);

        setMaterialTypes([]);
        setUnits([]);

        setApiError(
          "Unable to load material types and units. Please try again."
        );
      } finally {
        setTypeLoading(false);
      }
    };

    fetchTypeAndUnit();
  }, [category]);

  // Reset form
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
    setApiError("");
  };

  // Submit purchase
  const handleSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = {};

    if (!vendor) {
      nextErrors.vendor = "Please select a vendor.";
    }

    if (!category) {
      nextErrors.category = "Please select a material category.";
    }

    if (!materialType) {
      nextErrors.materialType = "Please select a material type.";
    }

    if (!unit) {
      nextErrors.unit = "Please select a unit.";
    }

    if (!brandName.trim()) {
      nextErrors.brandName = "Brand name is required.";
    }

    if (!quantity) {
      nextErrors.quantity = "Quantity is required.";
    } else if (!/^\d+$/.test(quantity)) {
      nextErrors.quantity = "Enter a whole number.";
    }

    if (!purchaseAmount) {
      nextErrors.purchaseAmount = "Purchase amount is required.";
    } else if (!/^\d+(\.\d{1,2})?$/.test(purchaseAmount)) {
      nextErrors.purchaseAmount =
        "Enter a valid amount (up to 2 decimals).";
    }

    if (!purchaseDate) {
      nextErrors.purchaseDate = "Purchase date is required.";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    const purchaseData = {
      vendorName: vendor,
      materialCategoryId: category,
      materialTypeId: materialType,
      unitId: unit,
      brandName,
      quantity: Number(quantity),
      purchaseAmount: Number(purchaseAmount),
      purchaseDate
    };

    try {
      const response = await fetch(
        `${API_BASE_URL}/addPurchaseDetail`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(purchaseData)
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to save purchase: ${response.status}`
        );
      }

      const data = await response.json();

      if (!data.purchase?.transactionId) {
        throw new Error("Invalid purchase response");
      }

      navigate("/purchase-success", {
        state: {
          transactionId: data.purchase.transactionId
        }
      });

    } catch (error) {
      console.error("Error saving purchase entry:", error);
      alert("Failed to save Purchase Entry. Please try again.");
    }
  };

  // Reusable form field
  const field = (id, label, control, error) => (
    <div className="field-group">
      <label htmlFor={id}>
        {label}
        <span className="required-mark"> *</span>
      </label>

      {control}

      {error && (
        <small className="field-error">{error}</small>
      )}
    </div>
  );

  return (
    <div className="app-shell">
      <Navbar />

      <main className="content-wrap narrow-content">

        <div className="page-heading">
          <div>
            <p className="eyebrow">PURCHASE MANAGEMENT</p>
            <h1>Purchase entry</h1>
            <p className="muted">
              Add a new material purchase transaction.
            </p>
          </div>

          <span className="heading-icon">＋</span>
        </div>

        <section className="surface-card">

          <div className="card-heading">
            <div>
              <h2>Purchase details</h2>
              <p className="muted">
                Complete the information below to save a purchase.
              </p>
            </div>

            <span className="required-note">
              * Required fields
            </span>
          </div>

          {loading && (
            <p className="muted">Loading purchase details...</p>
          )}

          {apiError && (
            <p className="field-error" role="alert">
              {apiError}
            </p>
          )}

          <form onSubmit={handleSubmit}>

            <div className="form-grid">

              {field(
                "vendor",
                "Vendor name",
                <select
                  id="vendor"
                  value={vendor}
                  onChange={(e) => setVendor(e.target.value)}
                  disabled={loading}
                >
                  <option value="">Select vendor</option>

                  {vendors.map((v) => (
                    <option key={v.vendorId} value={v.vendorName}>
                      {v.vendorName}
                    </option>
                  ))}
                </select>,
                errors.vendor
              )}

              {field(
                "category",
                "Material category",
                <select
                  id="category"
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    setApiError("");
                  }}
                  disabled={loading}
                >
                  <option value="">Select category</option>

                  {categories.map((item) => (
                    <option
                      key={item.categoryId}
                      value={item.categoryId}
                    >
                      {item.categoryName}
                    </option>
                  ))}
                </select>,
                errors.category
              )}

              {field(
                "materialType",
                "Material type",
                <select
                  id="materialType"
                  value={materialType}
                  onChange={(e) => setMaterialType(e.target.value)}
                  disabled={!category || typeLoading}
                >
                  <option value="">
                    {typeLoading ? "Loading types..." : "Select material type"}
                  </option>

                  {materialTypes.map((item) => (
                    <option key={item.typeId} value={item.typeId}>
                      {item.typeName}
                    </option>
                  ))}
                </select>,
                errors.materialType
              )}

              {field(
                "unit",
                "Unit",
                <select
                  id="unit"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  disabled={!category || typeLoading}
                >
                  <option value="">
                    {typeLoading ? "Loading units..." : "Select unit"}
                  </option>

                  {units.map((item) => (
                    <option key={item.unitId} value={item.unitId}>
                      {item.unitName}
                    </option>
                  ))}
                </select>,
                errors.unit
              )}

              {field(
                "brandName",
                "Brand name",
                <input
                  id="brandName"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  placeholder="Enter brand name"
                />,
                errors.brandName
              )}

              {field(
                "quantity",
                "Quantity",
                <input
                  id="quantity"
                  inputMode="numeric"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="Enter quantity"
                />,
                errors.quantity
              )}

              {field(
                "purchaseAmount",
                "Purchase amount (₹)",
                <input
                  id="purchaseAmount"
                  inputMode="decimal"
                  value={purchaseAmount}
                  onChange={(e) => setPurchaseAmount(e.target.value)}
                  placeholder="Enter amount"
                />,
                errors.purchaseAmount
              )}

              {field(
                "purchaseDate",
                "Purchase date",
                <input
                  id="purchaseDate"
                  type="date"
                  value={purchaseDate}
                  onChange={(e) => setPurchaseDate(e.target.value)}
                />,
                errors.purchaseDate
              )}

            </div>

            <div className="form-actions">
              <button
                type="button"
                className="secondary-button"
                onClick={resetForm}
              >
                Reset
              </button>

              <button
                type="submit"
                className="primary-button"
              >
                Save purchase <span>→</span>
              </button>
            </div>

          </form>
        </section>
      </main>
    </div>
  );
}
