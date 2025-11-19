
export interface LoginResponse {
  token: string;
  username: string;
  roles: string[];
}

export interface LoginError extends Error {
  captchaRequired?: boolean;
}

export default async function login(
  username: string,
  password: string,
  captchaToken?: string | null
): Promise<LoginResponse> {
  const url = "http://localhost:9090/api/auth/login";

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
      captchaToken: captchaToken ?? null,
    }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      (data && (data.message || data.error)) || "Ismeretlen hiba";

    const error: LoginError = new Error(message) as LoginError;

    if (data && typeof data.captchaRequired === "boolean") {
      error.captchaRequired = data.captchaRequired;
    }

    if (
      !error.captchaRequired &&
      typeof message === "string" &&
      message.toLowerCase().includes("captcha")
    ) {
      error.captchaRequired = true;
    }

    throw error;
  }

  return data as LoginResponse;
}
