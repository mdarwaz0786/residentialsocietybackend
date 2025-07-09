/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth.context";
import Input from "../../components/Input/Input";
import useCreate from "../../hooks/useCreate";
import { toast } from 'react-toastify';

const Login = () => {
  const { storeToken } = useAuth();
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const { postData, response, isPosting, postError } = useCreate("/api/v1/auth/login-user");

  const [form, setForm] = useState({
    mobile: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.mobile) newErrors.mobile = "Mobile number is required.";
    if (!form.password) newErrors.password = "Password is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    await postData(form);
    toast.success("Login Succcessful");
    if (postError) {
      toast.success(postError);
    };
  };

  useEffect(() => {
    if (response?.token) {
      storeToken(response.token);
      navigate("/");
    };
  }, [response]);

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="card p-4 shadow-lg" style={{ maxWidth: "400px", width: "100%" }}>
        <h4 className="mb-3 text-center text-primary">Login</h4>

        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="row">
            <Input
              label="Mobile Number"
              name="mobile"
              type="text"
              value={form.mobile}
              onChange={handleChange}
              required
              error={errors.mobile}
              width="col-md-12"
            />
            <Input
              label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
              error={errors.password}
              width="col-md-12"
            />
          </div>

          {postError && (
            <div className="alert alert-danger mt-3">
              {postError?.response?.data?.message || "Login failed. Please try again."}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary w-100 mt-3"
            disabled={isPosting}
          >
            {isPosting ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
