import { Link, useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from '@/components/ui/use-toast';
import CommentBox from "@/components/shared/CommentBox";
import CommentInput from "@/components/shared/CommentInput";
import Loader from "@/components/shared/Loader";
import PostStats from "@/components/shared/PostStats";
import { useUserContext } from "@/context/AuthContext";
import { useGetPostById } from "@/lib/react-query/queriesAndMutations";
import { multiFormatDateString } from "@/lib/utils";

const PostDetails = () => {
  const { id } = useParams();
  const { user } = useUserContext();
  const { toast } = useToast();
  const { data: post, isPending } = useGetPostById(id || "");
  
  if(isPending || (id != post?.$id)) return <Loader />;

  const handleDeletePost = () => {
    toast({
      title: "Are you sure you want to delete this post?",
      description: "It will be permanently deleted",
      action: <ToastAction altText="Confirm">Confirm</ToastAction>,
      duration: 10000
    })

  }

  const handleOpenImage = () => {
    return (
      <div className="absolute w-screen h-screen bg-light-1 z-[20000]">
        aaa
      </div>
    )
  }

  return (
    <div className="post_details-container">
      {isPending ? <Loader /> : (
        <div className="post_details-card">
          <img
            src={post?.url_img}
            alt="post-image"
            className="post_details-img cursor-pointer"
            onClick={handleOpenImage}
          />

          <div className="post_details-info">
            <div className="flex-between w-full">
              <Link to={`/profile/${post?.id_creator}`} className="flex items-center gap-3">
                <img
                  src={post?.id_creator?.url_img || "/clonegram/assets/icons/profile-placeholder.svg"}
                  alt="creator_image"
                  className="rounded-full w-8 h-8 lg:w-12 lg:h-12"
                />
              <div className="flex flex-col">
                <p className="base-medium lg:body-bold text-light-1"> {post?.id_creator?.name}</p>
                <div className="flex flex-1 align-center justify-start gap-2 text-light-3">
                  <p className="subtle-semibold lg:small-regular"> {multiFormatDateString(post?.$createdAt)}</p> -
                  <p className="subtle-semibold lg:small-regular">{post?.location}</p>
                </div>
              </div>
              </Link>
              <div className="flex-center gap-1">
                <Link to={`/edit-post/${post?.$id}`}
                  className={`${user.id_user !== post?.id_creator.$id} && "hidden"`}>
                  <img 
                    src="/clonegram/assets/icons/edit.svg"
                    alt="edit-button"
                    width={24}
                    height={24}
                  />
                </Link>
                <Button
                onClick={handleDeletePost}
                variant="ghost"
                className={`ghost_details-delete_btn ${user.id_user !== post?.id_creator.$id} && "hidden"`}>
                  <img
                    src="/clonegram/assets/icons/delete.svg"
                    alt="delete-button"
                    width={24}
                    height={24}
                  />
              </Button>
              </div>
            </div>
            <div className="flex flex-col flex-1 max-w-full small-medium 2xl:base-regular break-all">
              <p className="mr-2 ">aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</p>
              <ul className="flex gap-1">
                {post?.tag.map((tag: string) => (
                  <li key={tag} className="text-light-3">
                    #{tag}
                  </li>
                ))}
              </ul>
            </div>
            <hr className="border w-full border-dark-4/80"></hr>

            
            <div className="w-full h-full">
              <CommentBox />
            </div>
            <div className="flex flex-1 flex-col w-full gap-2">
              <PostStats post={post} id_user={user.id_user} />
              <CommentInput post={post}/>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PostDetails