import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import FormWrapper from "../../components/form/FormWrapper";
import Input from "../../components/Input/Input";
import SingleImage from "../../components/Input/SingleImage";
import SingleSelect from "../../components/Input/SingleSelect";
import useFetch from "../../hooks/useFetch";
import useUpdate from "../../hooks/useUpdate";
import { useAuth } from "../../context/auth.context";
import { toast } from "react-toastify";
import useFormValidation from "../../hooks/useFormValidation";

const UpdateUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { validToken } = useAuth();
  const { data: rolesData } = useFetch("/api/v1/role/get-all-role", validToken);
  const { data: userData } = useFetch(`/api/v1/user/get-single-user/${id}`, validToken);
  const { updateData, response, updateError } = useUpdate(`/api/v1/user/update-user/${id}`);
  const { errors, setErrors, validate } = useFormValidation();

  const [form, setForm] = useState({
    fullName: "",
    mobile: "",
    email: "",
    password: "",
    memberId: "",
    role: "",
    profilePhoto: null,
  });

  useEffect(() => {
    if (userData?.data) {
      const { fullName, mobile, email, memberId, role, profilePhoto } = userData.data;
      setForm({
        fullName,
        mobile,
        email,
        password: "",
        memberId,
        role: role?._id,
        profilePhoto,
      });
    };
  }, [userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleImageChange = (file) => {
    setForm((prev) => ({ ...prev, profilePhoto: file }));
    setErrors((prev) => ({ ...prev, profilePhoto: "" }));
  };

  const validationRules = {
    fullName: { required: true, label: "Full Name" },
    mobile: { required: true, label: "Mobile" },
    email: { required: true, label: "Email" },
    memberId: { required: true, label: "Member ID" },
    role: { required: true, label: "Role" },
    profilePhoto: { required: true, label: "Profile Photo" },
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate(form, validationRules)) return;

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (key === "password" && !value) return;
      formData.append(key, value);
    });

    await updateData(formData, validToken, true);
  };

  useEffect(() => {
    if (response?.success) {
      toast.success("User updated");
      navigate(-1);
    };
  }, [response, navigate]);

  useEffect(() => {
    if (updateError) {
      toast.error(updateError);
    };
  }, [updateError]);

  return (
    <FormWrapper title="Update User" onSubmit={handleSubmit}>
      <Input
        label="Full Name"
        name="fullName"
        value={form.fullName}
        onChange={handleChange}
        required
        error={errors.fullName}
        width="col-md-6"
      />
      <Input
        label="Mobile"
        name="mobile"
        value={form.mobile}
        onChange={handleChange}
        required
        error={errors.mobile}
        width="col-md-6"
      />
      <Input
        label="Email"
        name="email"
        type="email"
        value={form.email}
        onChange={handleChange}
        required
        error={errors.email}
        width="col-md-6"
      />
      <Input
        label="Password"
        name="password"
        type="password"
        value={form.password}
        onChange={handleChange}
        error={errors.password}
        width="col-md-6"
        placeholder="Leave blank to keep existing"
      />
      <Input
        label="Member ID"
        name="memberId"
        value={form.memberId}
        onChange={handleChange}
        required
        error={errors.memberId}
        width="col-md-6"
      />
      <SingleSelect
        label="Role"
        name="role"
        value={form.role}
        onChange={handleChange}
        options={rolesData?.data || []}
        optionValue="roleName"
        optionKey="_id"
        required
        error={errors.role}
        width="col-md-6"
      />
      <SingleImage
        label="Profile Photo"
        name="profilePhoto"
        onChange={handleImageChange}
        value={form.profilePhoto}
        required
        error={errors.profilePhoto}
        width="col-md-12"
      />
    </FormWrapper>
  );
};

export default UpdateUser;
