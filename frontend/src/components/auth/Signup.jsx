    // client/src/components/auth/Signup.jsx
  import React, { useState } from 'react';
  import Button from '../ui/Button';
   import useStore from '../../store/store';
  import { useNavigate } from 'react-router-dom';

   function Signup() {
     const [username, setUsername] = useState('');
       const [email, setEmail] = useState('');
      const [password, setPassword] = useState('');
    const { signup, error, loading, setError } = useStore();
       const navigate = useNavigate();

       const handleSubmit = async (e) => {
          e.preventDefault();
         try{
              await signup({username, email, password})
            navigate('/')
          } catch (err) {
               console.error('Error on signup', err)
              setError(err.message);
           }
        };

    return (
         <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
             <div className="bg-white p-8 rounded shadow-md w-96">
                <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center">Sign up</h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                     <input
                       type="text"
                      placeholder="Username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                     className="border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                     />
                    <input
                      type="email"
                        placeholder="Email"
                         value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                     />
                    <input
                     type="password"
                     placeholder="Password"
                     value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    className="border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                   />
                    <Button type="submit" variant="primary" className="w-full" disabled={loading}>
                     {loading ? 'Loading...' : 'Sign up'}
                   </Button>
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
              </form>
            <p className="mt-4 text-center text-gray-500">
                  Already have an account?{' '}
               <a href="/login" className="text-primary hover:underline">
                 Login
                 </a>
            </p>
          </div>
       </div>
     );
   }

    export default Signup;
  