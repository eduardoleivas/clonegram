import { Models } from "appwrite"
import { useNavigate } from "react-router-dom";

import { multiFormatDateString } from "@/lib/utils";

type CommentCardProps = {
  comment: Models.Document;
}

const CommentCard = ({ comment }: CommentCardProps) => {
  const navigate = useNavigate();
  const time = multiFormatDateString(comment.$createdAt);

  const handleNavigate = () => {
    navigate(`/profile/${comment.id_user.$id}`);
  }

  return (
    <div>
        <div className="flex flex-row gap-1 ">
          <img className="rounded-full sm:w-8 sm:h-8 2xl:w-10 2xl:h-10 mt-[5px] cursor-pointer"
            src={comment.id_user.url_img || "/clonegram/assets/icons/profile-placeholder.svg"}
            alt="comment-profile-picture-icon" 
            onClick={handleNavigate} />
          <div>
            <span className="small-semibold mr-1 text-primary-500 hover:underline cursor-pointer"
              onClick={handleNavigate}>@{comment.id_user.username}</span>
            <span className="tiny-large break-all mr-1">{comment.text}</span>
            <p className="tiny-medium text-start text-light-3">{time}</p>
          </div>
        </div>
      </div>
  )
}

export default CommentCard