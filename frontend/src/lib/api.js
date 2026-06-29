import { getApiBaseUrl, parseResponse } from "./utils";

export async function createJobRequest(payload) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${getApiBaseUrl()}/api/jobs/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({
      manualCategory: payload.category,
      problemDescription: payload.description,
      location: payload.location,
      city: payload.city,
      latitude: payload.latitude,
      longitude: payload.longitude,
      budgetAmount: Number(payload.budgetAmount),
    }),
  });

  const data = await parseResponse(response);

  if (!response.ok) {
    throw new Error(data.message || "Failed to create job request.");
  }

  return data;
}
