import { ID, Query } from "appwrite";
import { account, appwriteConfig, avatars, databases, storage } from "./config";
import { IComment, INewPost, INewUser, IUpdatePost, IUpdateUser } from "@/types";

export async function createUserAccount(user: INewUser) {
  try {
    const newAccount = await account.create(
      ID.unique(),
      user.email,
      user.password,
      user.name
    );

    if(!newAccount) throw Error;

    const avatarUrl = avatars.getInitials(user.name);
    const newUser = await saveUserToDB({
      id_user: newAccount.$id,
      email: newAccount.email,
      name: newAccount.name,
      username: user.username,
      url_img: avatarUrl,
      id_img: user.username+"="+avatarUrl
    })

    return newUser;
  } catch (error) {
    console.log(error);

    return error;
  }
}

export async function saveUserToDB(user: {
  id_user: string;
  email: string;
  name: string;
  url_img: URL;
  id_img?: string;
  username?: string;
}) {
  try {
    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      user,
    )

    return newUser;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export async function signInAccount(user: {email: string; password: string;}) {
  try {
    const session = await account.createEmailSession(user.email, user.password);
    
    return session;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export async function signOutAccount() {
  try {
    const session = await account.deleteSession("current");
    
    return session;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export async function getUsers(limit?: number) {
  try {
    if(!limit) {
      const users = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        [Query.orderAsc("$createdAt")],
      );
  
      if(!users) throw Error;
      return users;
    }

    const users = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.orderAsc("$createdAt"), Query.limit(limit)],
    );

    if(!users) throw Error;
    return users;
  } catch (error) {
    console.log(error);
  }
}

export async function getCurrentUser() {
  try {
    const currentAccount = await account.get();
    if(!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal('id_user', currentAccount.$id)]
    )
    if(!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
  }
}

export async function getUserById(id_user: string) {
  const user = await databases.getDocument(
    appwriteConfig.databaseId,
    appwriteConfig.userCollectionId,
    id_user,
  )

  if(!user) throw Error;
  return user;
}

export async function updateUser(user: IUpdateUser) {
  try {
    //GET USER BEFORE UPDATE
    const oldUser = await getUserById(user.id_user);
    let updImgUrl = oldUser?.url_img;
    let updImgId = oldUser?.id_img;

    if(user.file.length > 0) {
      //UPLOAD IMAGE TO APPWRITE STORAGE
      const uploadedFile = await uploadFile(user.file[0]);
      if(!uploadedFile) throw Error;

      //GET IMG URL FROM APPWRITE STORAGE
      const fileURL = getFilePreview(uploadedFile.$id);
      if(!fileURL) {
        deleteFile(uploadedFile.$id);
        throw Error;
      }

      updImgUrl = fileURL;
      updImgId = uploadedFile.$id;
    }

    //SAVE UPDATED USER TO DATABASE
    const updatedUser = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      user.id_user,
      {
        name: user.name,
        bio: user.bio,
        url_img: updImgUrl,
        id_img: updImgId,
      }
    );

    if(!updatedUser) {
      await deleteFile(updImgId);
      throw Error;
    } else if(updatedUser && user.file.length > 0) {
      await deleteFile(updatedUser?.id_img);
      throw Error;
    }
      
    return updatedUser;
  } catch (error) {
    console.log(error)
  }
}

export async function uploadFile(file: File) {
  try {
    const uploadedFile = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      file
    );

    return uploadedFile;
  } catch (error) {
    console.log(error);
  }
}

export function getFilePreview(fileId: string) {
  try {
    const fileURL = storage.getFilePreview(
      appwriteConfig.storageId, fileId)

    return fileURL;
  } catch (error) {
    console.log(error);
  }
}

export async function deleteFile(fileId: string) {
  try {
    await storage.deleteFile(
      appwriteConfig.storageId,
      fileId,
    )

    return {status: "ok"};
  } catch (error) {
    console.log(error);
  }
}

export async function createPost(post: INewPost) {
  try {
    //UPLOAD IMAGE TO APPWRITE STORAGE
    const uploadedFile = await uploadFile(post.file[0]);
    if(!uploadedFile) throw Error;

    //GET IMG URL FROM APPWRITE STORAGE
    const fileURL = getFilePreview(uploadedFile.$id);
    if(!fileURL) {
      deleteFile(uploadedFile.$id);
      throw Error;
    }

    //CONVERT TAGS INTO ARRAY
    const tags = post.tags?.replace(/ /g,"").split(",") || [];

    //SAVE POST TO DATABASE
    const newPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      ID.unique(),
      {
        id_creator: post.id_creator,
        caption: post.caption,
        url_img: fileURL,
        id_img: uploadedFile.$id,
        location: post.location,
        tag: tags,
      }

    )

    if(!newPost) {
      await deleteFile(uploadedFile.$id);
      throw Error;
    }

    return newPost;
  } catch (error) {
    console.log(error)
  }
}

export async function updatePost(post: IUpdatePost) {
  try {
    //GET POST BEFORE UPDATE
    const oldPost = await getPostById(post.id_post);
    let updImgUrl = oldPost?.url_img;
    let updImgId = oldPost?.id_img;

    if(post.file.length > 0) {
      //UPLOAD IMAGE TO APPWRITE STORAGE
      const uploadedFile = await uploadFile(post.file[0]);
      if(!uploadedFile) throw Error;

      //GET IMG URL FROM APPWRITE STORAGE
      const fileURL = getFilePreview(uploadedFile.$id);
      if(!fileURL) {
        deleteFile(uploadedFile.$id);
        throw Error;
      }

      updImgUrl = fileURL;
      updImgId = uploadedFile.$id;
    }

    //CONVERT TAGS INTO ARRAY
    const tags = post.tags?.replace(/ /g,"").split(",") || [];

    //SAVE UPDATED POST TO DATABASE
    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      post.id_post,
      {
        caption: post.caption,
        url_img: updImgUrl,
        id_img: updImgId,
        location: post.location,
        tag: tags,
      }
    )

    if(!updatedPost) {
      await deleteFile(updImgId);
      throw Error;
    } else if(updatedPost && post.file.length > 0) {
      await deleteFile(oldPost?.id_img);
      throw Error;
    }
    
    return updatedPost;
  } catch (error) {
    console.log(error)
  }
}

export async function deletePost(id_post: string, id_img: string) {
  if(!id_post || id_img) throw Error;

  try {
    await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      id_post,
    )

    return { status: "ok" };
  } catch (error) {
    console.log(error);
  }
}

export async function getInfinitePosts({ pageParam }: {pageParam: number}) {
  const queries: any[] = [Query.orderDesc("$updatedAt"), Query.limit(10)]

  if(pageParam) {
    queries.push(Query.cursorAfter(pageParam.toString()));
  }

  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      queries
    )

    if(!posts) throw Error;

    return posts;
  } catch (error) {
    console.log(error);
  }
}

export async function getPostById(id_post: string) {
  try {
    const post = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      id_post,
    );

    return post;
  } catch (error) {
    console.log(error);
  }
}

export async function getRecentPosts() {
  const posts = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.postCollectionId,
    [Query.orderDesc("$createdAt"), Query.limit(20)]
  )

  if(!posts) throw Error;
  return posts;
}

export async function likePost(id_post: string, likesArray: string[]) {
  try {
    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      id_post,
      { likes: likesArray }
    )

    if(!updatedPost) throw Error;

    return updatedPost;
  } catch(error) {
    console.log(error);
  }
}

export async function savePost(id_post: string, id_user: string) {
  try {
    const updatedPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.saveCollectionId,
      ID.unique(),
      { id_user: id_user,
        id_post: id_post }
    )

    if(!updatedPost) throw Error;

    return updatedPost;
  } catch(error) {
    console.log(error);
  }
}

export async function unsavePost(id_saveRecord: string) {
  try {
    const statusCode = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.saveCollectionId,
      id_saveRecord,
    )

    if(!statusCode) throw Error;

    return { status : "ok" };
  } catch(error) {
    console.log(error);
  }
}

export async function searchPosts(searchTerm: string) {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [Query.search("caption", searchTerm)]
    )

    if(!posts) throw Error;

    return posts;
  } catch (error) {
    console.log(error);
  }
}

export async function createComment(comment: IComment) {
  const newComment = await databases.createDocument(
    appwriteConfig.databaseId,
    appwriteConfig.commCollectionId,
    ID.unique(),
    { text: comment.text,
      id_user: comment.id_user,
      id_post: comment.id_post,
    });
  
  if(!newComment) throw Error;
  return newComment;
}

export async function getComments(id_post: string) {
  const comments = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.commCollectionId,
    [Query.equal("id_post", [id_post])]
    );
  
  if(!comments) throw Error;
  return comments;
}

