import { Link, useParams } from "react-router-dom";
import { useGetPostById } from "@/lib/react-query/queriesAndMutations"
import Loader from "@/components/shared/Loader";
import { multiFormatDateString } from "@/lib/utils";
import { useUserContext } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { useToast } from '@/components/ui/use-toast';
import { ToastAction } from "@/components/ui/toast";
import PostStats from "@/components/shared/PostStats";

const PostDetails = () => {
  const { id } = useParams();
  const { user } = useUserContext();
  const { toast } = useToast();
  const { data: post, isPending } = useGetPostById(id || "");

  const handleDeletePost = () => {
    toast({
      title: "Are you sure you want to delete this post?",
      description: "It will be permanently deleted",
      action: <ToastAction altText="Confirm">Confirm</ToastAction>,
      duration: 10000
    })

  }

  return (
    <div className="post_details-container">
      {isPending ? <Loader /> : (
        <div className="post_details-card">
          <img
            src={post?.url_img}
            alt="post-image"
            className="post_details-img"
            onClick={() =>{}}
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
                <div className="flex-center gap-2 text-light-3">
                  <p className="subtle-semibold lg:small-regular"> {multiFormatDateString(post?.$createdAt)}</p> -
                  <p className="subtle-semibold lg:small-regular">{post?.location}</p>
                </div>
              </div>
              </Link>
              <div className="flex-center gap-1">
                <Link to={`/update-post/${post?.$id}`}
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

            <hr className="border w-full border-dark-4/80"></hr>

            <div className="flex flex-col flex-1 w-full small-medium 2xl:base-regular">
              <p>{post?.caption}</p>
              <ul className="flex gap-1 mt-2">
                {post?.tag.map((tag: string) => (
                  <li key={tag} className="text-light-3">
                    #{tag}
                  </li>
                ))}
              </ul>
            </div>
            <div className="w-full">
                <PostStats post={post} id_user={user.id_user} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PostDetails