import Logo from '@/assets/AralLinkLogo.svg';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@radix-ui/react-dropdown-menu';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const SigninAsAdmin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    invalidCredentials?: string;
  }>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  return (
    <section className="flex flex-col items-center justify-center h-screen">
      <form className="flex flex-col w-[90%] gap-4 md:gap-10 xl:w-[30%] mx-auto py-7 md:px-10 rounded-2xl green-shadow-card p-8">
        <div className="grid gap-10">
          <img src={Logo} alt="Logo" className="w-35 h-auto mx-auto" />
          <h2 className="font-bold text-5xl text-center">Admin Sign in</h2>
        </div>
        <div>
          <Label>Email:</Label>
          <Input type="email" id="email" name="email" required />
        </div>
        <div>
          <Label>Password:</Label>
          <Input type="password" id="password" name="password" required />
        </div>
        <Button type="submit" variant={'yellow-button'}>
          Sign In as Admin
        </Button>

        <div className="mx-auto">
          <Link
            to={'/'}
            className="font-light text-ilc-grey hover:text-black transition-all duration-300"
          >
            Return to Home
          </Link>
        </div>
      </form>
    </section>
  );
};

export default SigninAsAdmin;
