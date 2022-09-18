import React, { createContext, useReducer } from "react";

const initialState = {
  navbar: false,
  loggedIn: false,
};

const AppReducer = (state, action) => {
  switch (action.type) {
    case "DISABLE_NAVBAR":
      return {
        ...state,
        navbar: true,
      };
    case "ENABLE_NAVBAR":
      return {
        ...state,
        navbar: false,
      };
    case "LOGIN":
      console.log("LOGIN");
      return {
        ...state,
        loggedIn: true,
      };
    case "LOGOUT":
      return {
        ...state,
        loggedIn: false,
      };
    default:
      return state;
  }
};

export const GlobalContext = createContext(initialState);

// eslint-disable-next-line react/prop-types
export const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AppReducer, initialState);

  // Actions for changing state

  const disableNavbar = () => {
    dispatch({ type: "DISABLE_NAVBAR" });
  };

  const enableNavbar = () => {
    dispatch({ type: "ENABLE_NAVBAR" });
  };

  const login = () => {
    dispatch({ type: "LOGIN" });
  };

  const logout = () => {
    dispatch({ type: "LOGOUT" });
  };

  return (
    <GlobalContext.Provider
      value={{
        navbar: state.navbar,
        loggedIn: state.loggedIn,
        disableNavbar,
        enableNavbar,
        login,
        logout,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
