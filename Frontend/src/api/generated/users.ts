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
  CreateRoleRequest,
  CreateRoleResponse,
  CreateUserRequest,
  CustomProblemDetails,
  UpdateRoleRequest,
  UpdateRoleResponse,
  UpdateUserRequest,
  UserDto,
  UserMasterDataDto
} from './model';

import { customInstance } from '../customInstance';





/**
 * Ping endpoint for the Users module
 * @summary Ping endpoint for the Users module
 */
export const pingUsers = (
    
 signal?: AbortSignal
) => {
      
      
      return customInstance<unknown>(
      {url: `/api/users/ping`, method: 'GET', signal
    },
      );
    }
  

export const getPingUsersQueryKey = () => {
    return [`/api/users/ping`] as const;
    }

    
export const getPingUsersQueryOptions = <TData = Awaited<ReturnType<typeof pingUsers>>, TError = CustomProblemDetails>( options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof pingUsers>>, TError, TData>>, }
) => {

const {query: queryOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getPingUsersQueryKey();

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof pingUsers>>> = ({ signal }) => pingUsers(signal);

      

      

   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof pingUsers>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type PingUsersQueryResult = NonNullable<Awaited<ReturnType<typeof pingUsers>>>
export type PingUsersQueryError = CustomProblemDetails


export function usePingUsers<TData = Awaited<ReturnType<typeof pingUsers>>, TError = CustomProblemDetails>(
  options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof pingUsers>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof pingUsers>>,
          TError,
          Awaited<ReturnType<typeof pingUsers>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function usePingUsers<TData = Awaited<ReturnType<typeof pingUsers>>, TError = CustomProblemDetails>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof pingUsers>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof pingUsers>>,
          TError,
          Awaited<ReturnType<typeof pingUsers>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function usePingUsers<TData = Awaited<ReturnType<typeof pingUsers>>, TError = CustomProblemDetails>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof pingUsers>>, TError, TData>>, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary Ping endpoint for the Users module
 */

export function usePingUsers<TData = Awaited<ReturnType<typeof pingUsers>>, TError = CustomProblemDetails>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof pingUsers>>, TError, TData>>, }
 , queryClient?: QueryClient 
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getPingUsersQueryOptions(options)

  const query = useQuery(queryOptions , queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}



/**
 * Get all users with roles and permissions
 * @summary Get all users
 */
export const getAllUsers = (
    
 signal?: AbortSignal
) => {
      
      
      return customInstance<UserDto[]>(
      {url: `/api/users`, method: 'GET', signal
    },
      );
    }
  

export const getGetAllUsersQueryKey = () => {
    return [`/api/users`] as const;
    }

    
export const getGetAllUsersQueryOptions = <TData = Awaited<ReturnType<typeof getAllUsers>>, TError = CustomProblemDetails>( options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getAllUsers>>, TError, TData>>, }
) => {

const {query: queryOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetAllUsersQueryKey();

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getAllUsers>>> = ({ signal }) => getAllUsers(signal);

      

      

   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getAllUsers>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetAllUsersQueryResult = NonNullable<Awaited<ReturnType<typeof getAllUsers>>>
export type GetAllUsersQueryError = CustomProblemDetails


export function useGetAllUsers<TData = Awaited<ReturnType<typeof getAllUsers>>, TError = CustomProblemDetails>(
  options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof getAllUsers>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getAllUsers>>,
          TError,
          Awaited<ReturnType<typeof getAllUsers>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetAllUsers<TData = Awaited<ReturnType<typeof getAllUsers>>, TError = CustomProblemDetails>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getAllUsers>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getAllUsers>>,
          TError,
          Awaited<ReturnType<typeof getAllUsers>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetAllUsers<TData = Awaited<ReturnType<typeof getAllUsers>>, TError = CustomProblemDetails>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getAllUsers>>, TError, TData>>, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary Get all users
 */

export function useGetAllUsers<TData = Awaited<ReturnType<typeof getAllUsers>>, TError = CustomProblemDetails>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getAllUsers>>, TError, TData>>, }
 , queryClient?: QueryClient 
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetAllUsersQueryOptions(options)

  const query = useQuery(queryOptions , queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}



/**
 * Create a new user
 * @summary Create user
 */
export const createUser = (
    createUserRequest: CreateUserRequest,
 signal?: AbortSignal
) => {
      
      
      return customInstance<string>(
      {url: `/api/users`, method: 'POST',
      headers: {'Content-Type': 'application/json', },
      data: createUserRequest, signal
    },
      );
    }
  


export const getCreateUserMutationOptions = <TError = CustomProblemDetails,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof createUser>>, TError,{data: CreateUserRequest}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<typeof createUser>>, TError,{data: CreateUserRequest}, TContext> => {
    
const mutationKey = ['createUser'];
const {mutation: mutationOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof createUser>>, {data: CreateUserRequest}> = (props) => {
          const {data} = props ?? {};

          return  createUser(data,)
        }

        


  return  { mutationFn, ...mutationOptions }}

    export type CreateUserMutationResult = NonNullable<Awaited<ReturnType<typeof createUser>>>
    export type CreateUserMutationBody = CreateUserRequest
    export type CreateUserMutationError = CustomProblemDetails

    /**
 * @summary Create user
 */
export const useCreateUser = <TError = CustomProblemDetails,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof createUser>>, TError,{data: CreateUserRequest}, TContext>, }
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof createUser>>,
        TError,
        {data: CreateUserRequest},
        TContext
      > => {

      const mutationOptions = getCreateUserMutationOptions(options);

      return useMutation(mutationOptions , queryClient);
    }
    /**
 * Get a user by their ID including role and permissions
 * @summary Get user by ID
 */
export const getUserById = (
    id: string,
 signal?: AbortSignal
) => {
      
      
      return customInstance<UserDto>(
      {url: `/api/users/${id}`, method: 'GET', signal
    },
      );
    }
  

export const getGetUserByIdQueryKey = (id: string,) => {
    return [`/api/users/${id}`] as const;
    }

    
export const getGetUserByIdQueryOptions = <TData = Awaited<ReturnType<typeof getUserById>>, TError = CustomProblemDetails>(id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getUserById>>, TError, TData>>, }
) => {

const {query: queryOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetUserByIdQueryKey(id);

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getUserById>>> = ({ signal }) => getUserById(id, signal);

      

      

   return  { queryKey, queryFn, enabled: !!(id), ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getUserById>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetUserByIdQueryResult = NonNullable<Awaited<ReturnType<typeof getUserById>>>
export type GetUserByIdQueryError = CustomProblemDetails


export function useGetUserById<TData = Awaited<ReturnType<typeof getUserById>>, TError = CustomProblemDetails>(
 id: string, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof getUserById>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getUserById>>,
          TError,
          Awaited<ReturnType<typeof getUserById>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetUserById<TData = Awaited<ReturnType<typeof getUserById>>, TError = CustomProblemDetails>(
 id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getUserById>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getUserById>>,
          TError,
          Awaited<ReturnType<typeof getUserById>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetUserById<TData = Awaited<ReturnType<typeof getUserById>>, TError = CustomProblemDetails>(
 id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getUserById>>, TError, TData>>, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary Get user by ID
 */

export function useGetUserById<TData = Awaited<ReturnType<typeof getUserById>>, TError = CustomProblemDetails>(
 id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getUserById>>, TError, TData>>, }
 , queryClient?: QueryClient 
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetUserByIdQueryOptions(id,options)

  const query = useQuery(queryOptions , queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}



/**
 * Update an existing user
 * @summary Update user
 */
export const updateUser = (
    id: string,
    updateUserRequest: UpdateUserRequest,
 ) => {
      
      
      return customInstance<void>(
      {url: `/api/users/${id}`, method: 'PUT',
      headers: {'Content-Type': 'application/json', },
      data: updateUserRequest
    },
      );
    }
  


export const getUpdateUserMutationOptions = <TError = CustomProblemDetails,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof updateUser>>, TError,{id: string;data: UpdateUserRequest}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<typeof updateUser>>, TError,{id: string;data: UpdateUserRequest}, TContext> => {
    
const mutationKey = ['updateUser'];
const {mutation: mutationOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof updateUser>>, {id: string;data: UpdateUserRequest}> = (props) => {
          const {id,data} = props ?? {};

          return  updateUser(id,data,)
        }

        


  return  { mutationFn, ...mutationOptions }}

    export type UpdateUserMutationResult = NonNullable<Awaited<ReturnType<typeof updateUser>>>
    export type UpdateUserMutationBody = UpdateUserRequest
    export type UpdateUserMutationError = CustomProblemDetails

    /**
 * @summary Update user
 */
export const useUpdateUser = <TError = CustomProblemDetails,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof updateUser>>, TError,{id: string;data: UpdateUserRequest}, TContext>, }
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof updateUser>>,
        TError,
        {id: string;data: UpdateUserRequest},
        TContext
      > => {

      const mutationOptions = getUpdateUserMutationOptions(options);

      return useMutation(mutationOptions , queryClient);
    }
    /**
 * Delete a user by ID
 * @summary Delete user
 */
export const deleteUser = (
    id: string,
 ) => {
      
      
      return customInstance<void>(
      {url: `/api/users/${id}`, method: 'DELETE'
    },
      );
    }
  


export const getDeleteUserMutationOptions = <TError = CustomProblemDetails,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof deleteUser>>, TError,{id: string}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<typeof deleteUser>>, TError,{id: string}, TContext> => {
    
const mutationKey = ['deleteUser'];
const {mutation: mutationOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof deleteUser>>, {id: string}> = (props) => {
          const {id} = props ?? {};

          return  deleteUser(id,)
        }

        


  return  { mutationFn, ...mutationOptions }}

    export type DeleteUserMutationResult = NonNullable<Awaited<ReturnType<typeof deleteUser>>>
    
    export type DeleteUserMutationError = CustomProblemDetails

    /**
 * @summary Delete user
 */
export const useDeleteUser = <TError = CustomProblemDetails,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof deleteUser>>, TError,{id: string}, TContext>, }
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof deleteUser>>,
        TError,
        {id: string},
        TContext
      > => {

      const mutationOptions = getDeleteUserMutationOptions(options);

      return useMutation(mutationOptions , queryClient);
    }
    /**
 * Get roles and available permissions for user management
 * @summary Get user master data
 */
export const getUserMasterData = (
    
 signal?: AbortSignal
) => {
      
      
      return customInstance<UserMasterDataDto>(
      {url: `/api/users/master-data`, method: 'GET', signal
    },
      );
    }
  

export const getGetUserMasterDataQueryKey = () => {
    return [`/api/users/master-data`] as const;
    }

    
export const getGetUserMasterDataQueryOptions = <TData = Awaited<ReturnType<typeof getUserMasterData>>, TError = CustomProblemDetails>( options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getUserMasterData>>, TError, TData>>, }
) => {

const {query: queryOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetUserMasterDataQueryKey();

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getUserMasterData>>> = ({ signal }) => getUserMasterData(signal);

      

      

   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getUserMasterData>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetUserMasterDataQueryResult = NonNullable<Awaited<ReturnType<typeof getUserMasterData>>>
export type GetUserMasterDataQueryError = CustomProblemDetails


export function useGetUserMasterData<TData = Awaited<ReturnType<typeof getUserMasterData>>, TError = CustomProblemDetails>(
  options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof getUserMasterData>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getUserMasterData>>,
          TError,
          Awaited<ReturnType<typeof getUserMasterData>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetUserMasterData<TData = Awaited<ReturnType<typeof getUserMasterData>>, TError = CustomProblemDetails>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getUserMasterData>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getUserMasterData>>,
          TError,
          Awaited<ReturnType<typeof getUserMasterData>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetUserMasterData<TData = Awaited<ReturnType<typeof getUserMasterData>>, TError = CustomProblemDetails>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getUserMasterData>>, TError, TData>>, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary Get user master data
 */

export function useGetUserMasterData<TData = Awaited<ReturnType<typeof getUserMasterData>>, TError = CustomProblemDetails>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getUserMasterData>>, TError, TData>>, }
 , queryClient?: QueryClient 
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetUserMasterDataQueryOptions(options)

  const query = useQuery(queryOptions , queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}



/**
 * Create a new user role
 * @summary Create role
 */
export const createRole = (
    createRoleRequest: CreateRoleRequest,
 signal?: AbortSignal
) => {
      
      
      return customInstance<CreateRoleResponse>(
      {url: `/api/users/roles`, method: 'POST',
      headers: {'Content-Type': 'application/json', },
      data: createRoleRequest, signal
    },
      );
    }
  


export const getCreateRoleMutationOptions = <TError = CustomProblemDetails,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof createRole>>, TError,{data: CreateRoleRequest}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<typeof createRole>>, TError,{data: CreateRoleRequest}, TContext> => {
    
const mutationKey = ['createRole'];
const {mutation: mutationOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof createRole>>, {data: CreateRoleRequest}> = (props) => {
          const {data} = props ?? {};

          return  createRole(data,)
        }

        


  return  { mutationFn, ...mutationOptions }}

    export type CreateRoleMutationResult = NonNullable<Awaited<ReturnType<typeof createRole>>>
    export type CreateRoleMutationBody = CreateRoleRequest
    export type CreateRoleMutationError = CustomProblemDetails

    /**
 * @summary Create role
 */
export const useCreateRole = <TError = CustomProblemDetails,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof createRole>>, TError,{data: CreateRoleRequest}, TContext>, }
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof createRole>>,
        TError,
        {data: CreateRoleRequest},
        TContext
      > => {

      const mutationOptions = getCreateRoleMutationOptions(options);

      return useMutation(mutationOptions , queryClient);
    }
    /**
 * Update an existing user role
 * @summary Update role
 */
export const updateRole = (
    id: string,
    updateRoleRequest: UpdateRoleRequest,
 ) => {
      
      
      return customInstance<UpdateRoleResponse>(
      {url: `/api/users/roles/${id}`, method: 'PUT',
      headers: {'Content-Type': 'application/json', },
      data: updateRoleRequest
    },
      );
    }
  


export const getUpdateRoleMutationOptions = <TError = CustomProblemDetails,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof updateRole>>, TError,{id: string;data: UpdateRoleRequest}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<typeof updateRole>>, TError,{id: string;data: UpdateRoleRequest}, TContext> => {
    
const mutationKey = ['updateRole'];
const {mutation: mutationOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof updateRole>>, {id: string;data: UpdateRoleRequest}> = (props) => {
          const {id,data} = props ?? {};

          return  updateRole(id,data,)
        }

        


  return  { mutationFn, ...mutationOptions }}

    export type UpdateRoleMutationResult = NonNullable<Awaited<ReturnType<typeof updateRole>>>
    export type UpdateRoleMutationBody = UpdateRoleRequest
    export type UpdateRoleMutationError = CustomProblemDetails

    /**
 * @summary Update role
 */
export const useUpdateRole = <TError = CustomProblemDetails,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof updateRole>>, TError,{id: string;data: UpdateRoleRequest}, TContext>, }
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof updateRole>>,
        TError,
        {id: string;data: UpdateRoleRequest},
        TContext
      > => {

      const mutationOptions = getUpdateRoleMutationOptions(options);

      return useMutation(mutationOptions , queryClient);
    }
    