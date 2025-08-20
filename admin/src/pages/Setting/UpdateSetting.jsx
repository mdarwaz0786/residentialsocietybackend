import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import FormWrapper from "../../components/Form/FormWrapper";
import Input from "../../components/Input/Input";
import useFetch from "../../hooks/useFetch";
import usePatch from "../../hooks/usePatch";
import { useAuth } from "../../context/auth.context";
import { toast } from "react-toastify";
import useFormValidation from "../../hooks/useFormValidation";

const UpdateSetting = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { validToken } = useAuth();
  const { data } = useFetch(`/api/v1/setting/get-single-setting/${id}`, validToken);
  const { updateData, response, updateError } = usePatch(`/api/v1/setting/update-setting/${id}`);
  const { errors, setErrors, validate } = useFormValidation();

  const [form, setForm] = useState({
    appVersion: "",
    appName: "",
    playStoreLink: "",
    appStoreLink: "",
    payuKey: "",
    payuSalt: "",
    tenantRegistrationFee: "",
    maidRegistrationFee: "",
  });

  useEffect(() => {
    if (data?.data) {
      const { appName, appVersion, playStoreLink, appStoreLink, payuSalt, payuKey, tenantRegistrationFee, maidRegistrationFee } = data.data;
      setForm({
        appVersion: appVersion,
        appName: appName,
        playStoreLink: playStoreLink,
        appStoreLink: appStoreLink,
        payuKey: payuKey,
        payuSalt: payuSalt,
        tenantRegistrationFee: tenantRegistrationFee,
        maidRegistrationFee: maidRegistrationFee,
      });
    };
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((errs) => ({ ...errs, [name]: "" }));
  };

  const validationRules = {
    appName: { required: true, label: "App Name" },
    appVersion: { required: true, label: "App Version" },
    playStoreLink: { required: true, label: "Play Store Link" },
    appStoreLink: { required: true, label: "App Store Link" },
    payuKey: { required: true, label: "PayU Key" },
    payuSalt: { required: true, label: "PayU Salt" },
    tenantRegistrationFee: { required: true, label: "tenantRegistrationFee" },
    maidRegistrationFee: { required: true, label: "maidRegistrationFee" },
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate(form, validationRules)) {
      return;
    };

    await updateData(form, validToken, false);
  };

  useEffect(() => {
    if (response?.success) {
      toast.success("Setting updated");
      navigate(-1);
    };
  }, [response, navigate]);

  useEffect(() => {
    if (updateError) {
      toast.error(updateError);
    };
  }, [updateError]);

  return (
    <FormWrapper title="Update Setting" onSubmit={handleSubmit}>
      <Input
        label="App Name"
        name="appName"
        value={form.appName}
        onChange={handleChange}
        required
        error={errors.appName}
        width="col-md-6"
      />
      <Input
        label="App Version"
        name="appVersion"
        value={form.appVersion}
        onChange={handleChange}
        required
        error={errors.appVersion}
        width="col-md-6"
      />
      <Input
        label="Play Store Link"
        name="playStoreLink"
        value={form.playStoreLink}
        onChange={handleChange}
        required
        error={errors.playStoreLink}
        width="col-md-6"
      />
      <Input
        label="App Store Link"
        name="appStoreLink"
        value={form.appStoreLink}
        onChange={handleChange}
        required
        error={errors.appStoreLink}
        width="col-md-6"
      />
      <Input
        label="PayU Key"
        name="payuKey"
        value={form.payuKey}
        onChange={handleChange}
        required
        error={errors.payuKey}
        width="col-md-6"
      />
      <Input
        label="PayU Salt"
        name="payuSalt"
        value={form.payuSalt}
        onChange={handleChange}
        required
        error={errors.payuSalt}
        width="col-md-6"
      />
      <Input
        label="Tenant Registration Fee"
        name="tenantRegistrationFee"
        value={form.tenantRegistrationFee}
        onChange={handleChange}
        required
        error={errors.tenantRegistrationFee}
        width="col-md-6"
      />
      <Input
        label="Maid Registration Fee"
        name="maidRegistrationFee"
        value={form.maidRegistrationFee}
        onChange={handleChange}
        required
        error={errors.maidRegistrationFee}
        width="col-md-6"
      />
    </FormWrapper>
  );
};

export default UpdateSetting;
