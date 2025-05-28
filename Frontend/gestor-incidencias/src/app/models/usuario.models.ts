export interface Usuario {
  id?: string;
  username: string;
  password?: string;
  nombreCompleto: string;
  email: string;
  role: 'admin' | 'tecnic' | 'basic';
}
