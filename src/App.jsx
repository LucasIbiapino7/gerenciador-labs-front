import { Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header";

import Landing from "./pages/Landing";
import Callback from "./pages/Callback";
import LabsHome from "./pages/LabsHome";
import Laboratorio from "./pages/Laboratorio";
import LabFeed from "./pages/LabFeed";
import LabFeedInterno from "./pages/LabFeedInterno";
import LabMaterial from "./pages/LabMaterial";
import LabMembros from "./pages/LabMembros";
import LabEventos from "./pages/LabEventos";
import LabPesquisas from "./pages/LabPesquisas";
import LabAdminLayout from "./pages/LabAdminLayout";
import LabAdminInformation from "./pages/LabAdminInformations";
import LabAdminEvents from "./pages/LabAdminEvents";
import LabAdminMaterial from "./pages/LabAdminMaterial";
import LabAdminMembro from "./pages/LabAdminMembro";
import Perfil from "./pages/Perfil";
import EditarPerfil from "./pages/EditarPerfil";
import PerfilPublico from "./pages/PerfilPublico";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <>
      <Header />

      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="me" element={<Perfil />} />
        <Route path="me/editar" element={<EditarPerfil />} />
        <Route path="/users/:userId" element={<PerfilPublico />} />
        <Route path="/labs" element={<LabsHome />} />
        <Route path="/callback" element={<Callback />} />
        <Route path="/register" element={<Register />} />
        <Route path="/labs/:id/*" element={<Laboratorio />}>
          <Route index element={<LabFeed />} />
          <Route path="feed" element={<LabFeed />} />
          <Route path="atividades" element={<LabFeedInterno />} />
          <Route path="eventos" element={<LabEventos />} />
          <Route path="membros" element={<LabMembros />} />
          <Route path="materiais" element={<LabMaterial />} />
          <Route path="pesquisas" element={<LabPesquisas />} />
        </Route>
        <Route path="/labs/:id/admin/*" element={<LabAdminLayout />}>
          <Route index element={<LabAdminInformation />} />
          <Route path="eventos" element={<LabAdminEvents />} />
          <Route path="materiais" element={<LabAdminMaterial />} />
          <Route path="membros" element={<LabAdminMembro />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
