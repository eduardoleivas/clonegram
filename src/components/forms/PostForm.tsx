import { z } from "zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Models } from "appwrite";
import { zodResolver } from "@hookform/resolvers/zod";

import Loader from "../shared/Loader";
import FileUploader from "../shared/FileUploader";
import { useToast } from "../ui/use-toast";
import { Textarea } from "../ui/textarea";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem,
  FormLabel, FormMessage, } from "@/components/ui/form";
import { useUserContext } from "@/context/AuthContext";
import { PostValidation } from "@/lib/validation";
import { useCreatePost } from "@/lib/react-query/queriesAndMutations";

type PostFormProps = {
  post?: Models.Document;
}

const PostForm = ({ post }: PostFormProps) => {
  const [content, setContent] = useState("");
  const MAX = 280;

  const { user } = useUserContext();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { mutateAsync: createPost, isPending: isLoadingCreate } = useCreatePost();

  const recalculate = (e: any) => {
    setContent((e.target as HTMLTextAreaElement).value);
  }

  useEffect(() => {
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
      location: post ? post?.location: "",
      tags: post ? post?.tags.join(','): "",
    },
  })

  async function onSubmit(values: z.infer<typeof PostValidation>) {
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
                  mediaUrl={post?.imageUrl}
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
          <Button type="button" className="shad-button_dark_4">Cancel</Button>
          <Button type="submit" className="shad-button_primary whitespace-nowrap">
            {isLoadingCreate? (
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