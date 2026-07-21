import apiClient from "../config/ApiClient";


export async function apiUploadJobImage(jobRequestId, kind, file) {
  const formData = new FormData();
  formData.append("file", file);
  
  const response = await apiClient.post(`/api/images/job/${kind}/${jobRequestId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data?.imageUrl || "";
}


export async function fetchJobs(isWorker) {
  const endpoint = isWorker ? "/api/worker/dashboard/jobs" : "/api/customer/dashboard/jobs";
  const response = await apiClient.get(endpoint);
  return response.data;
}

export async function fetchQuotes(jobId) {
  const response = await apiClient.get(`/api/quotes/job/${jobId}`);
  return response.data;
}

export async function acceptQuote(quoteId) {
  const response = await apiClient.put(`/api/quotes/accept/${quoteId}`);
  return response.data;
}

export async function declineQuote(quoteId) {
  const response = await apiClient.put(`/api/quotes/decline/${quoteId}`);
  return response.data;
}


export async function updateJobStatus(jobId, status) {
 
  const response = await apiClient.put(`/api/jobs/status/${jobId}?status=${status}`);
  return response.data;
}