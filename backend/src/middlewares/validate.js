import { AppError } from '../utils/errors.js';

/**
 * Creates an Express middleware that validates the request body (or query)
 * against a Zod schema. On failure, throws a structured 400 AppError with
 * field-level details.
 *
 * @param {import('zod').ZodSchema} schema - Zod schema to validate against
 * @param {'body' | 'query' | 'params'} source - Which part of the request to validate
 * @returns {Function} Express middleware
 */
export const validate = (schema, source = 'body') => (req, _res, next) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
        const rawIssues = result.error?.issues || result.error?.errors || [];
        const fieldErrors = rawIssues.map((err) => ({
            field: Array.isArray(err.path) ? err.path.join('.') : String(err.path || ''),
            message: err.message,
        }));

        const mainMessage = fieldErrors.length > 0
            ? fieldErrors[0].message
            : 'Validation failed';

        throw new AppError(
            mainMessage,
            400,
            fieldErrors,
        );
    }

    // Replace the source with parsed (and transformed) data
    req[source] = result.data;
    next();
};
