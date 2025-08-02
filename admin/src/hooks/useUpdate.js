import { useState } from 'react';
import axios from 'axios';

function useUpdate(apiUrl) {
  const [response, setResponse] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState(null);

  const updateData = async (payload, token = "", isFormData = false) => {
    setIsUpdating(true);
    setUpdateError(null);
    try {
      const config = {
        headers: {
          Authorization: token,
          ...(isFormData && { 'Content-Type': 'multipart/form-data' }),
        },
      };
      const res = await axios.put(apiUrl, payload, config);
      if (res?.data?.success) {
        setResponse(res?.data);
      };
    } catch (error) {
      setUpdateError(error?.response?.data?.message || "Error while updating");
    } finally {
      setIsUpdating(false);
    };
  };

  return { updateData, response, isUpdating, updateError };
};

export default useUpdate;