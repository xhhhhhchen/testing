import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import vmlogoIcon from '../assets/smallerlogo.png';
import { signInUser, getSession } from '../utils/authUtils';
import { useUser } from '../contexts/UserContext'; 
// import { supabase } from '../supabaseClient.ts';
// import { getTanksByIds } from '../api';

interface LoginProps {
  onLogin: () => void;
}

interface LocationState {
  fromTankSelection?: boolean;
  prefilledEmail?: string;
}

// interface Tank {
//   id: string;
//   name: string;
//   description?: string;
//   location_id?: string; // optional if returned from API
// }



export const Login = ({ onLogin }: LoginProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isNewUser, setIsNewUser] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;
  const [loginError, setLoginError] = useState<string | null>(null);

  useEffect(() => {
    // Check if coming from TankSelection with email conflict
    if (state?.fromTankSelection) {
      setIsNewUser(true); // Force registration mode
      if (state.prefilledEmail) {
        setEmail(state.prefilledEmail);
      }
      
      // Clear any existing temp data
      localStorage.removeItem('tempAuthData');
    }
  }, [state]);

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!email) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) errors.email = 'Email is invalid';
    if (!password) errors.password = 'Password is required';
    else if (password.length < 8) errors.password = 'Password must be at least 8 characters';
    if (isNewUser) {
      if (!name) errors.name = 'Name is required';
      if (password !== confirmPassword) errors.confirmPassword = 'Passwords must match';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const getInputStyles = (field: string, value: string) => {
    const baseStyles = "w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-yellow-200 transition-all duration-150";
    if (formErrors[field] && touchedFields[field]) return `${baseStyles} bg-red-900/20 border-red-500 text-red-100 placeholder-red-300`;
    if (value && touchedFields[field]) return `${baseStyles} bg-green-800 border-green-400 text-yellow-200 placeholder-green-300`;
    return `${baseStyles} bg-green-900 border-green-600 text-yellow-50 placeholder-green-400`;
  };


// const handleSubmit = async (e: React.FormEvent) => {
//   e.preventDefault();
//   if (!validateForm()) return;

//   if (isNewUser) {
//     const formatName = (name: string) =>
//       name.trim().split(' ').map(word =>
//         word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
//       ).join(' ');

//     const tempUser = {
//       name: formatName(name),
//       email,
//       password
//     };
//     localStorage.setItem('tempAuthData', JSON.stringify(tempUser));
//     navigate('/select-tank');
//   } else {
//     try {
//       setLoginError(null);

//       await signInUser(email, password);
//       const session = await getSession();
//       const userId = session.user.id;

//       // 1. Fetch user profile
//       const { data: userProfile, error: profileError } = await supabase
//         .from('users')
//         .select('user_id,username, created_at, location_id')
//         .eq('auth_uid', userId)
//         .single();
//       if (profileError) throw profileError;

//       // 2. Fetch location info
//       const { data: locationData, error: locationError } = await supabase
//         .from('location')
//         .select('location_id, location_name')
//         .eq('location_id', userProfile.location_id)
//         .single();
//       if (locationError) throw locationError;

//       // 3. Fetch user_tank mappings
//       const { data: tankMappings, error: tankMappingError } = await supabase
//         .from('user_tanks')
//         .select('tank_id')
//         .eq('user_id', userProfile.user_id);
//       if (tankMappingError) throw tankMappingError;

//       const tankIds = tankMappings.map(t => t.tank_id);

//       // 4. Fetch full tank details via external API
//       let fullTankInfo: Tank[] = [];

//       if (tankIds.length > 0) {
//         const response = await getTanksByIds(tankIds); // 🔁 replace with your actual API function
//         fullTankInfo = response || [];
//       }

//       // 5. Store user info in localStorage
//       localStorage.setItem('user', JSON.stringify({
//         // id: userId,
//         email: session.user.email,
//         name: userProfile.username,
//         created_at: userProfile.created_at,
//         accessToken: session.access_token,
//         location: locationData,
//         tanks: fullTankInfo
//       }));
//       localStorage.setItem('token', session.access_token);

//       onLogin();
//       navigate('/homepage');

//     } catch (error: any) {
//       console.error('Login error:', error);
//       setLoginError(
//         error.message.includes('Invalid login credentials')
//           ? 'Invalid email or password'
//           : error.message || 'Login failed'
//       );
//     }
//   }
// };


const { setIsAuthenticated, refreshUser } = useUser();

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!validateForm()) return;

  if (isNewUser) {
    const formatName = (name: string) =>
      name.trim().split(' ').map(word =>
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      ).join(' ');

    const tempUser = {
      name: formatName(name),
      email,
      password
    };
    localStorage.setItem('tempAuthData', JSON.stringify(tempUser));
    navigate('/select-tank');
  } else {
    try {
      setLoginError(null);

      await signInUser(email, password);
      const session = await getSession();
      const userId = session.user.id;

      // ✅ Store only minimal auth data
      localStorage.setItem('userId', userId);
      localStorage.setItem('accessToken', session.access_token);
      localStorage.setItem('email', session.user.email ?? '');

      onLogin();
      
      // ✅ Sync with context so refresh is triggered
      setIsAuthenticated(true);
      await refreshUser(); // load full profile

      navigate('/homepage');

    } catch (error: any) {
      console.error('Login error:', error);
      setLoginError(
        error.message.includes('Invalid login credentials')
          ? 'Invalid email or password'
          : error.message || 'Login failed'
      );
    }
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-[#00421D] p-4">
      <div className="p-8 rounded-xl shadow-2xl w-full max-w-md ring-2 ring-green-900 bg-green-900 ring-opacity-50">
        <div className="flex flex-col items-center mb-6">
          <img src={vmlogoIcon} alt="VermiMetrics Logo" className="w-32 h-32 mb-4 object-contain" />
          <h2 className="text-3xl font-bold text-yellow-300">
            {isNewUser ? 'Create Account' : 'Welcome Back!'}
          </h2>
          <p className="text-green-100 mt-2">
            {isNewUser ? 'Join our growing community' : 'Sign in to continue'}
          </p>
        </div>

        {state?.fromTankSelection && (
          <div className="mb-4 p-3 bg-yellow-900/50 border border-yellow-600 rounded-lg">
            <p className="text-yellow-100">
              Please register with a different email address
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isNewUser && (
            <div className="space-y-1">
              <label className="block text-yellow-100 font-medium" htmlFor="name">Your Name</label>
              <input 
                id="name" 
                type="text" 
                className={getInputStyles('name', name)} 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                onBlur={() => setTouchedFields(prev => ({ ...prev, name: true }))} 
                placeholder="Enter your name" 
              />
              {formErrors.name && <p className="text-red-400 text-sm">{formErrors.name}</p>}
            </div>
          )}
          <div className="space-y-1">
            <label className="block text-yellow-100 font-medium" htmlFor="email">Email Address</label>
            <input 
              id="email" 
              type="email" 
              className={getInputStyles('email', email)} 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              onBlur={() => setTouchedFields(prev => ({ ...prev, email: true }))} 
              placeholder="your@email.com" 
            />
            {formErrors.email && <p className="text-red-400 text-sm">{formErrors.email}</p>}
          </div>
          <div className="space-y-1">
            <label className="block text-yellow-100 font-medium" htmlFor="password">
              {isNewUser ? 'Create Password' : 'Password'}
            </label>
            <input 
              id="password" 
              type="password" 
              className={getInputStyles('password', password)} 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              onBlur={() => setTouchedFields(prev => ({ ...prev, password: true }))} 
              placeholder={isNewUser ? "Minimum 8 characters" : "Enter your password"} 
            />
            {formErrors.password && <p className="text-red-400 text-sm">{formErrors.password}</p>}
          </div>
          {isNewUser && (
            <div className="space-y-1">
              <label className="block text-yellow-100 font-medium" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <input 
                id="confirmPassword" 
                type="password" 
                className={getInputStyles('confirmPassword', confirmPassword)} 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                onBlur={() => setTouchedFields(prev => ({ ...prev, confirmPassword: true }))} 
                placeholder="Re-enter your password" 
              />
              {formErrors.confirmPassword && <p className="text-red-400 text-sm">{formErrors.confirmPassword}</p>}
            </div>
          )}
          <button 
            type="submit" 
            className="w-full py-3 px-4 bg-yellow-400 hover:bg-yellow-300 text-green-900 font-bold rounded-lg transition duration-200 shadow-md hover:shadow-lg hover:shadow-yellow-300/20"
          >
            Next
          </button>

        </form>
          {loginError && (
          <div className="mt-4 p-3 bg-red-900/50 text-red-100 rounded-lg text-center">
            {loginError}
          </div>
        )}

        <div className="mt-6 text-center">
          <p className="text-green-100">
            {isNewUser ? 'Already registered? ' : 'New to VermiMetrics? '}
            <button 
              className="text-yellow-300 hover:text-yellow-200 font-medium underline underline-offset-2" 
              onClick={() => {
                setIsNewUser(!isNewUser);
                setPassword('');
                setConfirmPassword('');
                setFormErrors({});
                setTouchedFields({});
              }} 
              type="button"
            >
              {isNewUser ? 'Sign in instead' : 'Create an account'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};