// // import React, { createContext, useState, useEffect, useContext } from 'react';
// // import axios from 'axios';

// // const AuthContext = createContext();

// // export const AuthProvider = ({ children }) => {
// //   const [user, setUser] = useState(null);
// //   const [loading, setLoading] = useState(true);

// //   useEffect(() => {
// //     checkUserLoggedIn();
// //   }, []);

// //   const checkUserLoggedIn = async () => {
// //     try {
// //       const res = await axios.get('/api/auth/user/', {
// //         withCredentials: true,
// //       });
// //       setUser(res.data);
// //     } catch (err) {
// //       setUser(null);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const login = async (username, password) => {
// //     const res = await axios.post('/api/auth/login/', { username, password }, {
// //       withCredentials: true,
// //     });
// //     setUser(res.data.user);
// //   };

// //   const register = async (userData) => {
// //     const res = await axios.post('/api/register/', userData);
// //     return res.data;
// //   };

// //   const logout = async () => {
// //     await axios.post('/api/auth/logout/', {}, { withCredentials: true });
// //     setUser(null);
// //   };

// //   return (
// //     <AuthContext.Provider value={{ user, loading, login, register, logout }}>
// //       {children}
// //     </AuthContext.Provider>
// //   );
// // };

// // export const useAuth = () => useContext(AuthContext); // ✅ Add this line
// // export default AuthContext;

// import React, { createContext, useState, useEffect } from 'react';
// import axios from 'axios';

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);      // logged-in user info
//   const [loading, setLoading] = useState(true);

//   // On app load, check localStorage for token & validate user
//   useEffect(() => {
//     const token = localStorage.getItem('authToken');
//     if (token) {
//       // Set token on axios default headers
//       axios.defaults.headers.common['Authorization'] = `Token ${token}`;
//       fetchUser();
//     } else {
//       setLoading(false);
//     }
//   }, []);

//   const fetchUser = async () => {
//     try {
//       const res = await axios.get('/api/auth/user/');
//       setUser(res.data);
//     } catch (err) {
//       // Token invalid or expired
//       logout();
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Login: send credentials, receive token, save it, fetch user info
//   const login = async (username, password) => {
//     const res = await axios.post('/api/auth/login/', { username, password });
//     const token = res.data.token;
//     localStorage.setItem('authToken', token);
//     axios.defaults.headers.common['Authorization'] = `Token ${token}`;
//     setUser(res.data.user);
//   };

//   // Logout: clear token & user info
//   const logout = () => {
//     localStorage.removeItem('authToken');
//     delete axios.defaults.headers.common['Authorization'];
//     setUser(null);
//   };

//   // Registration can remain simple (adjust if your backend returns token on register)
//   const register = async (userData) => {
//     const res = await axios.post('/api/register/', userData);
//     return res.data;
//   };

//   return (
//     <AuthContext.Provider value={{ user, loading, login, logout, register }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export default AuthContext;
