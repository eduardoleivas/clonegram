import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { Button } from '../ui/button'
import { useToast } from "../ui/use-toast"
import { useUserContext } from '@/context/AuthContext';
import { useSignOutAccount } from '@/lib/react-query/queriesAndMutations';

const Topbar = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useUserContext();
  const { mutate: signOut, isSuccess } = useSignOutAccount();

  useEffect(() => {
    if(isSuccess) navigate(0);
  }, [isSuccess])

  return (
    <section className="topbar">
      <div className="flex-between py-4 px-5">
        <Link to="/" className="flex gap-3 items-center">
          <img 
            src="/clonegram/assets/images/logo1.svg"
            alt="logo"
            width={130}
            height={325}
          />
        </Link>

        <div className="flex gap-4">
          <Button variant="ghost" className="shad-button_ghost"
          onClick={() => {
          signOut();
          toast({
            title:"Signing out",
            description:"We hope to see you back soon!",
          });}}>
            <img src="/clonegram/assets/icons/logout.svg" alt="logout" />
          </Button>
          <Link to={`/profile/${user.id_user}`} className="flex-center gap-3 pr-2">
            <img
              src={user.url_img || "/clonegram/assets/images/profile-placeholder.svg"}
              alt="profile"
              className="h-8 w-8 rounded-full"
            />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default Topbar