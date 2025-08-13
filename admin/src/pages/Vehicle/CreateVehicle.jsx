import { useEffect, useState } from "react";
import FormWrapper from "../../components/Form/FormWrapper";
import Input from "../../components/Input/Input";
import SingleImage from "../../components/Input/SingleImage";
import SingleSelect from "../../components/Input/SingleSelect";
import useCreate from "../../hooks/useCreate";
import { useAuth } from "../../context/auth.context";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import useFormValidation from "../../hooks/useFormValidation";
import useFetch from "../../hooks/useFetch";

const CreateVehicle = () => {
  const navigate = useNavigate();
  const { validToken } = useAuth();
  const { postData, response, postError } = useCreate("/api/v1/vehicle/create-vehicle");
  const { data: userData } = useFetch("/api/v1/user/get-all-user", validToken);
  const { errors, setErrors, validate } = useFormValidation();
  const [form, setForm] = useState({
    vehicleNumber: "",
    vehicleType: "",
    vehicleOwner: "",
    vehiclePhoto: null,
    vehicleRC: null,
    status: "Approved",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((errs) => ({ ...errs, [name]: "" }));
  };

  const handleImageChange = (file, name) => {
    setForm((f) => ({ ...f, [name]: file }));
    setErrors((errs) => ({ ...errs, [name]: "" }));
  };

  const validationRules = {
    vehicleNumber: { required: true, label: "Vehicle Number" },
    vehicleType: { required: true, label: "Vehicle Type" },
    vehicleOwner: { required: true, label: "Vehicle Owner" },
    vehiclePhoto: { required: true, label: "Vehicle Photo" },
    vehicleRC: { required: true, label: "Vehicle RC" },
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate(form, validationRules)) {
      return;
    };

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => formData.append(key, value));
    await postData(formData, validToken, true);
  };

  useEffect(() => {
    if (response?.success) {
      toast.success("Vehicle created");
      navigate(-1);
    };
  }, [response, navigate]);

  useEffect(() => {
    if (postError) {
      toast.error(postError);
    };
  }, [postError]);

  const vehicleType = [
    { _id: 1, vehicleType: "Car" },
    { _id: 2, vehicleType: "Bike" },
    { _id: 3, vehicleType: "Scooter" },
    { _id: 4, vehicleType: "Other" },
  ];

  return (
    <FormWrapper title="Create New Vehicle" onSubmit={handleSubmit}>
      <Input
        label="Vehicle Number"
        name="vehicleNumber"
        value={form.vehicleNumber}
        onChange={handleChange}
        required
        error={errors.vehicleNumber}
        width="col-md-4"
      />
      <SingleSelect
        label="Vehicle Type"
        name="vehicleType"
        value={form.vehicleType}
        onChange={handleChange}
        options={vehicleType || []}
        optionValue="vehicleType"
        optionKey="vehicleType"
        required
        error={errors.vehicleType}
        width="col-md-4"
      />
      <SingleSelect
        label="Vehicle Owner"
        name="vehicleOwner"
        value={form.vehicleOwner}
        onChange={handleChange}
        options={userData?.data || []}
        optionValue="fullName"
        optionKey="_id"
        required
        error={errors.vehicleOwner}
        width="col-md-4"
      />
      <SingleImage
        label="Vehicle Photo"
        name="vehiclePhoto"
        onChange={(file) => handleImageChange(file, "vehiclePhoto")}
        required
        error={errors.vehiclePhoto}
        width="col-md-6"
      />
      <SingleImage
        label="Vehicle RC"
        name="vehicleRC"
        onChange={(file) => handleImageChange(file, "vehicleRC")}
        required
        error={errors.vehicleRC}
        width="col-md-6"
      />
    </FormWrapper>
  );
};

export default CreateVehicle;
