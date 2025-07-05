// hooks/usePostForm.js
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const usePost = ({ url, token, validate, onSuccess }) => {
  const navigate = useNavigate();

  const handleSubmit = async (e, data, resetFields = () => { }) => {
    e.preventDefault();

    const validationError = validate(data);

    if (validationError) {
      return toast.error(validationError);
    };

    try {
      const response = await axios.post(url, data, {
        headers: {
          Authorization: token,
        },
      });

      if (response?.data?.success) {
        toast.success("Submitted Successfully");
        resetFields();
        if (onSuccess) {
          onSuccess(response?.data);
        } else {
          navigate(-1);
        };
      } else {
        toast.error(response?.data?.message || "Submission failed");
      };
    } catch (error) {
      console.error("Form submission error:", error.message);
      toast.error("Something went wrong");
    };
  };

  return { handleSubmit };
};

export default usePost;
