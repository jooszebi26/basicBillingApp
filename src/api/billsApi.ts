const API_BASE = "http://localhost:9090/api";

export interface UserBillRes {
  id: number;
  exhibitionDate: string;
  dueDate: string;
  name: string;
  comment: string;
  amount: number;
}

export interface AdminBillRes {
  id: number;
  username: string;
  exhibitionDate: string;
  dueDate: string;
  name: string;
  comment: string;
  amount: number;
}

export type BillRes = UserBillRes | AdminBillRes;

function getRoles(): string[] {
  const raw = localStorage.getItem("roles");
  try {
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function isAccountantOrAdmin(): boolean {
  const roles = getRoles();
  return roles.includes("ACCOUNTANT") || roles.includes("ADMIN");
}


export async function getAllBills(): Promise<BillRes[]> {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Nincs bejelentkezett felhasználó.");
  }

  const accountantOrAdmin = isAccountantOrAdmin();

  const url = accountantOrAdmin
    ? `${API_BASE}/users/` 
    : `${API_BASE}/users/me/bills`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Nem sikerült lekérni a számlákat.");
  }
  return response.json();
}

export async function getBillById(billId: number): Promise<BillRes> {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Nincs bejelentkezett felhasználó.");
  }

  const accountantOrAdmin = isAccountantOrAdmin();

  const url = accountantOrAdmin
    ? `${API_BASE}/users/bills/${billId}` 
    : `${API_BASE}/users/me/${billId}`; 

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Nem sikerült lekérni a számla részleteit.");
  }

  return response.json();
}
export async function createBill(payload: {
  username: string;
  exhibitionDate: string;
  dueDate: string;
  name: string;
  comment: string;
  amount: number;
}): Promise<BillRes> {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Nincs bejelentkezett felhasználó.");
  }

  if (!isAccountantOrAdmin()) {
    throw new Error("Nincs jogosultság számla létrehozásához.");
  }

  const response = await fetch(`${API_BASE}/users/bills/create`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Nem sikerült létrehozni a számlát.");
  }

  return response.json();
}
