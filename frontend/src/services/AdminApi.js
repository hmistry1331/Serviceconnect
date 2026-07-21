import apiClient from "@/config/ApiClient";

export async function getstats(){
    const response = await apiClient.get("/api/admin/stats");
    return response.data;
}

export async function getusers(){
    const response = await apiClient.get("/api/admin/users");
    return response.data;
}
export async function getpendingworkers(){
    const response = await apiClient.get("/api/admin/workers/pending");
    return response.data;
}

export async function alljobs(){
    const response = await apiClient.get("/api/admin/jobs");
    return response.data;
}

export async function suspendUser(userId){
    const response = await apiClient.put(`/api/admin/users/suspend/${userId}`);
    return response.data;
}
export async function unsuspendUser(userId){
    const response = await apiClient.put(`/api/admin/users/unsuspend/${userId}`);
    return response.data;
}

export async function deleteUser(userId){
    const response = await apiClient.delete(`/api/admin/users/delete/${userId}`);
    return response.data;
}

export async function verifyWorker(workerId){
    const response = await apiClient.put(`/api/admin/workers/verify/${workerId}`);
    return response.data;
}

export async function rejectWorker(workerId, reason){
    const response = await apiClient.put(`/api/admin/workers/reject/${workerId}`, { reason });
    return response.data;
}