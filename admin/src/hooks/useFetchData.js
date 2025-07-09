import { useState, useEffect } from 'react';
import axios from 'axios';

function useFetchData(apiUrl, token = "", initialParams = {}) {
  const [data, setData] = useState(null);
  const [params, setParams] = useState(initialParams);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const config = {
          headers: {
            Authorization: token,
          },
          params: params,
        };
        const response = await axios.get(apiUrl, config);
        if (response?.data?.success) {
          setData(response?.data);
        };
      } catch (err) {
        setError(err?.response?.data?.message);
      } finally {
        setIsLoading(false);
      };
    };

    fetchData();
  }, [apiUrl, token, params]);

  const updateParams = (newParams) => {
    setParams((prev) => ({
      ...prev,
      ...newParams,
    }));
  };

  return {
    data,
    isLoading,
    error,
    params,
    setParams: updateParams,
    refetch: () => setParams((prev) => ({ ...prev })),
  };
};

export default useFetchData;
