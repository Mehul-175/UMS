const API_BASE = import.meta.env.VITE_API_URL;

export async function apiRequest(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    credentials: "include", 
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}

export async function logoutRequest() {
  return apiRequest("/auth/logout", {
    method: "POST",
  });
}

export async function updateProfileRequest(fullName) {
  return apiRequest("/user/profile", {
    method: "PUT",
    body: JSON.stringify({ fullName }),
  });
}

export async function changePasswordRequest(currentPassword, newPassword) {
  return apiRequest("/user/change-password", {
    method: "PUT",
    body: JSON.stringify({ currentPassword, newPassword }),
  });
}

