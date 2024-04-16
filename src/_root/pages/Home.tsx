import { Models } from "appwrite";

import Loader from "@/components/shared/Loader";
import PostCard from "@/components/shared/PostCard";
import StoriesBar from "@/components/shared/StoriesBar";
import TopCreators from "@/components/shared/TopCreators";
import { useGetRecentPosts } from "@/lib/react-query/queriesAndMutations";

const Home = () => {
  const { data: posts, isPending: isPostLoading } = useGetRecentPosts();

  return (
    <div className="flex flex-1">
      <div className="home-container sm:max-w-[710px] 2xl:max-w-[1190px]">
      <StoriesBar />
        <div className="home-posts">
          <h2 className="h3-bold md:h2-bold text-left w-full">Home Feed</h2>
          {isPostLoading && !posts ? (
            <Loader />
          ) : (
            <ul className="flex flex-col flex-1 gap-9 w-full justify-center items-center">
              {posts?.documents.map((post: Models.Document) => (
                <PostCard post={post} />
              ))}
            </ul>
          )}
        </div>
      </div>
      <TopCreators />
    </div>
  )
}

export default Home