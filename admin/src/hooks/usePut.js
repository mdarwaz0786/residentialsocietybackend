import axios from "axios";
import { toast } from "react-toastify";

const usePut = ({ url, token, validate, onSuccess }) => {
  const handleUpdate = async (e, data) => {
    e.preventDefault();

    const error = validate(data);

    if (error) {
      return toast.error(error);
    };

    try {
      const response = await axios.put(url, data, {
        headers: {
          Authorization: token,
        },
      });

      if (response?.data?.success) {
        toast.success(response?.data?.message || "Updated successfully");
        onSuccess?.();
      } else {
        toast.error(response?.data?.message || "Update failed");
      };
    } catch (err) {
      console.error("Update error:", err.message);
      toast.error("Error while updating");
    };
  };

  return { handleUpdate };
};

export default usePut;
