import { useState, useEffect } from "react";

// Hook reutilizable para manejar peticiones a una API
export const useFetch = (fetchFunction, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async (signal) => {
    setLoading(true);
    try {

      const result = await fetchFunction(signal);
      
      if (!signal.aborted) {
        setData(result);
        setError(null); 
      }

    } catch (error) {

      if (!signal.aborted) {
        setError(error);
      }

    } finally {

      if (!signal.aborted) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const abortController = new AbortController();
    fetchData(abortController.signal);

    return () => {
      abortController.abort(); // Cancelar la solicitud si el componente se desmonta
    };
  }, dependencies);

  return {
    data,
    loading,
    error,
    refetch: () => fetchData(new AbortController().signal),
  };
};
