import { useContext, useState, useEffect } from "react";
import UserContext from "@/context/UserContext";

const useUser = () => {
  const { userId, updateUserId } = useContext(UserContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      updateUserId(Number(storedUserId));
    }
    setLoading(false);
  }, [updateUserId]);

  const clearUserId = () => {
    updateUserId(null);
    localStorage.removeItem("userId");
  };

  return { userId, updateUserId, clearUserId, loading };
};

export default useUser;