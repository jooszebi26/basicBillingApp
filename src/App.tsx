import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import RequireAuth from "./components/RequireAuth";
import AdminUsersPage from "./pages/AdminUsersPage";
import MainLayout from "./layouts/MainLayout";
import ProfilePage from "./pages/ProfilePage";
import BillsPage from "./pages/BillsPage";
import BillCreatePage from "./pages/BillCreatePage";
import BillDetailsPage from "./pages/BillDetailsPage";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element= {<RequireAuth><MainLayout/></RequireAuth>}>
        <Route path="/profil" element={<ProfilePage />} />
        <Route path="/bills" element={<BillsPage />} />
        <Route path="/admin/users" element={<AdminUsersPage />} />
        <Route path="/bills/create" element = {<BillCreatePage/>}/>
        <Route path="/bills/:id" element = {<BillDetailsPage></BillDetailsPage>}/>
        </Route>
        <Route path="*" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
