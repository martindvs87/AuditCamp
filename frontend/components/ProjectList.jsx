import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import NewProjectForm from './NewProjectForm';

export default function ProjectList() {
  const [projects, setProjects] = useState([]);

  const fetchProjects = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    const { data } = await supabase
      .from('user_projects')
      .select('project:projects(*)')
      .eq('user_id', user.id);
    setProjects((data || []).map((r) => r.project));
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div>
      <NewProjectForm onCreated={fetchProjects} />
      <ul>
        {projects.map((p) => (
          <li key={p.id}>{p.client_name} – {p.balance_sheet_date} – {p.period_length} months</li>
        ))}
      </ul>
    </div>
  );
}
