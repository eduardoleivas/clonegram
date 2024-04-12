import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { INewPost, INewUser, IUpdatePost } from '@/types';
import { createPost, createUserAccount, deletePost, getCurrentUser, getInfinitePosts, getPostById, getRecentPosts, likePost, savePost, searchPosts, signInAccount, signOutAccount, unsavePost, updatePost } from '../appwrite/api';
import { QUERY_KEYS } from './queryKeys';
import { queryClient } from './QueryProvider';

export const useCreateUserAccount = () => {
  return useMutation({
    mutationFn: (user: INewUser) => createUserAccount(user),
  });
}

export const useSignInAccount = () => {
  return useMutation({
    mutationFn: (user: {
      email: string;
      password: string; }) => signInAccount(user),
  });
}

export const useSignOutAccount = () => {
  return useMutation({
    mutationFn: () => signOutAccount(),
  });
}

export const useGetCurrentUser = () => {
  return useQuery({
    queryKey:[QUERY_KEYS.GET_CURRENT_USER],
    queryFn: getCurrentUser,
  })
}

export const useCreatePost = () => {
  return useMutation({
    mutationFn: (post: INewPost) => createPost(post),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
      })
    }
  })
}

export const useUpdatePost = () => {
  return useMutation({
    mutationFn: (post: IUpdatePost) => updatePost(post),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
      })
    }
  })
}

export const useDeletePost = () => {
  return useMutation({
    mutationFn: ({ id_post, id_img }: { id_post: string, id_img: string }) => deletePost(id_post, id_img),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
      })
    }
  })
}

export const useGetPostById = (id_post: string) => {
  queryClient.invalidateQueries({
    queryKey: [QUERY_KEYS.GET_POST_BY_ID]
  })

  return useQuery({
    queryKey: [QUERY_KEYS.GET_POST_BY_ID],
    queryFn: () => getPostById(id_post),
    enabled: !!id_post,
    staleTime: 2000,
    }, queryClient)
}

export const useGetRecentPosts = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
    queryFn: getRecentPosts,
  })
}

export const useLikePost = () => {
  return useMutation({
    mutationFn: ({ id_post, likesArray }: { id_post: string; likesArray: string[] }) => likePost(id_post, likesArray),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id]
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS]
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER]
      })
    }
  })
}

export const useSavePost = () => {
  return useMutation({
    mutationFn: ({ id_post, id_user }: { id_post: string; id_user: string }) => savePost(id_post, id_user),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS]
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER]
      })
    }
  })
}

export const useUnsavePost = () => {
  return useMutation({
    mutationFn: (id_savedRecord: string) => unsavePost(id_savedRecord),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS]
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER]
      })
    }
  })
}

export const useGetPosts = () => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.GET_INFINITE_POSTS],
    queryFn: getInfinitePosts,
    initialPageParam: undefined,
    getNextPageParam: (lastPage: any) => {
      //NO DATA == NO MORE PAGES
      if (lastPage && lastPage.documents.length === 0) {
        return null;
      }

      //LAST DOCUMENT ID (NO REPEATING)
      const lastId = lastPage.documents[lastPage.documents.length - 1].$id;
      return lastId;
    },
  });
}

export const useSearchPosts = (searchTerm: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.SEARCH_POSTS],
    queryFn: () => searchPosts(searchTerm),
    enabled: !!searchTerm
  })
}


