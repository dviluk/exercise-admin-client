// @ts-ignore
/* eslint-disable */

declare namespace API {
  type SimpleCrud<
    /**
     * Model
     */
    M,
    /**
     * CollectionParams
     */
    CP,
    /**
     * FormInput
     */
    FI,
    /**
     * Select
     */
    SL,
    /**
     * ExtraMethods
     */
    EM = {},
  > = {
    find: (id: string, data?: any, options?: any) => Promise<API.Response<M>>;
    all: (data?: CP) => Promise<API.CollectionResponse<M>>;
    select: (data?: CP) => Promise<API.Response<SL>>;
    store: (data: Partial<FI>, options?: any) => Promise<API.Response<M>>;
    update: (
      id: string,
      data: Partial<FI & API.OnlyTrashed>,
      options?: any,
    ) => Promise<API.Response<M>>;
    destroy: (id: string, data?: any, options?: any) => Promise<API.SimpleResponse>;
    restore: (id: string, data?: any, options?: any) => Promise<API.SimpleResponse>;
  } & EM;

  type Model<M> = {
    id: string;
  } & M;

  type Response<T = {}> = {
    success: boolean;
    errorCode?: string;
    errorMessage?: string;
    message?: string;
    data: T;
  };

  type OnlyTrashed = {
    onlyTrashed?: boolean;
  };

  type SimpleResponse = {
    success: boolean;
    message?: string;
  };

  type CollectionResponse<T> = Response<T[]> & { total: number };

  type PaginationParams<T> = T & {
    pageSize: number;
    current: number;
    select?: boolean;
  } & OnlyTrashed;

  type DefaultSelect<T = {}> = T & { value: string; label: string };

  namespace Difficulties {
    type TableParams = PaginationParams<
      Pick<Model, 'name'> & { created_at_range: [string, string] }
    >;

    type CollectionParams = PaginationParams<Pick<Model, 'name'>>;

    type Select = DefaultSelect[];

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

  namespace Equipment {
    type TableParams = PaginationParams<
      Pick<Model, 'name'> & { created_at_range: [string, string] }
    >;

    type CollectionParams = Partial<PaginationParams<Pick<Model, 'name'>> & { created_at: string }>;

    type Model = {
      id: string;
      image_url: string;
      image_thumbnail_url: string;
      name: string;
      description: string;
      created_at: string;
      updated_at: string;
      deleted_at: string;
    };

    type FormInput = Pick<Model, 'name' | 'description'> & { image: File };
  }

  namespace Goals {
    type TableParams = PaginationParams<
      Pick<Model, 'name'> & { created_at_range: [string, string] }
    >;

    type CollectionParams = Partial<PaginationParams<Pick<Model, 'name'>> & { created_at: string }>;

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

  namespace Muscles {
    type TableParams = PaginationParams<
      Pick<Model, 'name'> & { created_at_range: [string, string] }
    >;

    type CollectionParams = Partial<PaginationParams<Pick<Model, 'name'>> & { created_at: string }>;

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

  namespace Tags {
    type TableParams = PaginationParams<
      Pick<Model, 'name'> & { created_at_range: [string, string] }
    >;

    type CollectionParams = Partial<PaginationParams<Pick<Model, 'name'>> & { created_at: string }>;

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

  namespace Units {
    type TableParams = PaginationParams<
      Pick<Model, 'name'> & { created_at_range: [string, string] }
    >;

    type CollectionParams = Partial<PaginationParams<Pick<Model, 'name'>> & { created_at: string }>;

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

  namespace ExerciseGroups {
    type TableParams = PaginationParams<
      Pick<Model, 'name'> & { created_at_range: [string, string] }
    >;

    type CollectionParams = Partial<PaginationParams<Pick<Model, 'name'>> & { created_at: string }>;

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

  namespace Exercises {
    type TableParams = PaginationParams<
      Pick<Model, 'name' | 'difficulty_id'> & { created_at_range: [string, string] }
    >;

    type CollectionParams = Partial<
      PaginationParams<Pick<Model, 'name' | 'difficulty_id'>> & { created_at: string }
    >;

    type Model = {
      id: string;
      difficulty_id: string;
      image: string;
      image_url: string;
      image_thumbnail: string;
      image_thumbnail_url: string;
      illustration: string;
      illustration_url: string;
      illustration_thumbnail: string;
      illustration_thumbnail_url: string;
      name: string;
      description: string;
      created_at: string;
      updated_at: string;
      deleted_at: string;
    };

    type FormInput = Pick<Model, 'name' | 'description' | 'difficulty_id'> & {
      image: File;
      illustration: File;
    };
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
