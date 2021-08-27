// @ts-ignore
/* eslint-disable */

declare namespace API {
  type Response<T = {}> = {
    success: boolean;
    errorCode?: string;
    errorMessage?: string;
    message?: string;
    data: T;
  };

  type SimpleResponse = {
    success: boolean;
    message?: string;
  };

  type CollectionResponse<T> = Response<T[]> & { total: number };

  type PaginationParams<T> = T & {
    pageSize: number;
    current: number;
  };

  namespace Difficulties {
    type CollectionParams = PaginationParams<Model>;

    type Model = {
      id: string;
      name: string;
      description: string;
      created_at: string;
      updated_at: string;
      deleted_at: string;
    };

    type FormInput = Pick<Model, 'name' | 'description'>;
  }

  type CurrentUser = {
    name?: string;
    avatar?: string;
    userid?: string;
    email?: string;
    signature?: string;
    title?: string;
    group?: string;
    tags?: { key?: string; label?: string }[];
    notifyCount?: number;
    unreadCount?: number;
    country?: string;
    access?: string;
    geographic?: {
      province?: { label?: string; key?: string };
      city?: { label?: string; key?: string };
    };
    address?: string;
    phone?: string;
  };

  type LoginResult = {
    success?: boolean;
    data?: {
      status?: string;
      authority?: string;
      token: string;
    };
  };

  type PageParams = {
    current?: number;
    pageSize?: number;
  };

  type FakeCaptcha = {
    code?: number;
    status?: string;
  };

  type LoginParams = {
    username?: string;
    password?: string;
    autoLogin?: boolean;
  };

  type ErrorResponse = {
    errorCode: string;
    errorMessage?: string;
    success?: boolean;
  };

  type NoticeIconList = {
    data?: NoticeIconItem[];
    total?: number;
    success?: boolean;
  };

  type NoticeIconItemType = 'notification' | 'message' | 'event';

  type NoticeIconItem = {
    id?: string;
    extra?: string;
    key?: string;
    read?: boolean;
    avatar?: string;
    title?: string;
    status?: string;
    datetime?: string;
    description?: string;
    type?: NoticeIconItemType;
  };
}
