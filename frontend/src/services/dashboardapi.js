import apiClient from "../config/ApiClient"; 


export async function apiFetch(path) {
  const response = await apiClient.get(path);
  return response.data;
}


export async function apiUploadProfileImage(file) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await apiClient.post("/api/images/profile", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data?.imageUrl || "";
}


export async function apiUpdateWorkerLocation(locationData) {
  const response = await apiClient.put("/api/worker/dashboard/location", locationData);
  return response.data;
}