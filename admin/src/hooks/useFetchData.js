import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

function useFetchData(apiUrl, token = "", initialParams = {}) {
  const [data, setData] = useState(null);
  const [params, setParams] = useState(initialParams);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadFlag, setReloadFlag] = useState(false);

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
        setError(err?.response?.data?.message || "Error while fetching data");
      } finally {
        setIsLoading(false);
      };
    };

    fetchData();
  }, [apiUrl, token, params, reloadFlag]);

  const updateParams = useCallback((newParams) => {
    setParams((prev) => ({
      ...prev,
      ...newParams,
    }));
  }, []);

  return {
    data,
    isLoading,
    error,
    params,
    setParams: updateParams,
    refetch: () => setReloadFlag((prev) => !prev),
  };
};

export default useFetchData;
