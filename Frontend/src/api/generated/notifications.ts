/**
 * Generated by orval v7.8.0 🍺
 * Do not edit manually.
 * TMB Control API
 * OpenAPI spec version: v1
 */
import {
  useMutation,
  useQuery
} from '@tanstack/react-query';
import type {
  DataTag,
  DefinedInitialDataOptions,
  DefinedUseQueryResult,
  MutationFunction,
  QueryClient,
  QueryFunction,
  QueryKey,
  UndefinedInitialDataOptions,
  UseMutationOptions,
  UseMutationResult,
  UseQueryOptions,
  UseQueryResult
} from '@tanstack/react-query';

import type {
  CustomProblemDetails,
  GetUserNotificationsParams,
  UserNotificationDto
} from './model';

import { customInstance } from '../customInstance';





/**
 * Get notifications for the current user
 * @summary Get user notifications
 */
export const getUserNotifications = (
    params: GetUserNotificationsParams,
 signal?: AbortSignal
) => {
      
      
      return customInstance<UserNotificationDto[]>(
      {url: `/api/notifications/me`, method: 'GET',
        params, signal
    },
      );
    }
  

export const getGetUserNotificationsQueryKey = (params: GetUserNotificationsParams,) => {
    return [`/api/notifications/me`, ...(params ? [params]: [])] as const;
    }

    
export const getGetUserNotificationsQueryOptions = <TData = Awaited<ReturnType<typeof getUserNotifications>>, TError = CustomProblemDetails>(params: GetUserNotificationsParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getUserNotifications>>, TError, TData>>, }
) => {

const {query: queryOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetUserNotificationsQueryKey(params);

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getUserNotifications>>> = ({ signal }) => getUserNotifications(params, signal);

      

      

   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getUserNotifications>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetUserNotificationsQueryResult = NonNullable<Awaited<ReturnType<typeof getUserNotifications>>>
export type GetUserNotificationsQueryError = CustomProblemDetails


export function useGetUserNotifications<TData = Awaited<ReturnType<typeof getUserNotifications>>, TError = CustomProblemDetails>(
 params: GetUserNotificationsParams, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof getUserNotifications>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getUserNotifications>>,
          TError,
          Awaited<ReturnType<typeof getUserNotifications>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetUserNotifications<TData = Awaited<ReturnType<typeof getUserNotifications>>, TError = CustomProblemDetails>(
 params: GetUserNotificationsParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getUserNotifications>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getUserNotifications>>,
          TError,
          Awaited<ReturnType<typeof getUserNotifications>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetUserNotifications<TData = Awaited<ReturnType<typeof getUserNotifications>>, TError = CustomProblemDetails>(
 params: GetUserNotificationsParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getUserNotifications>>, TError, TData>>, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary Get user notifications
 */

export function useGetUserNotifications<TData = Awaited<ReturnType<typeof getUserNotifications>>, TError = CustomProblemDetails>(
 params: GetUserNotificationsParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getUserNotifications>>, TError, TData>>, }
 , queryClient?: QueryClient 
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetUserNotificationsQueryOptions(params,options)

  const query = useQuery(queryOptions , queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}



/**
 * Mark a specific notification as read by the current user
 * @summary Mark notification as read
 */
export const markNotificationAsRead = (
    id: string,
 ) => {
      
      
      return customInstance<void>(
      {url: `/api/notifications/${id}/read`, method: 'PATCH'
    },
      );
    }
  


export const getMarkNotificationAsReadMutationOptions = <TError = CustomProblemDetails,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof markNotificationAsRead>>, TError,{id: string}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<typeof markNotificationAsRead>>, TError,{id: string}, TContext> => {
    
const mutationKey = ['markNotificationAsRead'];
const {mutation: mutationOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof markNotificationAsRead>>, {id: string}> = (props) => {
          const {id} = props ?? {};

          return  markNotificationAsRead(id,)
        }

        


  return  { mutationFn, ...mutationOptions }}

    export type MarkNotificationAsReadMutationResult = NonNullable<Awaited<ReturnType<typeof markNotificationAsRead>>>
    
    export type MarkNotificationAsReadMutationError = CustomProblemDetails

    /**
 * @summary Mark notification as read
 */
export const useMarkNotificationAsRead = <TError = CustomProblemDetails,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof markNotificationAsRead>>, TError,{id: string}, TContext>, }
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof markNotificationAsRead>>,
        TError,
        {id: string},
        TContext
      > => {

      const mutationOptions = getMarkNotificationAsReadMutationOptions(options);

      return useMutation(mutationOptions , queryClient);
    }
    