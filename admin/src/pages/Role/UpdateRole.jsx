import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const permissionTypes = [
  "flat", "vehicle", "visitor", "maid", "tenant",
  "flatOwner", "securityGuard", "maintenanceStaff",
  "payment", "complaint", "event", "notification"
];

const UpdateRole = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    roleName: "",
    permissions: {}
  });

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const { data } = await axios.get(`/api/v1/role/get-single-role/${id}`);
        setFormData(data?.data);
        setLoading(false);
      } catch (error) {
        console.error(error.message);
        setLoading(false);
      };
    };

    fetchRole();
  }, [id]);

  const handleCheckboxChange = (resource, action) => {
    setFormData((prev) => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [resource]: {
          ...prev.permissions[resource],
          [action]: !prev.permissions?.[resource]?.[action],
        },
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/v1/role/update-role/${id}`, formData);
      toast.success("Role updated successfully");
      navigate("/role");
    } catch (error) {
      toast.error("Role updated successfully");
      console.error(error.message)
    };
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="container mt-2 mb-2">
      <h5 style={{ textAlign: "center" }}>Update Role</h5>
      <form onSubmit={handleSubmit} className="mt-2">
        <div className="mb-3">
          <h6>Role</h6>
          <input
            type="text"
            className="form-control"
            value={formData.roleName}
          />
        </div>

        <h6>Permissions</h6>
        {permissionTypes.map((resource) => (
          <div key={resource} className="mb-3 border p-2 rounded">
            <strong className="text-capitalize">{resource}</strong>
            <div className="form-check form-check-inline ms-2">
              <input
                type="checkbox"
                className="form-check-input"
                checked={formData.permissions?.[resource]?.create || false}
                onChange={() => handleCheckboxChange(resource, "create")}
              />
              <label className="form-check-label">Create</label>
            </div>
            <div className="form-check form-check-inline">
              <input
                type="checkbox"
                className="form-check-input"
                checked={formData.permissions?.[resource]?.read || false}
                onChange={() => handleCheckboxChange(resource, "read")}
              />
              <label className="form-check-label">Read</label>
            </div>
            <div className="form-check form-check-inline">
              <input
                type="checkbox"
                className="form-check-input"
                checked={formData.permissions?.[resource]?.update || false}
                onChange={() => handleCheckboxChange(resource, "update")}
              />
              <label className="form-check-label">Update</label>
            </div>
            <div className="form-check form-check-inline">
              <input
                type="checkbox"
                className="form-check-input"
                checked={formData.permissions?.[resource]?.delete || false}
                onChange={() => handleCheckboxChange(resource, "delete")}
              />
              <label className="form-check-label">Delete</label>
            </div>
          </div>
        ))}

        <button type="submit" className="btn btn-primary">Update Role</button>
      </form>
    </div>
  );
};

export default UpdateRole;
