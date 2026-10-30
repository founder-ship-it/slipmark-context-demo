/** Card processing fee, in pence, for an amount in pence. */
export function fee(amount: number): number {
  if (amount <= 0) return 0;
  return Math.round(amount * 0.014) + 20;
}
