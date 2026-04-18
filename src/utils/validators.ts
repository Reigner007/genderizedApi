import { z } from 'zod'; 

export const validateName = (name: any): string => {
  if (typeof name !== 'string' || !name.trim()) {
    throw new Error('Name is required');
  }
  return name.trim().toLowerCase();
};