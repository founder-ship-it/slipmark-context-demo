/** Card processing fee, in pence, for an amount in pence. */
export function fee(amount: number): number {
  return Math.ceil(amount * 0.014) + 20;
}
