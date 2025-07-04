import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
  const navigation = useNavigate();
  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    showLatest: "",
  });

  const [variants, setVariants] = useState([
    {
      color: "",
      images: [],
      imagePreviews: [],
      sizes: [{ size: "", stock: "" }],
    },
  ]);

  const categories = ["Electronics", "Clothing", "Shoes", "Books", "Toys"];
  const sizeOptions = ["XS", "S", "M", "L", "XL", "XXL"];
  const showLatestOptions = ["yes", "no"];
  const colorOptions = [
    { label: "Black", value: "#000000" },
    { label: "White", value: "#FFFFFF" },
    { label: "Red", value: "#FF0000" },
    { label: "Blue", value: "#0000FF" },
    { label: "Green", value: "#00FF00" },
    { label: "Yellow", value: "#FFFF00" },
  ];

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleVariantChange = (index, field, value) => {
    const updated = [...variants];
    updated[index][field] = value;
    setVariants(updated);
  };

  const handleImageUpload = (index, files) => {
    const updated = [...variants];
    const newFiles = Array.from(files);
    updated[index].images = [...updated[index].images, ...newFiles];
    updated[index].imagePreviews = [
      ...updated[index].imagePreviews,
      ...newFiles.map((file) => URL.createObjectURL(file)),
    ];
    setVariants(updated);
  };

  const removeImage = (variantIndex, imageIndex) => {
    const updated = [...variants];
    updated[variantIndex].images.splice(imageIndex, 1);
    updated[variantIndex].imagePreviews.splice(imageIndex, 1);
    setVariants(updated);
  };

  const handleSizeChange = (variantIndex, sizeIndex, field, value) => {
    const updated = [...variants];
    updated[variantIndex].sizes[sizeIndex][field] = value;
    setVariants(updated);
  };

  const addVariant = () => {
    setVariants([
      ...variants,
      {
        color: "",
        images: [],
        imagePreviews: [],
        sizes: [{ size: "", stock: "" }],
      },
    ]);
  };

  const removeVariant = (index) => {
    const updated = variants.filter((_, i) => i !== index);
    setVariants(updated);
  };

  const addSize = (variantIndex) => {
    const updated = [...variants];
    updated[variantIndex].sizes.push({ size: "", stock: "" });
    setVariants(updated);
  };

  const removeSize = (variantIndex, sizeIndex) => {
    const updated = [...variants];
    updated[variantIndex].sizes = updated[variantIndex].sizes.filter(
      (_, i) => i !== sizeIndex
    );
    setVariants(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted", form, variants);
  };

  return (
    <div className="container">
      <div className="d-flex justify-content-between mb-4">
        <h5 className="text-center">Add Product</h5>
        <button className="btn btn-light text-dark border" onClick={() => navigation(-1)}>← Back</button>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Product Name <span style={{ color: 'red' }}>*</span></label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleFormChange}
              className="form-control"
              required
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Price (₹) <span style={{ color: 'red' }}>*</span></label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleFormChange}
              className="form-control"
              required
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Category <span style={{ color: 'red' }}>*</span></label>
            <select
              name="category"
              value={form.category}
              onChange={handleFormChange}
              className="form-select"
              required
            >
              <option value="">-- Select Category --</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-6">
            <label className="form-label">Show in Latest <span style={{ color: 'red' }}>*</span></label>
            <select
              name="showLatest"
              value={form.showLatest}
              onChange={handleFormChange}
              className="form-select"
              required
            >
              <option value="">-- Select Option --</option>
              {showLatestOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt === "yes" ? "Yes" : "No"}
                </option>
              ))}
            </select>
          </div>

          <div className="col-12">
            <label className="form-label">Product Description <span style={{ color: 'red' }}>*</span></label>
            <textarea
              name="description"
              rows="5"
              value={form.description}
              onChange={handleFormChange}
              className="form-control"
              required
            />
          </div>
        </div>

        {/* Product Variants */}
        <div className="mt-5">
          <h6 className="fw-bold">Product Variants</h6>
          {variants.map((variant, index) => (
            <div key={index} className="border rounded p-3 mb-4">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <strong>Variant {index + 1}</strong>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => removeVariant(index)}
                >
                  Remove Variant
                </button>
              </div>

              <div className="mb-3">
                <label className="form-label">Color <span style={{ color: 'red' }}>*</span></label>
                <select
                  className="form-select"
                  value={variant.color}
                  onChange={(e) => handleVariantChange(index, "color", e.target.value)}
                  required
                >
                  <option value="">-- Select Color --</option>
                  {colorOptions.map((color) => (
                    <option key={color.value} value={color.value}>
                      {color.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Upload Images <span style={{ color: 'red' }}>*</span></label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleImageUpload(index, e.target.files)}
                  className="form-control"
                />
                <div className="d-flex flex-wrap gap-2 mt-2">
                  {variant.imagePreviews.map((src, i) => (
                    <div key={i} className="position-relative">
                      <img
                        src={src}
                        alt="preview"
                        width={80}
                        height={80}
                        className="rounded border"
                      />
                      <button
                        type="button"
                        className="btn btn-sm btn-danger position-absolute top-0 end-0"
                        onClick={() => removeImage(index, i)}
                        style={{
                          borderRadius: "50%",
                          padding: "0 6px",
                          fontSize: "0.8rem",
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Sizes & Stock <span style={{ color: 'red' }}>*</span></label>
                {variant.sizes.map((size, sizeIndex) => (
                  <div
                    className="d-flex align-items-center gap-2 mb-2"
                    key={sizeIndex}
                  >
                    <select
                      className="form-select"
                      value={size.size}
                      onChange={(e) =>
                        handleSizeChange(index, sizeIndex, "size", e.target.value)
                      }
                      required
                    >
                      <option value="">Select Size</option>
                      {sizeOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>

                    <input
                      type="number"
                      placeholder="Stock"
                      value={size.stock}
                      onChange={(e) =>
                        handleSizeChange(index, sizeIndex, "stock", e.target.value)
                      }
                      className="form-control"
                      required
                    />

                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => removeSize(index, sizeIndex)}
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="btn btn-outline-primary btn-sm"
                  onClick={() => addSize(index)}
                >
                  + Add Size
                </button>
              </div>
            </div>
          ))}

          <button type="button" className="btn btn-success" onClick={addVariant}>
            + Add Variant
          </button>
        </div>

        {/* Submit */}
        <div className="text-end mt-4">
          <button type="submit" className="btn btn-primary px-3 py-2">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
