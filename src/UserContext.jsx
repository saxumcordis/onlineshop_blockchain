import React, {useState, useContext} from 'react'; 

const UserContext = React.createContext(null);

const useUserContext = () => useContext(UserContext);

const UserProvider = ({children}) => {
　const [user, setUser] = useState(null);
　const value = {user, setUser};
　return (
　　<UserContext.Provider value={value}>
　　　{children}
　　</UserContext.Provider>
　);
};

export {UserProvider, useUserContext, UserContext};