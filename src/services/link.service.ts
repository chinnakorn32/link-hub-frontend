import apiClient from './api.service';
import { Link, LinkRequest } from '../types/link.types';

/**
 * Link service for API calls
 */
class LinkService {
    private readonly BASE_PATH = '/api/links';

    /**
     * Get all links
     */
    async getAllLinks(): Promise<Link[]> {
        const response = await apiClient.get<Link[]>(this.BASE_PATH);
        return response.data;
    }

    /**
     * Get link by ID
     */
    async getLinkById(id: string): Promise<Link> {
        const response = await apiClient.get<Link>(`${this.BASE_PATH}/${id}`);
        return response.data;
    }

    /**
     * Create a new link
     */
    async createLink(request: LinkRequest): Promise<Link> {
        const response = await apiClient.post<Link>(this.BASE_PATH, request);
        return response.data;
    }

    /**
     * Update an existing link
     */
    async updateLink(id: string, request: LinkRequest): Promise<Link> {
        const response = await apiClient.put<Link>(`${this.BASE_PATH}/${id}`, request);
        return response.data;
    }

    /**
     * Delete a link
     */
    async deleteLink(id: string): Promise<void> {
        await apiClient.delete(`${this.BASE_PATH}/${id}`);
    }
}

export default new LinkService();
