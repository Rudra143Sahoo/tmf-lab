import api from '../config/api';
import { Note, NotesResponse, CreateNoteData, ApiResponse } from '../types';

export const notesService = {
  // Get all notes with pagination and search
  getNotes: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    tags?: string[];
  }): Promise<NotesResponse> => {
    const searchParams = new URLSearchParams();
    
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.search) searchParams.append('search', params.search);
    if (params?.tags) params.tags.forEach(tag => searchParams.append('tags', tag));

    const response = await api.get(`/notes?${searchParams.toString()}`);
    return response.data.data;
  },

  // Get a single note by ID
  getNote: async (id: string): Promise<Note> => {
    const response = await api.get(`/notes/${id}`);
    return response.data.data.note;
  },

  // Create a new note
  createNote: async (data: CreateNoteData): Promise<Note> => {
    const response = await api.post('/notes', data);
    return response.data.data.note;
  },

  // Update an existing note
  updateNote: async (id: string, data: CreateNoteData): Promise<Note> => {
    const response = await api.put(`/notes/${id}`, data);
    return response.data.data.note;
  },

  // Delete a note
  deleteNote: async (id: string): Promise<ApiResponse> => {
    const response = await api.delete(`/notes/${id}`);
    return response.data;
  },

  // Get notes statistics
  getStats: async (): Promise<{
    totalNotes: number;
    recentNotes: number;
    popularTags: Array<{ _id: string; count: number }>;
  }> => {
    const response = await api.get('/notes/stats/overview');
    return response.data.data;
  },
};