import { useState } from 'react';
import AdminLabsTab from '../components/Admin/AdminLabsTab';
import AdminUsersTab from '../components/Admin/AdminUsersTab';
import CreateLabModal from '../components/Admin/CreateLabModal';
import ChangeOwnerPanel from '../components/Admin/ChangeOwnerPanel';
import { createLaboratorio, patchLabOwner } from '../services/AdminLabService';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('labs');

  const [createOpen, setCreateOpen] = useState(false);
  const [ownerPanelLab, setOwnerPanelLab] = useState(null);
  const [newLabTrigger, setNewLabTrigger] = useState(null);
  const [ownerUpdatedLabId, setOwnerUpdatedLabId] = useState(null);
  const [ownerUpdatedData, setOwnerUpdatedData] = useState(null);

  async function handleCreateLab(formData) {
    try {
      const created = await createLaboratorio(formData);
      const local = {
        id: created.id,
        nome: created.nome,
        descricaoCurta: created.descricaoCurta || '',
        owner: null,
        totalMembros: 0,
      };
      // dispara para AdminLabsTab inserir
      setNewLabTrigger(local);
      setCreateOpen(false);
    } catch (err) {
      console.error(err);
      alert('Erro ao criar laboratório.');
    }
  }

  async function handleOwnerSelected(user) {
    try {
      await patchLabOwner(ownerPanelLab.id, user.id);
      setOwnerUpdatedLabId(ownerPanelLab.id);
      setOwnerUpdatedData({
        id: user.id,
        nome: user.nome,
        email: user.email || null
      });
      setOwnerPanelLab(null);
    } catch (err) {
      console.error(err);
      alert('Erro ao definir owner.');
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          Administração Global
        </h1>
        <p className="text-sm text-gray-500">
          Gestão de laboratórios, usuários e permissões.
        </p>
      </header>
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex gap-4 overflow-x-auto text-sm font-medium">
          <button
            onClick={() => setActiveTab('labs')}
            className={`whitespace-nowrap border-b-2 px-3 py-2 transition
              ${
                activeTab === 'labs'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
          >
            Laboratórios
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`whitespace-nowrap border-b-2 px-3 py-2 transition
              ${
                activeTab === 'users'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
          >
            Usuários
          </button>
        </nav>
      </div>
      <div>
        {activeTab === 'labs' && (
          <AdminLabsTab
            onOpenCreate={() => setCreateOpen(true)}
            onOpenOwnerPanel={lab => setOwnerPanelLab(lab)}
            externalCreateTrigger={newLabTrigger}
            setExternalCreateTrigger={setNewLabTrigger}
            ownerUpdatedLabId={ownerUpdatedLabId}
            ownerUpdatedData={ownerUpdatedData}
          />
        )}

        {activeTab === 'users' && <AdminUsersTab />}
      </div>
      <CreateLabModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreate={handleCreateLab}
      />
      <ChangeOwnerPanel
        open={!!ownerPanelLab}
        lab={ownerPanelLab}
        onClose={() => setOwnerPanelLab(null)}
        onSelect={handleOwnerSelected}
      />
    </div>
  );
}
