import { createContext, useContext, useState } from "react";

export const AuthContext = createContext(null);

// AuthProvider = Wrapping component
export default function AuthProvider({ children }) {

    const [user, setUser] = useState(
        localStorage.getItem("currentUserEmail") 
            ? { email: localStorage.getItem("currentUserEmail") }
            : null
    );

    function signup(email, password) {
        
        const users = JSON.parse(localStorage.getItem("users") || "[]");
        if(users.find(u => u.email === email)){
            return { success: false, error: "Email already exists" };
        }
        const newUser = { email, password };
        users.push(newUser);
        localStorage.setItem("users", JSON.stringify(users));
        localStorage.setItem("currentUserEmail", email);

        setUser({ email });

        return { success: true }
        
    }

    function login(email, password) {
        const users = JSON.parse(localStorage.getItem("users") || "[]");
        const user = users.find(u => u.email === email && u.password === password);
        
        if(!user) {
            return { success: false, error: "Invalid email or password" }; 
        }

        localStorage.setItem("currentUserEmail", email);
        setUser({ email });

        return { success: true }

    }

    function logout() {
        localStorage.removeItem("currentUserEmail");
        setUser(null);
    }

    return <AuthContext.Provider value={ { signup, user, logout, login } }> {children} </AuthContext.Provider>;
}


export function useAuth(){
    const context = useContext(AuthContext);

    return context;
}