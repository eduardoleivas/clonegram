import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Models } from "appwrite";

import { useToast } from "../ui/use-toast";
import { Textarea } from "../ui/textarea";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem,
  FormLabel, FormMessage, } from "@/components/ui/form";
import Loader from "../shared/Loader";
import FileUploader from "../shared/FileUploader";
import { useUserContext } from "@/context/AuthContext";
import { PostValidation } from "@/lib/validation";
import { useCreatePost, useUpdatePost } from "@/lib/react-query/queriesAndMutations";

type PostFormProps = {
  post?: Models.Document;
  action: "create" | "update";
}

const PostForm = ({ post, action }: PostFormProps) => {
  const [content, setContent] = useState("");
  const [captionLoad, setCaptionLoad] = useState(false);
  const { mutateAsync: createPost, isPending: isLoadingCreate } = useCreatePost();
  const { mutateAsync: updatePost, isPending: isLoadingUpdate } = useUpdatePost();
  const { user } = useUserContext();
  const { toast } = useToast();
  const navigate = useNavigate();
  const MAX = 160;
 
  const recalculate = (e: any) => {
    setContent((e.target as HTMLTextAreaElement).value);
  }

  useEffect(() => {
    if(action === "update" && !captionLoad) {
      setContent(post?.caption);
      setCaptionLoad(true);
    }

    const counter = document.getElementById("counter");
    if((content.length) < (MAX/2)) {
      (counter as HTMLParagraphElement).className = "small-regular text-light-4 text-right"
    } else if(((content.length+1) >= (MAX/2)) && ((content.length) <= MAX)) {
      (counter as HTMLParagraphElement).className = "small-regular text-amber-400 text-right"
    } else {
      (counter as HTMLParagraphElement).className = "small-regular text-bright-red text-right"
    }
  }, [content])

  const form = useForm<z.infer<typeof PostValidation>>({
    resolver: zodResolver(PostValidation),
    defaultValues: {
      placeholder: "placeholder",
      file: [],
      location: post ? post?.location : "",
      tags: post ? post?.tag.join(','): "",
    },
  })

  const cancelHandler = () => {
    navigate("/");
  }

  async function onSubmit(values: z.infer<typeof PostValidation>) {
    if(!captionLoad) {
      toast({
        title:"Creating your post",
        description:"Just a few more seconds...",
      })
      if(content.length > MAX) {
          toast({
            variant: "destructive",
            title:"Post creation failed",
            description:"Captions must have less than 280 characters",
          })
      } else {
        const newPost = await createPost({
          caption: content,
          file: values.file,
          location: values.location,
          tags: values.tags,
          id_creator: user.id_user,
       })
  
        if (!newPost) {
          toast({
            title: "Post creation failed",
            description: "Please try again later",
          })
        }
        toast({
          title:"Post successfully created",
          description:"Congratulations!",
        })
        navigate('/');
      }

    } else {
      toast({
        title:"Updating your post",
        description:"Just a few more seconds...",
      })
      if(content.length > MAX) {
        toast({
          variant: "destructive",
          title:"Post update failed",
          description:"Captions must have less than 280 characters",
        })
      } else {
        const updatedPost = await updatePost({
          id_post: post?.$id,
          caption: content,
          file: values.file,
          location: values.location,
          tags: values.tags,
          id_creator: user.id_user,
      })

        if (!updatedPost) {
          toast({
            title: "Post update failed",
            description: "Please try again later",
          })
        }
        toast({
          title:"Post successfully updated",
          description:"Congratulations!",
        })
        navigate(`/posts/${post?.$id}`);
      }
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-9 w-full max-w-5xl">
        <div>
          <FormField
            control={form.control}
            name="placeholder"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">Caption</FormLabel>
                <FormControl>
                  <Textarea className="shad-textarea custom-scrollbar" {...field} onChange={recalculate} value={content}/>
                </FormControl>
                <FormMessage  className="shad-form_message" />
              </FormItem>
            )}
          />
          <p id="counter" className="text-right small-regular text-light-4">{`${content.length}/${MAX}`}</p>
        </div>
        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Photos</FormLabel>
              <FormControl>
                <FileUploader 
                  fieldChange={field.onChange}
                  mediaUrl={post?.url_img}
                />
              </FormControl>
              <FormMessage  className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Location</FormLabel>
              <FormControl>
                <Input type="text" className="shad-input" {...field} />
              </FormControl>
              <FormMessage  className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Tags (Separated by comma ",")</FormLabel>
              <FormControl>
                <Input
                type="text"
                className="shad-input"
                placeholder="Art, Expression, Learn, Trip, Friends"
                {...field} />
              </FormControl>
              <FormMessage  className="shad-form_message" />
            </FormItem>
          )}
        />
        <div className="flex gap-4 items-center justify-end">
          <Button type="button" className="shad-button_dark_4" onClick={cancelHandler}>Cancel</Button>
          <Button type="submit" className="shad-button_primary whitespace-nowrap" disabled={isLoadingCreate || isLoadingUpdate}>
            {isLoadingCreate || isLoadingUpdate ? (
              <div className="flex-center gap-2">
                <Loader /> Posting...
              </div>
            ): "Submit"}</Button>
        </div>
      </form>
    </Form>
  )
}

export default PostForm