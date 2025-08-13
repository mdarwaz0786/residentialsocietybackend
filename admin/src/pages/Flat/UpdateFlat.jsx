import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import FormWrapper from "../../components/form/FormWrapper";
import Input from "../../components/Input/Input";
import SingleSelect from "../../components/Input/SingleSelect";
import useFetch from "../../hooks/useFetch";
import usePatch from "../../hooks/usePatch";
import { useAuth } from "../../context/auth.context";
import { toast } from "react-toastify";
import useFormValidation from "../../hooks/useFormValidation";

const UpdateFlat = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { validToken } = useAuth();
  const { data: flatData } = useFetch(`/api/v1/flat/get-single-flat/${id}`, validToken);
  const { updateData, response, updateError } = usePatch(`/api/v1/flat/update-flat/${id}`);
  const { errors, setErrors, validate } = useFormValidation();
  const [form, setForm] = useState({
    flatNumber: "",
    floor: "",
    flatType: "",
    tower: "",
  });

  useEffect(() => {
    if (flatData?.data) {
      const { flatNumber, floor, tower, flatType } = flatData.data;
      setForm({
        flatNumber,
        floor,
        flatType,
        tower,
      });
    };
  }, [flatData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((errs) => ({ ...errs, [name]: "" }));
  };

  const validationRules = {
    flatNumber: { required: true, label: "Flat Number" },
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate(form, validationRules)) return;
    await updateData(form, validToken);
  };

  useEffect(() => {
    if (response?.success) {
      toast.success("Flat updated");
      navigate(-1);
    };
  }, [response, navigate]);

  useEffect(() => {
    if (updateError) {
      toast.error(updateError);
    };
  }, [updateError]);

  const flatType = [
    { _id: 1, flatType: "1BHK" },
    { _id: 2, flatType: "2BHK" },
    { _id: 3, flatType: "3BHK" },
    { _id: 3, flatType: "4BHK" },
    { _id: 4, flatType: "Studio" },
    { _id: 5, flatType: "Penthouse" },
    { _id: 6, flatType: "Other" },
  ];

  return (
    <FormWrapper title="Update Flat" onSubmit={handleSubmit}>
      <Input
        label="Flat Number"
        name="flatNumber"
        value={form.flatNumber}
        onChange={handleChange}
        required
        error={errors.flatNumber}
        width="col-md-6"
      />
      <Input
        label="Tower"
        name="tower"
        value={form.tower}
        onChange={handleChange}
        width="col-md-6"
      />
      <Input
        label="Floor"
        name="floor"
        value={form.floor}
        onChange={handleChange}
        width="col-md-6"
      />
      <SingleSelect
        label="Flat Type"
        name="flatType"
        value={form.flatType}
        onChange={handleChange}
        options={flatType}
        optionValue="flatType"
        optionKey="flatType"
        width="col-md-6"
      />
    </FormWrapper>
  );
};

export default UpdateFlat;
