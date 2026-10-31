
import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

function PurchaseEntry() {
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

  useEffect(() => {
  fetch("http://localhost:8086/categories")
      .then((response) => response.json())
      .then((data) => {
        console.log("Categories:", data);
        setCategories(data);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  }, []);

  useEffect(() => {
    if (!category) {
      setMaterialTypes([]);
      setUnits([]);
      return;
    }

    fetch("http://localhost:8086/getUnitAndTypeList", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        materialCategoryId: category,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Type and Unit:", data);

        setMaterialTypes(data.materialTypeList || []);
        setUnits(data.unitList || []);
      })
      .catch((error) => {
        console.error("Error fetching type and unit:", error);
      });
  }, [category]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!vendor) {
      newErrors.vendor = "Vendor name is a required field.";
    }

    if (!category) {
      newErrors.category = "Material category is a required field.";
    }

    if (!materialType) {
      newErrors.materialType = "Material type is a required field.";
    }

    if (!unit) {
      newErrors.unit = "Unit is a required field.";
    }

    if (!brandName.trim()) {
      newErrors.brandName = "Brand name is a required field.";
    }

    if (!quantity) {
      newErrors.quantity = "Quantity is a required field.";
    } else if (!/^\d+$/.test(quantity)) {
      newErrors.quantity = "Please enter only numbers for Quantity.";
    }

    if (!purchaseAmount) {
      newErrors.purchaseAmount =
        "Purchase amount is a required field.";
    } else if (!/^\d+(\.\d{1,2})?$/.test(purchaseAmount)) {
      newErrors.purchaseAmount =
        "Please enter only numbers with two decimal places for Purchase Amount.";
    }

    if (!purchaseDate) {
      newErrors.purchaseDate = "Purchase date is a required field.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    const purchaseData = {
      vendorName: vendor,
      materialCategoryId: category,
      materialTypeId: materialType,
      unitId: unit,
      brandName: brandName,
      quantity: Number(quantity),
      purchaseAmount: Number(purchaseAmount),
      purchaseDate: purchaseDate,
    };

    console.log("Sending Purchase Data:", purchaseData);

    try {
      const response = await fetch(
        "http://localhost:8086/addPurchaseDetail",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(purchaseData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to save purchase entry");
      }

      const data = await response.json();

      console.log("Backend Response:", data);
      console.log("Transaction ID:", data.purchase.transactionId);

      navigate("/purchase-success", {
        state: {
          transactionId: data.purchase.transactionId,
        },
      });
    } catch (error) {
      console.error("Error saving purchase entry:", error);
      alert("Failed to save Purchase Entry");
    }
  };

  return (
    <div className="page-container">
      <Navbar />

      <div className="form-card">
        <h1 className="page-title">Materials Purchased Entry</h1>

        <form onSubmit={handleSubmit}>

          {/* Vendor */}
          <div className="form-row">
            <label>Vendor Name</label>

            <div className="field-container">
              <select
                value={vendor}
                onChange={(e) => setVendor(e.target.value)}
                className="form-control"
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

              {errors.vendor && (
                <span className="error-message">
                  {errors.vendor}
                </span>
              )}
            </div>
          </div>

          {/* Material Category */}
          <div className="form-row">
            <label>Material Category</label>

            <div className="field-container">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="form-control"
              >
                <option value="">Select Material Category</option>

                {categories.map((item) => (
                  <option
                    key={item.categoryId}
                    value={item.categoryId}
                  >
                    {item.categoryName}
                  </option>
                ))}
              </select>

              {errors.category && (
                <span className="error-message">
                  {errors.category}
                </span>
              )}
            </div>
          </div>

          {/* Material Type */}
          <div className="form-row">
            <label>Material Type</label>

            <div className="field-container">
              <select
                value={materialType}
                onChange={(e) => setMaterialType(e.target.value)}
                className="form-control"
              >
                <option value="">Select Material Type</option>

                {materialTypes.map((item) => (
                  <option
                    key={item.typeId}
                    value={item.typeId}
                  >
                    {item.typeName}
                  </option>
                ))}
              </select>

              {errors.materialType && (
                <span className="error-message">
                  {errors.materialType}
                </span>
              )}
            </div>
          </div>

          {/* Unit */}
          <div className="form-row">
            <label>Unit</label>

            <div className="field-container">
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="form-control"
              >
                <option value="">Select Unit</option>

                {units.map((item) => (
                  <option
                    key={item.unitId}
                    value={item.unitId}
                  >
                    {item.unitName}
                  </option>
                ))}
              </select>

              {errors.unit && (
                <span className="error-message">
                  {errors.unit}
                </span>
              )}
            </div>
          </div>

          {/* Brand Name */}
          <div className="form-row">
            <label>Brand Name</label>

            <div className="field-container">
              <input
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                placeholder="Enter brand name"
                className="form-control"
              />

              {errors.brandName && (
                <span className="error-message">
                  {errors.brandName}
                </span>
              )}
            </div>
          </div>

          {/* Quantity */}
          <div className="form-row">
            <label>Quantity</label>

            <div className="field-container">
              <input
                type="text"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Enter quantity"
                className="form-control"
              />

              {errors.quantity && (
                <span className="error-message">
                  {errors.quantity}
                </span>
              )}
            </div>
          </div>

          {/* Purchase Amount */}
          <div className="form-row">
            <label>Purchase Amount</label>

            <div className="field-container">
              <input
                type="text"
                value={purchaseAmount}
                onChange={(e) => setPurchaseAmount(e.target.value)}
                placeholder="Enter purchase amount"
                className="form-control"
              />

              {errors.purchaseAmount && (
                <span className="error-message">
                  {errors.purchaseAmount}
                </span>
              )}
            </div>
          </div>

          {/* Purchase Date */}
          <div className="form-row">
            <label>Purchase Date</label>

            <div className="field-container">
              <input
                type="date"
                value={purchaseDate}
                onChange={(e) => setPurchaseDate(e.target.value)}
                className="form-control"
              />

              {errors.purchaseDate && (
                <span className="error-message">
                  {errors.purchaseDate}
                </span>
              )}
            </div>
          </div>

          {/* Submit */}
          <div className="submit-container">
            <button type="submit" className="submit-button">
              Submit
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default PurchaseEntry;

