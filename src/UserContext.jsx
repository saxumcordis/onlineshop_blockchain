import React, {useState, useContext} from 'react'; 

const UserContext = React.createContext(null); // создаём контекст, который будет существовать независимо от всего

const useUserContext = () => useContext(UserContext); //используем контекст

const UserProvider = ({children}) => { //создаём провайдер, который будет передавать контекст в другие объекты
　const [user, setUser] = useState(null);
　const value = {user, setUser};
　return (
　　<UserContext.Provider value={value}>
　　　{children}
　　</UserContext.Provider>
　);
};

export {UserProvider, useUserContext, UserContext};