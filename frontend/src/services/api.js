import apiClient from "../config/ApiClient";

export async function createJobRequest(payload) {
  
  const response = await apiClient.post("/api/jobs/create", {
    manualCategory: payload.category,
    problemDescription: payload.description,
    location: payload.location,
    city: payload.city,
    latitude: payload.latitude,
    longitude: payload.longitude,
    budgetAmount: Number(payload.budgetAmount),
  });

  return response.data;
}