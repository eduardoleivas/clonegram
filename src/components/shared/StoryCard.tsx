import { Models } from "appwrite";
import { Link } from "react-router-dom";

import { IUser } from "@/types";
import { storyCalc } from "@/lib/utils";

type StoryCardProps = {
  post?: Models.Document;
  user?: IUser;
}

const StoryCard = ({ post, user }: StoryCardProps) => {

  if(!user) {
    if(!storyCalc(post?.$createdAt)) {
      return;
    }

    return (
      <Link to={`/posts/${post?.$id}`} className="flex flex-col items-center gap-1">
        <div className="relative">
          <img
            className="rounded-full border-2 border-dark-4 2xl:w-[56px] sm:w-[40px] 2xl:h-[56px] sm:h-[40px] z-[1000]"
            src={post?.id_creator.url_img || "/clonegram/assets/icons/profile-placeholder.svg"}
            alt="user-profile-icon"
          />
          <a className="border-bg rounded-full 2xl:w-[56px] 2xl:h-[56px] sm:w-[40px] sm:h-[40px] top-0 left-0"/>
          <a className="rainbow-border rounded-full 2xl:w-[60px] 2xl:h-[60px] 2xl:top-[-2px] 2xl:left-[-2px] sm:w-[44px] sm:h-[44px] sm:top-[-2px] sm:left-[-2px]"/>
        </div>
        <p className="tiny-medium">@{post?.id_creator.username}</p>
      </Link>
    )
  } else {
    return (
      <Link to={`/create-post`} className="flex flex-col items-center gap-1">
        <div className="relative">
          <img
            className="rounded-full border-2 border-dark-4 2xl:w-[56px] sm:w-[40px] 2xl:h-[56px] sm:h-[40px] z-[1000]"
            src={user?.url_img || "/clonegram/assets/icons/profile-placeholder.svg"}
            alt="user-profile-icon"
          />
          <img
            className="absolute sm:w-[15px] sm:h-[15px] sm:top-7 sm:right-[-5px] 2xl:w-[24px] 2xl:h-[24px] 2xl:top-9"
            src="clonegram/assets/icons/add-post.svg"
            alt="add-post-icon"
          />
          <a className="border-bg rounded-full 2xl:w-[56px] 2xl:h-[56px] sm:w-[40px] sm:h-[40px] top-0 left-0"/>
          <a className="rainbow-border rounded-full 2xl:w-[60px] 2xl:h-[60px] 2xl:top-[-2px] 2xl:left-[-2px] sm:w-[44px] sm:h-[44px] sm:top-[-2px] sm:left-[-2px]"/>
        </div>
        <p className="tiny-medium">My Stories</p>
      </Link>
    )
  }


}

export default StoryCard