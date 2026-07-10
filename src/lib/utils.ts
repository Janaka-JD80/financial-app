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

