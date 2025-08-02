import { useState } from 'react';
import axios from 'axios';

function useCreate(apiUrl) {
  const [response, setResponse] = useState(null);
  const [isPosting, setIsPosting] = useState(false);
  const [postError, setPostError] = useState(null);

  const postData = async (payload, token = "", isFormData = false) => {
    setIsPosting(true);
    setPostError(null);
    try {
      const config = {
        headers: {
          Authorization: token,
          ...(isFormData && { 'Content-Type': 'multipart/form-data' }),
        },
      };
      const res = await axios.post(apiUrl, payload, config);
      if (res?.data?.success) {
        setResponse(res?.data);
      };
    } catch (error) {
      setPostError(error?.response?.data?.message || "Error while creating");
    } finally {
      setIsPosting(false);
    };
  };

  return { postData, response, isPosting, postError };
};

export default useCreate;