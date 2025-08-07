import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { ApiError } from './ApiError';

export async function validateDto<T extends object>(
  dtoClass: new () => T,
  data: any
): Promise<T> {
  const dto = plainToClass(dtoClass, data);
  const errors = await validate(dto as object);

  if (errors.length > 0) {
    const errorMessages = errors.map((error: ValidationError) => {
      return Object.values(error.constraints || {}).join(', ');
    });

    throw new ApiError('Validation failed', 400, {
      errors: errorMessages,
      fields: errors.map(e => e.property)
    });
  }

  return dto;
}