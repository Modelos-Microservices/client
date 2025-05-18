import { DebtStatus } from "../enum/debts.enum";

export type UserKeyCloak = {
    id: string,
    username: string,
    firstName: string,
    lastName: string,
    email: string,
    emailVerified: boolean,
    createdTimestamp: any,
    enabled: boolean,
    totp: boolean,
    disableableCredentialTypes: any[],
    requiredActions: any[],
    notBefore: number,
    access: any,
}

export type userDebts = {
    id: string,
    username: string
}

export type DebtDto = {
    user_id: string;
    description: string;
    amount: number;
    status: DebtStatus;
}