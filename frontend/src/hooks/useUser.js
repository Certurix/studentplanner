import { useState } from "react";

const useUser = () => {
  const [userId] = useState(3);
  return userId;
};

export default useUser;