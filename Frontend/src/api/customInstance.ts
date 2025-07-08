import httpUtil from '@/utils/httpUtil';
import type { AxiosRequestConfig } from 'axios';


/**
 * Orval inyecta en `config` la URL, método, body, params, etc.
 * Devolvemos la Promise del request de tu instancia Axios.
 */
export const customInstance = <T = unknown>(config: AxiosRequestConfig) =>
  httpUtil.request<T>(config);
