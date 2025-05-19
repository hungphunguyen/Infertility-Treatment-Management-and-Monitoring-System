import React from "react";
import UseRoutesCustom from "./hooks/UseRoutesCustom";

// 1.Khởi tạo 1 context
export const NotificationContext = React.createContext();

function App() {
  const routes = UseRoutesCustom();

  return routes;
}

export default App;
