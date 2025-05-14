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

  const handleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const validateFields = () => {
    const newErrors: {
      email?: string;
      password?: string;
      invalidCredentials?: string;
    } = {};

    if (!email.trim()) {
      newErrors.email = '*Email is required.';
    }
    if (!password.trim()) newErrors.password = '*Password is required.';

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSignIn = async () => {
    setLoading(true);
    if (!validateFields()) {
      setLoading(false);
      return;
    }

    try {
      console.log('email', email);
      console.log('password', password);

      setTimeout(() => {
        setLoading(false);
      }, 1200);
    } catch (error) {
      console.error('Error signing in:', error);
      setErrors({ invalidCredentials: 'Invalid email or password.' });
    }
  };

  return (
    <section className="flex flex-col items-center justify-center h-screen">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSignIn();
        }}
        className="flex flex-col w-[90%] gap-4 md:gap-10 md:w-[50%] xl:w-[30%] mx-auto py-7 md:px-10 rounded-2xl green-shadow-card p-8"
      >
        <div className="grid gap-10">
          <img src={Logo} alt="Logo" className="w-35 h-auto mx-auto" />
          <h2 className="font-bold text-5xl text-center">Admin Sign in</h2>
        </div>
        <div className="flex flex-col gap-5">
          <div>
            {errors.email && (
              <Label className="text-[0.8rem] font-thin text-red-500">
                {errors.email}
              </Label>
            )}
            <Input
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              id="email"
              name="email"
              placeholder="Email address"
              className={`p-3 mt-2 ${errors.email ? 'border-red-500' : ''}`}
            />
          </div>
          <div>
            <div>
              {errors.password && (
                <Label className="text-[0.8rem] font-thin text-red-500">
                  {errors.password}
                </Label>
              )}
              <Input
                onChange={(e) => setPassword(e.target.value)}
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                className={`p-3 mt-2 ${errors.password ? 'border-red-500' : ''}`}
              />
            </div>
            <div className="flex items-center mt-2">
              <input
                type="checkbox"
                id="showPassword"
                checked={showPassword}
                onChange={handleShowPassword}
                className="mr-2"
              />
              <label htmlFor="showPassword" className="text-sm text-ilc-grey">
                Show Password
              </label>
            </div>
          </div>
        </div>
        <Button type="submit" disabled={loading} variant={'yellow-button'}>
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
