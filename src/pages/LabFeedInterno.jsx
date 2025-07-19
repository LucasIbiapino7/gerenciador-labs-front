import { useOutletContext, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import PostCard from "../components/Feed/PostCard";
import PostSubmit from "../components/Feed/PostSubmit";
import { listarPostsInterno } from "../services/PostService";

export default function LabFeed() {
  const { labId, member } = useOutletContext();
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [loading, setLoad] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!member) {
      setError("Apenas membros podem ver este feed.");
      setLoad(false);
      return;
    }

    listarPostsInterno(labId)
      .then(setPosts)
      .catch((err) => {
        if (err.response?.status === 404) {
          navigate("/404", { replace: true });
        } else if (err.response?.status === 403) {
          setError("Apenas membros podem ver este feed.");
        } else {
          setError("Não foi possível carregar o feed interno.");
        }
      })
      .finally(() => setLoad(false));
  }, [labId, member, navigate]);


  if (loading) return <p>Carregando feed interno…</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {member && (
        <PostSubmit
          labId={labId}
          isPrivate={true}
          onCreated={(p) => setPosts([p, ...posts])}
        />
      )}

      {posts.map((p) => (
        <PostCard key={p.id} item={p} />
      ))}

      {!posts.length && <p className="text-gray-500">Nenhum post ainda.</p>}
    </div>
  );
}
