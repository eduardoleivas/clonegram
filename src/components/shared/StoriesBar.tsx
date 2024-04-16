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
    <div className="flex flex-row gap-3 w-full">
      <StoryCard user={activeUser} />
      {posts?.documents.map((post: Models.Document) =>(
        <StoryCard post={post} />
      ))}
    </div>
  )
}

export default StoriesBar