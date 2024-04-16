import { Models } from "appwrite";
import React, { useEffect, useState } from "react";

import Loader from "./Loader";
import { checkIsLiked } from "@/lib/utils";
import { useGetCurrentUser, useLikePost, useSavePost, useUnsavePost } from "@/lib/react-query/queriesAndMutations";

type PostStatsProps = {
  post?: Models.Document;
  id_user: string;
}

const PostStats = ({ post, id_user }: PostStatsProps) => {
  const { data: activeUser } = useGetCurrentUser();
  const likesList = post?.likes.map((user: Models.Document) => user.$id);
  const [likes, setLikes] = useState(likesList);
  const commentList = post?.comment.map((commenters: Models.Document) => commenters.$id);
  const [isSaved, setIsSaved] = useState(false);

  const { mutate: likePost, isPending: isLikingPost } = useLikePost();
  const { mutate: savePost, isPending: isSavingPost } = useSavePost();
  const { mutate: unsavePost, isPending: isUnsavingPost } = useUnsavePost();

  const savedPostRecord = activeUser?.save.find((record: Models.Document) => record.id_post.$id === post?.$id);

  useEffect(() => {
    setIsSaved(!!savedPostRecord)
  }, [activeUser]);

  const handleLikePost = (e: React.MouseEvent) => {
    e.stopPropagation();
    let newLikes = [...likes];
    const hasLiked = newLikes.includes(id_user);

    if(hasLiked) {
      newLikes = newLikes.filter((id) => id !== id_user);
    } else {
      newLikes.push(id_user);
    }

    setLikes(newLikes);
    likePost({ id_post: post?.$id || "", likesArray: newLikes});
  }

  const handleSavePost = (e: React.MouseEvent) => {
    e.stopPropagation();

    if(savedPostRecord) {
      setIsSaved(false);
      unsavePost(savedPostRecord.$id);
    } else {
      setIsSaved(true);
      savePost({id_post: post?.$id || "", id_user});
    }
  }

  return (
    <div className="flex flex-1 justify-between px-1 items-center z-20">
      <div className="flex gap-2">
      {isLikingPost ? <Loader /> :
        <img
          className="cursor-pointer"
          src={checkIsLiked(likes, id_user)
            ? "/clonegram/assets/icons/liked.svg"
            : "/clonegram/assets/icons/like.svg"}
          alt="like-icon"
          height={20}
          width={20}
          onClick={handleLikePost}
        />}
        <span className="small-medium lg:base-medium">{likes.length}</span>
        <img
          src="/clonegram/assets/icons/chat.svg"
        />
        <span className="small-medium lg:base-medium">{commentList?.length}</span>
        <span></span>
      </div>
      <div className="flex gap-2">
      {isSavingPost || isUnsavingPost ? <Loader /> :
        <img
          className="cursor-pointer"
          src={isSaved
            ? "/clonegram/assets/icons/saved.svg"
            : "/clonegram/assets/icons/save.svg"}
          alt="like-icon"
          onClick={handleSavePost}
        />}
      </div>
    </div>
  )
}

export default PostStats