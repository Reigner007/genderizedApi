
export const validateName = (name: any): string => {
  if (typeof name !== 'string' || !name.trim()) {
    const error: any = new Error('Name is required');
    error.status = 400;
    throw error;
  }
  return name.trim().toLowerCase();
};