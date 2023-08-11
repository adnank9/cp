import logo from "./logo.svg";
import "./App.css";
import CloudDetailComponent from "./components/cloudDetails/cloudDetailsComponent";
import ModalComponent from "./components/modal/modalComponent";
import TableComponent from "./components/table/tableComponent";
import { UserProvider } from "./components/userContext/userContext";

function App() {
  return (
    <UserProvider className="container">
      {/* <CloudDetailComponent /> */}
      {/* <ModalComponent /> */}
      <TableComponent />
    </UserProvider>
  );
}

export default App;
