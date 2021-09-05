import type { Settings as LayoutSettings } from '@ant-design/pro-layout';
import { PageLoading } from '@ant-design/pro-layout';
import type { RequestConfig, RunTimeLayoutConfig } from 'umi';
import { history } from 'umi';
import RightContent from '@/components/RightContent';
import Footer from '@/components/Footer';
import { currentUser as queryCurrentUser } from './services/api/session';
import moment from 'moment-timezone';
import _ from 'lodash';

// const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/user/login';

/** 获取用户信息比较慢的时候会展示一个 loading */
export const initialStateConfig = {
  loading: <PageLoading />,
};

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: API.CurrentUser;
  fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
}> {
  const fetchUserInfo = async () => {
    try {
      const msg = await queryCurrentUser();
      return msg.data;
    } catch (error) {
      history.push(loginPath);
    }
    return undefined;
  };

  // Si  el usuario accede al sitio por primera vez y la URL es
  // diferente a la del formulario login, entonces, se intentara consultar
  // el perfil del usuario
  if (history.location.pathname !== loginPath) {
    const currentUser = await fetchUserInfo();
    return {
      fetchUserInfo,
      currentUser,
      settings: {},
    };
  }

  return {
    fetchUserInfo,
    settings: {},
  };
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState }) => {
  return {
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    waterMarkProps: {
      content: initialState?.currentUser?.name,
    },
    footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history;
      // 如果没有登录，重定向到 login
      if (!initialState?.currentUser && location.pathname !== loginPath) {
        history.push(loginPath);
      }
    },
    links: [],
    menuHeaderRender: undefined,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    ...initialState?.settings,
  };
};

const AddMiscHeadersInterceptor = (url: string, options: any) => {
  const headers = {
    ...options.headers,
    'X-Requested-With': 'XMLHttpRequest',
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  return {
    url,
    options: { ...options, interceptors: true, headers },
  };
};

const ChangeContentTypeIfFormData = (url: string, options: any) => {
  const headers: any = {
    ...options.headers,
  };

  if (options.body instanceof FormData) {
    // Esto lo haría automaticamente si no se utilizara AddMiscHeadersInterceptor
    delete headers['Content-Type'];

    if (String(options.method).toLowerCase() !== 'post') {
      const currentMethod = options.method;
      options.method = 'POST';
      options.body.append('_method', currentMethod);
    }
  }

  return {
    url,
    options: { ...options, interceptors: true, headers },
  };
};

const AddBearerTokenInterceptor = (url: string, options: any) => {
  const token = localStorage.getItem('token');

  if (token === null) {
    return {
      ...options,
      url,
    };
  }

  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
  };

  // if (url === '/landing') {
  //  omit token
  // }

  return {
    url,
    options: { ...options, interceptors: true, headers },
  };
};

function AttachUserTimeZoneInterceptor(url: string, options: any) {
  const timezone = moment.tz.guess();

  const headers = {
    ...options.headers,
    timezone,
  };

  return {
    url,
    options: { ...options, interceptors: true, headers },
  };
}

function TransformMethodInterceptor(url: string, options: any) {
  const method = String(options.method).toLowerCase();

  if (method === 'get') {
    //
  } else if (method !== 'post') {
    options.data = {
      ...options.data,
      _method: options.method,
    };

    options.method = 'POST';
  }

  return {
    url,
    options: { ...options, interceptors: true },
  };
}

export const request: RequestConfig = {
  requestInterceptors: [
    AddMiscHeadersInterceptor,
    AddBearerTokenInterceptor,
    ChangeContentTypeIfFormData,
    AttachUserTimeZoneInterceptor,
    TransformMethodInterceptor,
  ],
};
