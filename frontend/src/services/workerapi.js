import apiClient from "../config/ApiClient"; 


export async function acceptJob(jobId) {
  const response = await apiClient.put(`/api/jobs/accept/${jobId}`);
  
  return response.data; 
}


export async function submitQuote(jobId, quotedPrice, draft) {
  const response = await apiClient.post(`/api/quotes/submit/${jobId}`, {
    quotedPrice: quotedPrice,
    message: draft.message || "",
  });

  return response.data;
}

export async function getWorkerJobs() {
    const response = await apiClient.get("/api/jobs/worker/feed");
    return response.data;
}