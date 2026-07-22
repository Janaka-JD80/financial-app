import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface TransferInfo {
  transferId: string;
  userDescription: string;
}

export function parseTransferDescription(description: string | null | undefined): TransferInfo | null {
  if (!description) return null;
  const match = description.match(/^\[Transfer:\s*([a-fA-F0-9-]+)\]\s*(.*)$/);
  if (match) {
    return {
      transferId: match[1],
      userDescription: match[2].replace(/\((to|from) Account\)$/i, '').trim()
    };
  }
  return null;
}

export interface LoanPaybackInfo {
  loanId: string;
  userDescription: string;
}

export function parseLoanPaybackDescription(description: string | null | undefined): LoanPaybackInfo | null {
  if (!description) return null;
  const match = description.match(/^\[LoanPayback:\s*([a-fA-F0-9-]+)\]\s*(.*)$/);
  if (match) {
    return {
      loanId: match[1],
      userDescription: match[2].trim()
    };
  }
  return null;
}

export function getCleanDescription(description: string | null | undefined, fallback: string = '-'): string {
  if (!description) return fallback;
  
  const transferInfo = parseTransferDescription(description);
  if (transferInfo) return transferInfo.userDescription || 'Transfer';
  
  const loanPaybackInfo = parseLoanPaybackDescription(description);
  if (loanPaybackInfo) return loanPaybackInfo.userDescription || 'Loan Payback';
  
  return description;
}

export function isTransferTransaction(tx: {
  description?: string | null;
  categories?: { name: string } | null;
  transaction_groups?: { name: string } | null;
}) {
  if (!tx) return false;
  return (
    tx.categories?.name?.toLowerCase() === 'transfer' ||
    tx.transaction_groups?.name?.toLowerCase() === 'transfer' ||
    !!(tx.description && tx.description.startsWith('[Transfer:'))
  );
}

