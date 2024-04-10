import PostForm from "@/components/forms/PostForm"

const createPost = () => {
  return (
    <div className="flex flex-1">
      <div className="common-container">
        <div className="max-w-5xl flex-start gap-3 jistufy-start w-full">
          <img
            src="/clonegram/assets/icons/add-post.svg"
            alt="add"
            width={36}
            height={36}
          />
          <h2 className="h3-bold md:h2-bold text-left w-full">Create Post</h2>
        </div>
        <PostForm />

      </div>
    </div>
  )
}

export default createPost