import { useContext, useState, useEffect } from "react";
import UserContext from "@/context/UserContext";

const useUser = () => {
  const { userId, updateUserId } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      updateUserId(Number(storedUserId));
      setIsAuth(true);
    }
    setLoading(false);
  }, [updateUserId]);

  const clearUserId = () => {
    updateUserId(null);
    localStorage.removeItem("userId");
    setIsAuth(false);
  };

  return { userId, updateUserId, clearUserId, loading, isAuth };
};

export default useUser;