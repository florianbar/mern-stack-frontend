import { useState, useCallback, useEffect, useRef } from "react";

export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const activeHttpRequests = useRef([]);

  const sendRequest = useCallback(
    async (url, method = "GET", body = null, headers = {}) => {
      setIsLoading(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      // abort previous requests if a new request is sent
      const httpAbortCtrl = new AbortController();
      activeHttpRequests.current.push(httpAbortCtrl);

      try {
        const response = await fetch(url, {
          method,
          headers,
          body,
          signal: httpAbortCtrl.signal, // abort the request if the user navigates away from the page
        });

        const responseData = await response.json();
        if (!response.ok) {
          throw new Error(responseData.message);
        }
        setSuccessMessage(responseData.message);
        setIsLoading(false);
        return responseData;
      } catch (err) {
        setErrorMessage(
          err.message || "Something went wrong, please try again."
        );
        setIsLoading(false);
        throw err;
      }
    },
    []
  );

  const clearError = () => {
    setErrorMessage(null);
  };

  useEffect(() => {
    return () => {
      // cleanup function
      activeHttpRequests.current.forEach((abortCtrl) => abortCtrl.abort()); // abort all pending requests
    };
  }, []);

  return {
    isLoading,
    successMessage,
    errorMessage,
    sendRequest,
    clearError,
  };
};
