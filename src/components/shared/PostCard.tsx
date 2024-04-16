import { Models } from "appwrite";
import { Link } from "react-router-dom";

import PostStats from "./PostStats";
import { useUserContext } from "@/context/AuthContext";
import { multiFormatDateString } from "@/lib/utils";

type PostCardProps = {
  post: Models.Document;
}

const PostCard = ({ post }: PostCardProps) => {
  const { user } = useUserContext();

  if(!post.id_creator) return;

  return (
    <div className="post-card">
      <div className="flex-between">
        <div className="flex items-center gap-3">
          <Link to={`/profile/${post.id_creator}`}>
            <img
              src={post?.id_creator?.url_img || "/clonegram/assets/icons/profile-placeholder.svg"}
              alt="creator_image"
              className="rounded-full w-12 lh:h-12"
            />
          </Link>
          <div className="flex flex-col text-start">
            <p className="base-medium lg:body-bold text-light-1"> {post?.id_creator?.name}</p>
            <div className="flex flex-1 items-center gap-2 text-light-3 justify-start">
              <p className="subtle-semibold lg:small-regular"> {multiFormatDateString(post?.$createdAt)}</p> -
              <p className="subtle-semibold lg:small-regular">{post.location}</p>
            </div>
          </div>
        </div>
        <Link to={`/edit-post/${post.$id}`}
          className={`${user.id_user !== post.id_creator.$id ? "hidden" : ""}`}>
          <img src="/clonegram/assets/icons/edit.svg"
            alt="edit-post"
            width={20}
            height={20}
          />
        </Link>
      </div>
      <Link to={`/posts/${post.$id}`}>
        <div className="small-medium lg:base-medium py-5">
          <p>{post.caption}</p>
          <ul className="flex gap-1 mt-2">
            {post.tag.map((tag: string) => (
              <li key={tag} className="text-light-3">
                #{tag}
              </li>
            ))}
          </ul>
        </div>
        <img 
          src={post.url_img || "/clonegram/assets/icons/profile-placeholder.svg"}
          className="post-card_img"
          alt="post-image"
        />
      </Link>
      <PostStats post={post} id_user={user.id_user} />
    </div>
  )
}

export default PostCard