import { ID, Query } from "appwrite";
import { INewPost, INewUser } from "@/types";
import { account, appwriteConfig, avatars, databases, storage } from "./config";

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