import { Models } from "appwrite";
import { useNavigate } from "react-router-dom";

import { Button } from "../ui/button"
import { useUserContext } from "@/context/AuthContext";

type CreatorCardProps = {
  user: Models.Document,
}

const CreatorCard = ({ user }: CreatorCardProps) => {
  const { user: activeUser } = useUserContext();
  const navigate = useNavigate();

  const handleCreatorProfileVisit = () => {
    navigate(`/profile/${user.$id}`);
  }

  return (
    <div className="user-card">
        <img
          className="rounded-full 2xl:w-[56px] sm:w-[40px] 2xl:h-[56px] sm:h-[40px] z-[1000]"
          src={user.url_img || "/clonegram/assets/icons/profile-placeholder.svg"}
          alt="user-profile-icon"
        />
      <div onClick={handleCreatorProfileVisit}>
        <p className="2xl:base-regular sm:small-regular text-center hover:underline cursor-pointer">@{user.username}</p>
        <p className="tiny-medium text-light-3 text-center">Followed by @ed_pinheiro</p>
      </div>
      <Button className="shad-button_primary py-1 px-4">
        <p className="2xl:base-regular sm:tiny-large">Visit</p>
      </Button>
  </div>
  )
}

export default CreatorCard