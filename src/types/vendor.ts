export interface Vendor {
  _id: string;
  storeName: string;
  email: string;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  vendor: Vendor;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  storeName: string;
}