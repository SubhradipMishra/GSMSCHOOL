import { createContext, useContext } from "react";

const Context = createContext(null);

export const useAuth = () => useContext(Context);

export default Context;
