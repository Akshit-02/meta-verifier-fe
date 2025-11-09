import { getCurrentUser } from "aws-amplify/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { manageUserApi } from "../services/handleApi";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = async () => {
    try {
      setIsLoading(true);

      const authListener = await getCurrentUser();

      const userRes = await manageUserApi("GET", {
        id: `${authListener.username}::${authListener.username}`,
      });

      setUser(userRes.items?.[0]);
      setIsAuthenticated(true);
    } catch (error) {
      console.log("error", error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const value = {
    user,
    isAuthenticated,
    isLoading,
  };

  return (
    <UserContext.Provider value={value}>
      {!isLoading && children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export default UserContext;
