import apiClient from "../config/ApiClient";

export async function submitReview(jobId, reviewData) {
  const response = await apiClient.post(`/api/reviews/submit/${jobId}`, reviewData);
  return response.data;
}