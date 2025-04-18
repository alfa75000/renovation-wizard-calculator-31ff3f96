export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  companyId?: string;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CompanyData {
  id: string;
  name: string;
  address: string;
  postal_code: string;
  city: string;
  tel1: string;
  tel2?: string;
  email: string;
  siret: string;
  logo_url?: string;
  slogan?: string; // Ajout du champ slogan
  user_id?: string;
  created_at?: string;
}

export interface Property {
  id: string;
  name: string;
  address: string;
  city: string;
  postalCode: string;
  clientId: string;
  companyId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}
