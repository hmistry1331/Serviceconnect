import apiClient from "../config/ApiClient";

export async function signup(payload) {
  const response = await apiClient.post("/api/auth/signup", payload);
  return response.data;
}

export async function login(payload) {
  const response = await apiClient.post("/api/auth/login", payload);
  return response.data;
}

export async function loginWithGoogleCode(payload) {
  const response = await apiClient.post("/api/auth/oauth/google/callback", payload);
  return response.data;
}

export async function completeGoogleProfile(payload) {
  const response = await apiClient.post("/api/auth/complete-profile", payload);
  return response.data;
}

export function getGoogleRedirectUri() {
  return (
    import.meta.env.VITE_GOOGLE_REDIRECT_URI ||
    `${window.location.origin}/auth/google/callback`
  );
}

export function buildGoogleOAuthUrl() {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const redirectUri = getGoogleRedirectUri();

  if (!clientId) {
    return null;
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile",
    access_type: "offline",
    prompt: "consent",
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}