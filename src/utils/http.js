export const httpClient = () => {
  let isLoading = false;
  let successMessage = null;
  let errorMessage = null;

  const sendRequest = async (
    url,
    method = "GET",
    body = null,
    headers = {}
  ) => {
    isLoading = true;

    try {
      const response = await fetch(url, {
        method,
        headers,
        body,
      });

      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message);
      }
      successMessage = responseData.message;
      isLoading = false;
      return responseData;
    } catch (err) {
      console.log(err);
      errorMessage = err.message || "Something went wrong, please try again.";
      isLoading = false;
      throw err;
    }
  };

  const clearError = () => {
    errorMessage = null;
  };

  return {
    sendRequest,
    isLoading,
    successMessage,
    errorMessage,
    clearError,
  };
};
