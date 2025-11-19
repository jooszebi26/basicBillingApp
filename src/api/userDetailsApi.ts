export async function getUserDetails(): Promise<any[]> {
  const token = localStorage.getItem("token");

  const response = await fetch("http://localhost:9090/api/users/me/details/", {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });

  if (!response.ok) {
    throw new Error("Nem sikerült lekérni a felhasználó adatait.");
  }

  const data = await response.json();
  console.log(data)
  return data;
}