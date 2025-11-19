import { User } from 'firebase/auth'

export interface AuthContextType {
  user: User | null | undefined // undefined = checking, null = not logged in
}

export interface Match {
  id: number;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED';
  cratedAt: string;
}