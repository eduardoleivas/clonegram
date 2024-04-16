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

export type IUpdateUser = {
  id_user: string;
  name: string;
  bio: string;
  id_img: string;
  url_img: string;
  file: File[];
};

export type INavLink = {
  imgURL: string;
  route: string;
  label: string;
};

export type INewPost = {
  id_creator: string;
  caption: string;
  file: File[];
  location?: string;
  tags?: string;
};

export type IUpdatePost = {
  id_post: string | any;
  id_creator: string;
  caption: string;
  file: File[];
  location?: string;
  tags?: string;
};

export type IComment = {
  text: string;
  id_user?: string;
  id_post?: string;
}