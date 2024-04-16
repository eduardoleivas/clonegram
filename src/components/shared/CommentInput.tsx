import { Models } from "appwrite";

import { Input } from "../ui/input";
import { toast } from "../ui/use-toast";
import { useUserContext } from "@/context/AuthContext"
import { useCreateComment } from "@/lib/react-query/queriesAndMutations";


type CommentInputProps = {
  post?: Models.Document;
}

const CommentInput = ({ post }: CommentInputProps) => {
  const { user } = useUserContext();
  const { mutateAsync: createComment } = useCreateComment();

  const handleKeyboardSubmit = (e: React.KeyboardEvent) => {
    if(e.key === "Enter"){
      if((e.target as HTMLInputElement).value != "") {
        postComment((e.target as HTMLInputElement).value);
        (e.target as HTMLInputElement).value = "";
      } else {
        toast({
          title: "Something went wrong",
          description: "Comments must have at least one character",
          duration: 500
        })
      }
    }
  }

  const handleClickSubmit = () => {
    let input = document.getElementById("comment");
    if((input as HTMLInputElement).value != "") {
      postComment((input as HTMLInputElement).value);
      (input as HTMLInputElement).value = "";
    } else {
      toast({
        title: "Something went wrong",
        description: "Comments must have at least one character",
        duration: 500,
      })
    }
  }

  async function postComment(comment: string) {
    const newComment = await createComment({
      text: comment,
      id_user: user.id_user,
      id_post: post?.$id,
   })

    if (!newComment) {
      toast({
        title: "Comment creation failed",
        description: "Please try again later",
        duration: 500,
      })
    }
    toast({
      title:"Comment successfully created",
      description:"Congratulations!",
      duration: 500,
    })
  }

  return (
    <div className="flex flex-1 flex-row w-full items-center gap-2">
      <img className="w-[36px] h-[36px] rounded-full"
        src={user.url_img}
      />
      <div className="flex flex-1 flex-row w-full bg-dark-3 pr-2 rounded-lg group group-hover:bg-dark-4 hover:bg-dark-4">
        <Input id="comment" className="shad-input_comment group-hover:bg-dark-4 " onKeyUp={handleKeyboardSubmit} type="text" placeholder="Write your comment..." />
        <img
          className="group-hover:bg-dark-4 rounded-full cursor-pointer"
          src="/clonegram/assets/icons/chat.svg"
          onClick={handleClickSubmit}
        />
      </div>
    </div>
  )
}

export default CommentInput