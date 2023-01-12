import { ERRORS } from '@/error';

export function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export const succeed = <T>(data?: T) => ({ type: 'succeeded' as const, data });

export const fail = (id: string) => ({
  id,
  type: 'failed' as const,
  code: ERRORS.get(id).code,
  message: ERRORS.get(id).description,
});
