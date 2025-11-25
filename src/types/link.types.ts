/**
 * Link entity interface
 */
export interface Link {
    id: string;
    title: string;
    url: string;
    description: string;
    category: string;
    createDate: string;
    updateDate: string;
}

/**
 * Link request interface for create/update operations
 */
export interface LinkRequest {
    title: string;
    url: string;
    description: string;
    category: string;
}

/**
 * API response wrapper
 */
export interface ApiResponse<T> {
    data: T;
    message?: string;
}

/**
 * Error response interface
 */
export interface ErrorResponse {
    timestamp: string;
    status: number;
    error: string;
    message: string;
    path: string;
}
