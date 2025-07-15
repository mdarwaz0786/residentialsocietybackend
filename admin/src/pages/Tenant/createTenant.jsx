import { useEffect, useState } from "react";
import FormWrapper from "../../components/form/FormWrapper";
import Input from "../../components/Input/Input";
import useFetch from "../../hooks/useFetch";
import useCreate from "../../hooks/useCreate";
import SingleImage from "../../components/Input/SingleImage";
import SingleSelect from "../../components/Input/SingleSelect";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth.context";

const defaultTenantPerson = {
  fullName: "",
  email: "",
  mobile: "",
  password: "",
  profilePhoto: null,
  aadharCard: null,
  rentAgreement: null,
  policeVerification: null,
  vehicleRC: null,
  currentAddress: "",
  permanentAddress: "",
  fromDate: "",
  toDate: "",
};

const CreateTenant = () => {
  const { validToken } = useAuth();
  const navigate = useNavigate();
  const { data: flats } = useFetch("/api/v1/flat/get-all-flat", validToken);
  const { postData, response, postError } = useCreate("/api/v1/tenant/create-tenant");

  const [flat, setFlat] = useState("");
  const [tenantPersons, setTenantPersons] = useState([defaultTenantPerson]);

  const handleTenantChange = (index, field, value) => {
    const updated = [...tenantPersons];
    updated[index][field] = value;
    setTenantPersons(updated);
  };

  const handleAddPerson = () => setTenantPersons([...tenantPersons, defaultTenantPerson]);

  const handleRemovePerson = (index) => {
    if (tenantPersons.length > 1) {
      const updated = [...tenantPersons];
      updated.splice(index, 1);
      setTenantPersons(updated);
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!flat) {
      return toast.error("Please select a flat");
    };

    const formData = new FormData();
    formData.append("flat", flat);

    const tenantPersonData = tenantPersons.map(({ ...rest }) => rest);

    formData.append("tenantPersons", JSON.stringify(tenantPersonData));

    tenantPersons.forEach((person, index) => {
      const keys = ["profilePhoto", "aadharCard", "rentAgreement", "policeVerification", "vehicleRC"];
      keys.forEach((key) => {
        if (person[key]) {
          formData.append(`tenantPersons[${index}].${key}`, person[key]);
        };
      });
    });

    console.log(formData);

    await postData(formData, validToken, true);
  };

  useEffect(() => {
    if (response?.success) {
      toast.success("Tenant created successfully");
      navigate(-1);
    };
  }, [response, navigate]);

  useEffect(() => {
    if (postError) {
      toast.error(postError);
    };
  }, [postError]);

  return (
    <FormWrapper title="Create Tenant" onSubmit={handleSubmit}>
      <SingleSelect
        label="Select Flat"
        name="flat"
        value={flat}
        onChange={(e) => setFlat(e.target.value)}
        options={flats?.data || []}
        optionValue="flatNumber"
        optionKey="_id"
        required
        error={!flat ? "Flat is required." : ""}
        width="col-md-12"
      />

      {tenantPersons.map((person, index) => (
        <div key={index} className="border p-3 my-3">
          <h5 className="mb-3">Tenant {index + 1}</h5>
          <div className="row">
            <Input
              label="Full Name"
              name="fullName"
              value={person.fullName}
              onChange={(e) => handleTenantChange(index, "fullName", e.target.value)}
              required
              width="col-md-6"
            />
            <Input
              label="Email"
              name="email"
              value={person.email}
              onChange={(e) => handleTenantChange(index, "email", e.target.value)}
              required
              width="col-md-6"
            />
            <Input
              label="Mobile"
              name="mobile"
              value={person.mobile}
              onChange={(e) => handleTenantChange(index, "mobile", e.target.value)}
              required
              width="col-md-6"
            />
            <Input
              label="Password"
              name="password"
              type="password"
              value={person.password}
              onChange={(e) => handleTenantChange(index, "password", e.target.value)}
              required
              width="col-md-6"
            />
            <Input
              label="Current Address"
              name="currentAddress"
              value={person.currentAddress}
              onChange={(e) => handleTenantChange(index, "currentAddress", e.target.value)}
              required
              width="col-md-6"
            />
            <Input
              label="Permanent Address"
              name="permanentAddress"
              value={person.permanentAddress}
              onChange={(e) => handleTenantChange(index, "permanentAddress", e.target.value)}
              required
              width="col-md-6"
            />
            <Input
              label="From Date"
              name="fromDate"
              type="date"
              value={person.fromDate}
              onChange={(e) => handleTenantChange(index, "fromDate", e.target.value)}
              width="col-md-6"
            />
            <SingleImage
              label="Profile Photo"
              name="profilePhoto"
              onChange={(file) => handleTenantChange(index, "profilePhoto", file)}
              required
              width="col-md-6"
            />
            <SingleImage
              label="Aadhar Card"
              name="aadharCard"
              onChange={(file) => handleTenantChange(index, "aadharCard", file)}
              required
              width="col-md-6"
            />
            <SingleImage
              label="Rent Agreement"
              name="rentAgreement"
              onChange={(file) => handleTenantChange(index, "rentAgreement", file)}
              required
              width="col-md-6"
            />
            <SingleImage
              label="Police Verification"
              name="policeVerification"
              onChange={(file) => handleTenantChange(index, "policeVerification", file)}
              required
              width="col-md-6"
            />
            <SingleImage
              label="Vehicle RC"
              name="vehicleRC"
              onChange={(file) => handleTenantChange(index, "vehicleRC", file)}
              required
              width="col-md-6"
            />
          </div>

          {tenantPersons.length > 1 && (
            <button
              type="button"
              onClick={() => handleRemovePerson(index)}
              className="btn btn-danger mt-2"
            >
              Remove Person
            </button>
          )}
        </div>
      ))}

      <button type="button" onClick={handleAddPerson} className="btn btn-secondary mt-3">
        + Add Another Tenant
      </button>
    </FormWrapper>
  );
};

export default CreateTenant;
