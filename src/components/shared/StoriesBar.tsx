import { Models } from "appwrite";

import StoryCard from "./StoryCard";
import Loader from "./Loader";
import { useUserContext } from '@/context/AuthContext'
import { useGetRecentPosts } from '@/lib/react-query/queriesAndMutations';

const StoriesBar = () => {
  const { user: activeUser } = useUserContext();
  const { data: posts, isLoading: isLoadingStories} = useGetRecentPosts();

  if(isLoadingStories) return <Loader />

  return (
    <div className="flex flex-1 max-w-full min-h-[100px] items-center overflow-y-hidden overflow-x-scroll custom-scrollbar">
      <div className="flex flex-row gap-3 w-full ml-2 justify-start">
        <div className="flex flex-1 min-w-[60px]">
          <StoryCard user={activeUser} />
        </div>
        {posts?.documents.map((post: Models.Document) =>(
          <StoryCard post={post} />
        ))}
      </div>
   </div>
  )
}

export default StoriesBar