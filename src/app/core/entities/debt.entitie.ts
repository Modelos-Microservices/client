import { DebtStatus } from "../enum/debts.enum";

export interface Debt {
  id: string;
  user_id: string;
  user_name: string;
  description: string;
  amount: number;
  createdAt: string; 
  status: DebtStatus
}
