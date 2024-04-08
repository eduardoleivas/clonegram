import { ID, Query } from "appwrite";
import { INewUser } from "@/types";
import { account, appwriteConfig, avatars, databases } from "./config";

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