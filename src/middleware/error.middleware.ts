import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);

  let status = err.status || 500;
  let message = err.message || 'Internal server error';

  // Handle 502 specifically for external APIs
  if (message.includes('Genderize') || 
      message.includes('Agify') || 
      message.includes('Nationalize')) {
    status = 502;
  }

  // Ensure status is valid
  if (status < 100 || status > 599) {
    status = 500;
  }

  res.status(status).json({
    status: 'error',
    message: message,
  });
};