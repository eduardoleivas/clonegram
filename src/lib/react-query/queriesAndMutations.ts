import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { QUERY_KEYS } from './queryKeys';
import { IComment, INewPost, INewUser, IUpdatePost, IUpdateUser } from '@/types';
import { createComment, createPost, createUserAccount, deletePost, getComments, getCurrentUser, getInfinitePosts,
  getPostById, getRecentPosts, getUserById, getUsers, likePost, savePost, searchPosts, signInAccount, signOutAccount,
  unsavePost, updatePost, updateUser } from '../appwrite/api';

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

export const useGetUsers = (limit?: number) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USERS],
    queryFn: () => getUsers(limit),
  })
}

export const useGetCurrentUser = () => {
  return useQuery({
    queryKey:[QUERY_KEYS.GET_CURRENT_USER],
    queryFn: getCurrentUser,
  })
}

export const useGetUserById = (id_user: string) => {
  const queryClient = useQueryClient();
  queryClient.invalidateQueries({
    queryKey: [QUERY_KEYS.GET_USER_BY_ID],
    refetchType: "all", 
  })

  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER_BY_ID],
    queryFn: () => getUserById(id_user),
    enabled: !!id_user,
    staleTime: 1,
    }, queryClient)
}

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (user: IUpdateUser) => updateUser(user),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER_BY_ID, data?.$id],
      });
    },
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (post: INewPost) => createPost(post),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
        refetchType: "all", 
      })
    }
  })
}

export const useUpdatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (post: IUpdatePost) => updatePost(post),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
        refetchType: "all", 
      })
    }
  })
}

export const useDeletePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id_post, id_img }: { id_post: string, id_img: string }) => deletePost(id_post, id_img),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
        refetchType: "all", 
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

export const useGetPostById = (id_post: string) => {
  const queryClient = useQueryClient();
  queryClient.invalidateQueries({
    queryKey: [QUERY_KEYS.GET_POST_BY_ID],
    refetchType: "all", 
  })

  return useQuery({
    queryKey: [QUERY_KEYS.GET_POST_BY_ID],
    queryFn: () => getPostById(id_post),
    enabled: !!id_post,
    staleTime: 1,
    }, queryClient)
}

export const useGetRecentPosts = () => {
  const queryClient = useQueryClient();
  queryClient.invalidateQueries({
    queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
  })

  return useQuery({
    queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
    queryFn: getRecentPosts,
    staleTime: 1,
  }, queryClient)
}

export const useLikePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id_post, likesArray }: { id_post: string; likesArray: string[] }) => likePost(id_post, likesArray),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID],
        refetchType: "all",
      })
      queryClient.removeQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS],
        refetchType: "all",
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
        refetchType: "all",
      })
    }
  })
}

export const useSavePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id_post, id_user }: { id_post: string; id_user: string }) => savePost(id_post, id_user),
    onSuccess: () => {
      queryClient.removeQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS],
        refetchType: "all",
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
        refetchType: "all",
      })
    }
  })
}

export const useUnsavePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id_savedRecord: string) => unsavePost(id_savedRecord),
    onSuccess: () => {
      queryClient.removeQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS],
        refetchType: "all", 
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
        refetchType: "all", 
      })
    }
  })
}

export const useSearchPosts = (searchTerm: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.SEARCH_POSTS, searchTerm],
    queryFn: () => searchPosts(searchTerm),
    enabled: !!searchTerm
  })
}

export const useCreateComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (comment: IComment) => createComment(comment),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_COMMENTS],
        refetchType: "all", 
      })
    }
  })
}

export const useGetComments = (id_post: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_POST_COMMENTS],
    queryFn: () => getComments(id_post),
  })
}