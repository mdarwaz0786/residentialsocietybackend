import { useState } from "react";
import usePost from "../../hooks/usePost.js";
import Input from "../../components/Input/Input.jsx";
import FormWrapper from "../../components/Form/FormWrapper.jsx";
import { useAuth } from "../../context/auth.context.js";

const AddUserForm = () => {
  const { validToken } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { handleSubmit } = usePost({
    url: `${import.meta.env.VITE_API_BASE_URL}/api/v1/user/create-user`,
    token: validToken,
    validate: (data) => {
      if (!data.name) return "Name is required";
      if (!data.email) return "Email is required";
      if (!data.password) return "Password is required";
      return null;
    },
    onSuccess: () => {
      setName("");
      setEmail("");
      setPassword("");
    },
  });

  const handleFormSubmit = (e) => {
    handleSubmit(e, { name, email, password }, () => {
      setName("");
      setEmail("");
      setPassword("");
    });
  };

  return (
    <FormWrapper title="Add New User" onSubmit={handleFormSubmit}>
      <Input
        label="Name"
        name="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <Input
        label="Email"
        name="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <Input
        label="Password"
        name="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
    </FormWrapper>
  );
};

export default AddUserForm;
