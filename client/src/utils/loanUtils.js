export function calculateEMI(principal, rate, months) {
  const monthlyRate = rate / (12 * 100);
  return (
    (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
    (Math.pow(1 + monthlyRate, months) - 1)
  );
}
