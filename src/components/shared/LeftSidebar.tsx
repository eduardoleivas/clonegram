import { useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useUserContext } from '@/context/AuthContext';
import { useSignOutAccount } from '@/lib/react-query/queriesAndMutations';
import { INavLink } from '@/types';
import { sidebarLinks } from '@/constants';
import { Button } from '../ui/button';
import { useToast } from '../ui/use-toast';

const LeftSidebar = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { pathname } = useLocation();
  const { user } = useUserContext();
  const { mutate: signOut, isSuccess } = useSignOutAccount();

  useEffect(() => {
    if(isSuccess) navigate(0);
  }, [isSuccess])

  return (
    <nav className="leftsidebar">
      <div className="flex flex-col 2xl:gap-11 sm:gap-7">
        <Link to="/" className="flex gap-3 items-center">
          <img 
          src="/clonegram/assets/images/logo1.svg"
          alt="logo"
          width={170}
          height={36}
          />
        </Link>

        <Link to={`/profile/${user.id_user}`}
        className="flex gap-3 items-center">
          <img
            src={user.url_img || "/clonegram/assets/icons/profile-placeholder.svg"}
            alt="profile"
            className="2xl:h-14 sm:h-10 2xl:w-14 sm:w-10 rounded-full"
          />
          <div className="flex flex-col">
            <p className="2xl:body-bold sm:small-large-semibold">
              {user.name}
            </p>
            <p className="2xl:small-regular sm:tiny-large text-light-3">
              @{user.username}
            </p>
          </div>
        </Link>

        <ul className="flex flex-col 2xl:gap-6 sm:gap-2 mt-4">
          {sidebarLinks.map((link: INavLink) => {
            const isActive = pathname === link.route;

            return (
              <li key={link.label}
              className={`leftsidebar-link group ${isActive && "bg-primary-500"}`}>
                <NavLink
                to={link.route}
                className="flex gap-4 items-center small-medium" >
                  <img
                  src={link.imgURL}
                  alt={link.label}
                  className={`group-hover:invert-white
                            ${isActive && "invert-white"}`}
                  />
                  {link.label}
                </NavLink>
              </li>
            )
          })}
        </ul>
      </div>

      <Button variant="ghost"
      className="shad-button_ghost"
      onClick={() => {
      signOut();
      toast({
        title:"Signing out",
        description:"We hope to see you back soon!",
      });}}>
        <img src="/clonegram/assets/icons/logout.svg" alt="logout" />
        <p className="small-medium 2xl:base-medium">Sign out</p>
      </Button>
    </nav>
  )
}

export default LeftSidebar