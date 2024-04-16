import { Models } from "appwrite";
import { useParams } from "react-router-dom";

import Loader from "./Loader";
import CommentCard from "./CommentCard";
import { useGetComments } from "@/lib/react-query/queriesAndMutations";

const CommentBox = () => {
  const { id } = useParams();
  const { data: comments, isPending: isLoadingComments} = useGetComments(id || "");

  if(isLoadingComments) return <Loader />;

  return (
    <div>
      <div className="post_details-comment_container gap-3 2xl:h-[189px] 2xl:max-h-[189px] sm:h-[150px] sm::max-h-[150px]">
        {comments?.documents.map((comment: Models.Document) => (
          <CommentCard comment={comment} />
        ))}
      </div>
    </div>
  )
}

export default CommentBox