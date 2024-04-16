import Loader from './Loader';
import CreatorCard from './CreatorCard'
import { useGetUsers } from '@/lib/react-query/queriesAndMutations';

const TopCreators = () => {
  const { data: creators, isLoading: isUsersLoading, isError: isErrorCreators } = useGetUsers(4);

  if(isErrorCreators) {
    return <p className="body-medium text-light-1">Something bad happened</p>
  }

  return (
    <div className="home-creators">
      <h3 className="h3-bold text-light-1">Top Creators</h3>
      {isUsersLoading ? (
        <Loader />
      ) : (
        <ul className="grid grid-cols-2 gap-2">
           {creators?.documents.map((creator) => (
              <li key={creator?.$id}>
                <CreatorCard user={creator} />
              </li>
           ))}
        </ul>
      )}
    </div>
  )
}

export default TopCreators