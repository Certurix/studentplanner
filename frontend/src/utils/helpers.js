/**
 * Helper function to validate API response
 * @param {Object} response - Axios response object
 * @returns {Array} - Valid array of events or empty array
 */
export const validateResponse = (response) => {
  // Check if response has the expected Content-Type
  const contentType = response.headers["content-type"] || "";
  if (!contentType.includes("application/json")) {
    console.error(
      "API returned non-JSON content type:",
      contentType,
      "Status:",
      response.status
    );
    return [];
  }

  // Validate that data is an array
  if (!Array.isArray(response.data)) {
    console.error("API response is not an array:", typeof response.data);
    return [];
  }

  return response.data;
};
