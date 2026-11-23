export function isUniqueViolation(error) {
  return error?.code === 'P2002';
}