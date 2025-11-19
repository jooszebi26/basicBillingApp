export interface RegisterResponse {
  message: string;
}

export default async function register(name: string, username: string, password: string, role: string): Promise<RegisterResponse | null>{
  const url = "http://localhost:9090/api/auth/register";
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name: name,
          username: username,
          password: password,
        role: role}),
      });
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
  
      const result: RegisterResponse = await response.json();
      console.log(result)
      return result;
    } catch (error) {
      if (error instanceof Error) {
          console.error(error.message);
      }
      return null;
    }
}