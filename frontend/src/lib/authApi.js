function getApiBaseUrl() {
  return (
    import.meta.env.VITE_API_URL ||
    import.meta.env.VITE_API_BASE_URL ||
    "http://localhost:8080"
  );
}

async function parseResponse(response) {
  const responseText = await response.text();

  if (!responseText) {
    return {};
  }

  try {
    return JSON.parse(responseText);
  } catch {
    return { message: responseText };
  }
}

async function postJson(path, payload) {
  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await parseResponse(response);

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Request failed. Please try again.");
  }

  return data;
}

export async function signup(payload) {
  return postJson("/api/auth/signup", payload);
}

export async function login(payload) {
  return postJson("/api/auth/login", payload);
}

export async function loginWithGoogleCode(payload) {
  return postJson("/api/auth/oauth/google/callback", payload);
}

export function buildGoogleOAuthUrl() {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const redirectUri =
    import.meta.env.VITE_GOOGLE_REDIRECT_URI ||
    `${window.location.origin}/auth/google/callback`;

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
