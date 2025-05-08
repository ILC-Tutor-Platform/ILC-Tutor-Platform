import Logo from '@/assets/AralLinkLogo.svg';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { api } from '@/utils/axios';
import { isValidUpEmail } from '@/utils/errorValidations.ts';
import { BookOpen, Briefcase, Calendar, Plus, Share2, X } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const SignUpAsTutor = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  // Basic info state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [middleInitial, setMiddleInitial] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [description, setDescription] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Dynamic fields states
  const [availability, setAvailability] = useState([
    { date: '', timeFrom: '', timeTo: '' },
  ]);
  const [affiliations, setAffiliations] = useState(['']);
  const [expertise, setExpertise] = useState(['']);
  const [socials, setSocials] = useState(['']);
  const [subject, setSubject] = useState(['']);

  // Form errors
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    subject: '',
  });
  // Handle adding new entries for dynamic fields
  const addFieldItem = (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    currentItems: string[],
  ): void => {
    setter([...currentItems, '']);
  };

  // Handle removing entries for dynamic fields
  const removeFieldItem = (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    currentItems: string[],
    index: number,
  ): void => {
    if (currentItems.length > 1) {
      setter(currentItems.filter((_, i) => i !== index));
    }
  };

  // Handle adding new availability slot
  const addAvailability = (): void => {
    setAvailability((prev) => [
      ...prev,
      { date: '', timeFrom: '', timeTo: '' },
    ]);
  };

  // Handle removing availability slot
  const removeAvailability = (index: number): void => {
    setAvailability((prev) => {
      if (prev.length > 1) {
        return prev.filter((_, i) => i !== index);
      }
      return prev;
    });
  };

  // Update availability fields
  const updateAvailability = (
    index: number,
    field: 'date' | 'timeFrom' | 'timeTo',
    value: string,
  ): void => {
    setAvailability((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  // Update dynamic field values
  const updateFieldItem = (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    currentItems: string[],
    index: number,
    value: string,
  ): void => {
    const newItems = [...currentItems];
    newItems[index] = value;
    setter(newItems);
  };

  const handleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  // Form validation
  const validateForm = () => {
    setLoading(true);
    let valid = true;
    const newErrors = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      subject: '',
    };

    // Validate first name
    if (!firstName.trim()) {
      newErrors.firstName = 'First name is required';
      valid = false;
    }

    // Validate last name
    if (!lastName.trim()) {
      newErrors.lastName = 'Last name is required';
      valid = false;
    }

    // Validate email
    if (!email.trim()) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!isValidUpEmail(email)) {
      newErrors.email = 'Please enter a valid UP email address';
      valid = false;
    }

    // Validate password
    if (!password) {
      newErrors.password = 'Password is required';
      valid = false;
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
      valid = false;
    }

    // Validate confirm password
    if (subject !== subject) {
      newErrors.subject = 'Subject is required.';
      valid = false;
    }

    setErrors(newErrors);
    setLoading(false);
    return valid;
  };

  // Prepare form data
  const prepareFormData = () => {
    const concatenatedName = `${firstName} ${lastName} ${middleInitial}`.trim();

    return {
      user: {
        name: concatenatedName,
        email: email,
        password: password,
        datejoined: new Date().toISOString().slice(0, 10),
      },
      tutor: {
        description: description,
        status: 'pending', // Always set to pending for new tutors
      },
      availability: {
        availability: availability.map((item) => item.date),
        available_time_from: availability.map((item) => item.timeFrom),
        available_time_to: availability.map((item) => item.timeTo),
      },
      affiliation: {
        affiliation: affiliations.filter((aff) => aff.trim() !== ''),
      },
      expertise: {
        expertise: expertise.filter((exp) => exp.trim() !== ''),
      },
      socials: {
        socials: socials.filter((social) => social.trim() !== ''),
      },
      subject: {
        subject_name: subject.map((sub) => sub.trim().toUpperCase()),
      },
    };
  };

  // Form submission handler
  const signUpAsTutorHandler = async () => {
    setLoading(true);
    if (validateForm()) {
      setLoading(true);
      const formData = prepareFormData();
      try {
        await api.post('auth/signup/tutor', formData);
        toast.success(
          'Please check your email. We sent you a confirmation. Thank you.',
          {
            className: 'green-shadow-card text-black',
            duration: 3000,
            style: {
              background: '#ffffff',
              color: '#307B74',
              fontSize: '16px',
              border: '0px',
              padding: '1.5rem',
              boxShadow: '0px 4px 4px 3px rgba(48, 123, 116, 0.40)',
            },
          },
        );
        setLoading(false);
      } catch (error) {
        console.log('Error signing up: ', error);
        toast.error('Error signing up.', {
          className: 'green-shadow-card text-black',
          duration: 3000,
          style: {
            background: '#ffffff',
            color: '#8A1538',
            fontSize: '16px',
            border: '0px',
            padding: '1.5rem',
            boxShadow: '0px 4px 4px 3px rgba(48, 123, 116, 0.40)',
          },
        });
        setLoading(false);
      }
      setTimeout(() => navigate('/verify-email'), 3000);
    }
  };

  return (
    <div className="flex min-h-screen items-center py-10">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          signUpAsTutorHandler();
        }}
        className="grid w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] mx-auto py-8 px-4 xl:px-8 gap-8 rounded-2xl green-shadow-card"
      >
        <div className="grid gap-6">
          <img src={Logo} alt="Logo" className="w-32 h-auto mx-auto" />
          <h2 className="font-bold text-3xl xl:text-4xl text-center">
            Sign Up as Tutor
          </h2>
        </div>

        {/* Personal Information */}
        <div className="grid gap-4">
          <h3 className="font-semibold text-xl">Personal Information</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className={errors.firstName ? 'border-red-500' : ''}
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm">{errors.firstName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className={errors.lastName ? 'border-red-500' : ''}
              />
              {errors.lastName && (
                <p className="text-red-500 text-sm">{errors.lastName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="middleInitial">Middle Initial</Label>
              <Input
                id="middleInitial"
                value={middleInitial}
                onChange={(e) => setMiddleInitial(e.target.value)}
                maxLength={1}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address (UP Email) *</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={errors.email ? 'border-red-500' : ''}
              placeholder="example@up.edu.ph"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={errors.password ? 'border-red-500' : ''}
              />
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password}</p>
              )}
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

        {/* Tutor Description */}
        <div className="grid gap-4">
          <h3 className="font-semibold text-xl">Tutor Profile</h3>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full min-h-[100px] p-2 border rounded-md"
              placeholder="Tell us about yourself, your teaching style, and qualifications..."
            />
          </div>
        </div>

        {/* Availability */}
        <div className="grid gap-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-xl flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Availability
            </h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addAvailability}
              className="flex items-center gap-1"
            >
              <Plus className="w-4 h-4" /> Add Slot
            </Button>
          </div>

          {availability.map((slot, index) => (
            <div
              key={index}
              className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end bg-gray-50 p-3 rounded-lg"
            >
              <div className="space-y-2">
                <Label htmlFor={`date-${index}`}>Date</Label>
                <Input
                  id={`date-${index}`}
                  type="date"
                  value={slot.date}
                  onChange={(e) =>
                    updateAvailability(index, 'date', e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`timeFrom-${index}`}>From</Label>
                <Input
                  id={`timeFrom-${index}`}
                  type="time"
                  value={slot.timeFrom}
                  onChange={(e) =>
                    updateAvailability(index, 'timeFrom', e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`timeTo-${index}`}>To</Label>
                <Input
                  id={`timeTo-${index}`}
                  type="time"
                  value={slot.timeTo}
                  onChange={(e) =>
                    updateAvailability(index, 'timeTo', e.target.value)
                  }
                />
              </div>

              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => removeAvailability(index)}
                disabled={availability.length === 1}
                className="h-10 w-10"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>

        {/* Affiliations */}
        <div className="grid gap-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-xl flex items-center gap-2">
              <Briefcase className="w-5 h-5" />
              Affiliations
            </h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addFieldItem(setAffiliations, affiliations)}
              className="flex items-center gap-1"
            >
              <Plus className="w-4 h-4" /> Add
            </Button>
          </div>

          {affiliations.map((aff, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={aff}
                onChange={(e) =>
                  updateFieldItem(
                    setAffiliations,
                    affiliations,
                    index,
                    e.target.value,
                  )
                }
                placeholder="e.g., STEM Scholars Program"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() =>
                  removeFieldItem(setAffiliations, affiliations, index)
                }
                disabled={affiliations.length === 1}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>

        {/* Expertise */}
        <div className="grid gap-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-xl flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Areas of Expertise
            </h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addFieldItem(setExpertise, expertise)}
              className="flex items-center gap-1"
            >
              <Plus className="w-4 h-4" /> Add
            </Button>
          </div>

          {expertise.map((exp, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={exp}
                onChange={(e) =>
                  updateFieldItem(
                    setExpertise,
                    expertise,
                    index,
                    e.target.value,
                  )
                }
                placeholder="e.g., Calculus, Physics"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => removeFieldItem(setExpertise, expertise, index)}
                disabled={expertise.length === 1}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>

        {/* SUBJECTS TO TEACH */}
        <div className="grid gap-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-xl flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Subjects to Teach
            </h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addFieldItem(setSubject, subject)}
              className={`${errors.subject ? 'border-red-500' : ''}`}
            >
              <Plus className="w-4 h-4" /> Add
            </Button>
            {errors.subject && (
              <p className="text-red-500 text-sm">{errors.subject}</p>
            )}
          </div>

          {subject.map((sub, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={sub}
                onChange={(e) =>
                  updateFieldItem(setSubject, subject, index, e.target.value)
                }
                placeholder="e.g., CMSC 125, SCIENCE 10"
              />

              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => removeFieldItem(setSubject, subject, index)}
                disabled={subject.length === 1}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>

        {/* Social Media */}
        <div className="grid gap-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-xl flex items-center gap-2">
              <Share2 className="w-5 h-5" />
              Social Media Links
            </h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addFieldItem(setSocials, socials)}
              className="flex items-center gap-1"
            >
              <Plus className="w-4 h-4" /> Add
            </Button>
          </div>

          {socials.map((social, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={social}
                onChange={(e) =>
                  updateFieldItem(setSocials, socials, index, e.target.value)
                }
                placeholder="e.g., https://linkedin.com/in/yourprofile"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => removeFieldItem(setSocials, socials, index)}
                disabled={socials.length === 1}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <div className="flex items-center w-full sm:w-[60%] md:w-[50%] lg:w-[40%] mx-auto mt-4">
          <Button
            variant={'yellow-button'}
            type="submit"
            className="w-full py-6 text-lg"
            disabled={loading}
          >
            {loading ? 'Checking information...' : 'Sign up as a Tutor'}
          </Button>
        </div>

        <div className="flex items-center justify-center gap-1 text-ilc-grey">
          <p>Already have an account? </p>
          <Link to="/signin" className="font-bold text-black">
            Login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default SignUpAsTutor;
