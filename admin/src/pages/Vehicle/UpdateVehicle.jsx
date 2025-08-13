import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import FormWrapper from "../../components/Form/FormWrapper";
import Input from "../../components/Input/Input";
import SingleImage from "../../components/Input/SingleImage";
import SingleSelect from "../../components/Input/SingleSelect";
import useFetch from "../../hooks/useFetch";
import usePatch from "../../hooks/usePatch";
import { useAuth } from "../../context/auth.context";
import { toast } from "react-toastify";
import useFormValidation from "../../hooks/useFormValidation";

const UpdateVehicle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { validToken } = useAuth();
  const { data: userData } = useFetch("/api/v1/user/get-all-user", validToken);
  const { data: vehicleData } = useFetch(`/api/v1/vehicle/get-single-vehicle/${id}`, validToken);
  const { updateData, response, updateError } = usePatch(`/api/v1/vehicle/update-vehicle/${id}`);
  const { errors, setErrors, validate } = useFormValidation();

  const [form, setForm] = useState({
    vehicleNumber: "",
    vehicleType: "",
    vehicleOwner: "",
    vehiclePhoto: null,
    vehicleRC: null,
    status: "Approved",
  });

  useEffect(() => {
    if (vehicleData?.data) {
      const { vehicleNumber, vehicleType, vehicleOwner, vehiclePhoto, vehicleRC, status } = vehicleData.data;
      setForm({
        vehicleNumber,
        vehicleType,
        vehicleOwner: vehicleOwner?._id,
        vehiclePhoto,
        vehicleRC,
        status,
      });
    };
  }, [vehicleData]);

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

    if (!validate(form, validationRules)) return;

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if ((key === "vehiclePhoto" || key === "vehicleRC") && typeof value === "string") return;
      formData.append(key, value);
    });

    await updateData(formData, validToken, true);
  };

  useEffect(() => {
    if (response?.success) {
      toast.success("Vehicle updated successfully");
      navigate(-1);
    };
  }, [response, navigate]);

  useEffect(() => {
    if (updateError) {
      toast.error(updateError);
    };
  }, [updateError]);

  const vehicleType = [
    { _id: "Car", vehicleType: "Car" },
    { _id: "Bike", vehicleType: "Bike" },
    { _id: "Scooter", vehicleType: "Scooter" },
    { _id: "Other", vehicleType: "Other" },
  ];

  return (
    <FormWrapper title="Update Vehicle" onSubmit={handleSubmit}>
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
        options={vehicleType}
        optionValue="vehicleType"
        optionKey="_id"
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
        value={form.vehiclePhoto}
        onChange={(file) => handleImageChange(file, "vehiclePhoto")}
        required
        error={errors.vehiclePhoto}
        width="col-md-6"
      />
      <SingleImage
        label="Vehicle RC"
        name="vehicleRC"
        value={form.vehicleRC}
        onChange={(file) => handleImageChange(file, "vehicleRC")}
        required
        error={errors.vehicleRC}
        width="col-md-6"
      />
    </FormWrapper>
  );
};

export default UpdateVehicle;
