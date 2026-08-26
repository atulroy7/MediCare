/**
 * Custom application error class with HTTP status codes.
 * Extends the built-in Error class with structured error data.
 */
export class AppError extends Error {
    /**
     * @param {string} message - Human-readable error message
     * @param {number} statusCode - HTTP status code (default: 500)
     * @param {object} [details] - Optional additional error details
     */
    constructor(message, statusCode = 500, details = null) {
        super(message);
        this.name = 'AppError';
        this.statusCode = statusCode;
        this.isOperational = true;
        this.details = details;
        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * Common error factory functions for frequently used HTTP errors.
 */
export const Errors = {
    badRequest: (message = 'Bad request', details = null) =>
        new AppError(message, 400, details),

    unauthorized: (message = 'Authentication required') =>
        new AppError(message, 401),

    forbidden: (message = 'Access denied') =>
        new AppError(message, 403),

    notFound: (message = 'Resource not found') =>
        new AppError(message, 404),

    conflict: (message = 'Resource already exists') =>
        new AppError(message, 409),

    tooMany: (message = 'Too many requests, please try again later') =>
        new AppError(message, 429),

    internal: (message = 'Internal server error') =>
        new AppError(message, 500),
};

/**
 * Wraps an async route handler to automatically catch errors
 * and forward them to the Express error middleware.
 * Eliminates the need for try/catch in every controller.
 *
 * @param {Function} fn - Async route handler (req, res, next) => Promise
 * @returns {Function} Express middleware function
 */
export const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * Structured error response builder.
 * Returns a consistent JSON shape for all error responses.
 *
 * @param {Error} err - The error object
 * @param {boolean} isDev - Whether the server is running in development mode
 * @returns {object} Structured error response body
 */
export const buildErrorResponse = (err, isDev = false) => {
    const response = {
        success: false,
        error: err.name || 'Error',
        message: err.message || 'Something went wrong',
    };

    if (err.details) {
        response.details = err.details;
    }

    if (isDev && !err.isOperational) {
        response.stack = err.stack;
    }

    return response;
};
