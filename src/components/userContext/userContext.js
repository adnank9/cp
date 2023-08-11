import React, { createContext, useContext, useState } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [newUserData, setNewUserData] = useState([]);

  return (
    <UserContext.Provider value={{ newUserData, setNewUserData }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);

// import { createContext, useContext, useState } from "react";

// const UserContext = createContext();

// export const UserProvider = ({ children }) => {
//   const [userData, setUserData] = useState([]);

//   const updateUser = (updatedUser) => {
//     setUserData((prevUserData) =>
//       prevUserData.map((user) =>
//         user.id === updatedUser.id ? updatedUser : user
//       )
//     );
//   };

//   return (
//     <UserContext.Provider value={{ userData, updateUser }}>
//       {children}
//     </UserContext.Provider>
//   );
// };

// export const useUserContext = () => useContext(UserContext);
