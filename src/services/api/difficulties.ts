// @ts-ignore
/* eslint-disable */
import request, { RequestOptions } from '@/utils/request';

export async function find(id: string, options: any = {}) {
  return request<API.Response<API.Difficulties.Model>>(`/api/v1/difficulties/${id}`, {
    ...options,
    method: 'GET',
  });
}

export async function all(data: any, options?: RequestOptions) {
  return request<API.CollectionResponse<API.Difficulties.Model>>(`/api/v1/difficulties`, {
    ...options,
    method: 'GET',
    params: data,
  });
}

export async function store(data: Partial<API.Difficulties.Model>, options: any = {}) {
  return request<API.Response<API.Difficulties.Model>>(`/api/v1/difficulties`, {
    ...options,
    method: 'POST',
    data,
  });
}

export async function update(id: string, data: Partial<API.Difficulties.Model>, options: any = {}) {
  return request<API.Response<API.Difficulties.Model>>(`/api/v1/difficulties/${id}`, {
    ...options,
    method: 'PUT',
    data,
  });
}

export async function destroy(id: string, options: any = {}) {
  return request<API.SimpleResponse>(`/api/v1/difficulties/${id}`, {
    ...options,
    method: 'DELETE',
  });
}
