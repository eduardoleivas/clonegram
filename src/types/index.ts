export type IContextType = {
  user: IUser;
  isLoading: boolean;
  setUser: React.Dispatch<React.SetStateAction<IUser>>;
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  checkAuthUser: () => Promise<boolean>;
}

export type INewUser = {
  email: string;
  name: string;
  username: string;
  password: string;
}

export type IUser = {
  id_user: string;
  name: string;
  username: string;
  email: string;
  url_img: string;
  bio: string;
};