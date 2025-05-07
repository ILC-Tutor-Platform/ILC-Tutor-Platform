import logo from '@/assets/AralLinkLogo.svg';
import bell from '@/assets/bell.svg';
import profile from '@/assets/profile.svg';
import { Menu } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';

const NavbarMobile = () => {
  return (
    <nav className="flex justify-between items-center shadow-md sticky top-0 bg-white z-50 py-5 px-5">
      <div className="flex items-center gap-4">
        <span>
          <Menu />
        </span>
        <Link to={'/'}>
          <img src={logo} alt="" className="w-25 h-auto" />
        </Link>
      </div>

      <div>
        <ul className="flex items-center gap-2">
          <li>
            <Link to={'/announcement'}>
              <img src={bell} alt="" />
            </Link>
          </li>
          <li>
            <Link to={'/profile'}>
              <img src={profile} alt="" />
            </Link>
          </li>
          <li className="border-[2px] border-gray-300 border-dashed">
            <Button variant={'yellow-button'} className="text-xs">
              LOG OUT
            </Button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default NavbarMobile;
