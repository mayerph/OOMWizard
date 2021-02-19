
/**
 * Expand the request type with additional field
 */
declare namespace Express{
   export interface Request {
      user: string | null;
  }
}