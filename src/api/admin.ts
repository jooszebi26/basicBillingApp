export interface AdminUser {
  id: number;
  name: string;
  username: string;
  roles: string[]; // backend Set<String> → JSON-ben tömb
}

const BASE_URL = "http://localhost:9090/api/admin/users/";

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

export async function getAllUsers(): Promise<AdminUser[]> {
  const response = await fetch(BASE_URL, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Nem sikerült lekérni a felhasználókat.");
  }

  return response.json();
}

export async function updateUserRoles(
  username: string,
  roles: string[]
): Promise<any> {
  const response = await fetch(`${BASE_URL}${username}/roles`, {
    method: "PATCH", // vagy PATCH, ahogy a backend várja
    headers: getAuthHeaders(),
    body: JSON.stringify({ roles }),
  });

  if (!response.ok) {
    throw new Error("Nem sikerült frissíteni a szerepköröket.");
  }
}

export async function deleteUser(username: string): Promise<void> {
  console.log(username);
  const response = await fetch(`${BASE_URL}by/${username}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Nem sikerült törölni a felhasználót.");
  }
}