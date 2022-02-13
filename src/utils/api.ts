import { objectToFormData } from '@/utils/form';
import request from '@/utils/request';

export function simpleCrud<M, CP, FI, SL = unknown, EM = unknown>(
  name: string,
  extraMethods?: EM,
): API.SimpleCrud<M, CP, FI, SL, EM> {
  return {
    find: async (id: string, data?: any, options?: any) => {
      return request<API.Response<M>>(`/api/v1/${name}/${id}`, {
        ...options,
        method: 'GET',
        params: data,
      });
    },
    edit: async (id: string, data?: any, options?: any) => {
      return request<API.Response<M>>(`/api/v1/${name}/${id}/edit`, {
        ...options,
        method: 'GET',
      });
    },
    all: async (data?: CP, options?: any) => {
      return request<API.CollectionResponse<M>>(`/api/v1/${name}`, {
        ...options,
        method: 'GET',
        params: data,
      });
    },
    select: async (data?: CP, options?: any) => {
      const newData: any = { ...data, select: true };

      return request<API.CollectionResponse<SL>>(`/api/v1/${name}`, {
        ...options,
        method: 'GET',
        params: newData,
      });
    },
    store: async (data: Partial<FI>, options?: any) => {
      const formData = objectToFormData(data);
      return request<API.Response<M>>(`/api/v1/${name}`, {
        ...options,
        method: 'POST',
        body: formData,
      });
    },
    update: async (id: string, data: Partial<FI & API.OnlyTrashed>, options?: any) => {
      const formData = objectToFormData(data);
      return request<API.Response<M>>(`/api/v1/${name}/${id}`, {
        ...options,
        method: 'PUT',
        body: formData,
      });
    },
    destroy: async (id: string, data?: any, options?: any) => {
      return request<API.SimpleResponse>(`/api/v1/${name}/${id}`, {
        ...options,
        method: 'DELETE',
        data,
      });
    },
    restore: async (id: string, data?: any, options?: any) => {
      return request<API.SimpleResponse>(`/api/v1/${name}/${id}/restore`, {
        ...options,
        method: 'POST',
        data,
      });
    },
    ...extraMethods!,
  };
}
