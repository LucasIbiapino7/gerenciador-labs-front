import { Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header";

import Landing from "./pages/Landing";
import Callback from "./pages/Callback";
import LabsHome from "./pages/LabsHome";
import Laboratorio from "./pages/Laboratorio";
import LabFeed from "./pages/LabFeed";
import LabMaterial from "./pages/LabMaterial";
import LabMembros from "./pages/LabMembros";
import LabEventos from "./pages/LabEventos";
import LabAdminLayout from "./pages/LabAdminLayout";
import LabAdminInformation from "./pages/LabAdminInformations";
import LabAdminEvents from "./pages/LabAdminEvents"
import LabAdminMaterial from "./pages/LabAdminMaterial"
import LabAdminMembro from "./pages/LabAdminMembro";

function App() {
  return (
    <>
      <Header />

      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/labs" element={<LabsHome />} />
        <Route path="/callback" element={<Callback />} />
        <Route path="/labs/:id/*" element={<Laboratorio />}>
          <Route index element={<LabFeed />} />
          <Route path="feed" element={<LabFeed />} />
          <Route path="eventos" element={<LabEventos />} />
          <Route path="membros" element={<LabMembros />} />
          <Route path="materiais" element={<LabMaterial />} />
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
