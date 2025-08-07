import { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function NewProjectForm({ onCreated }) {
  const [clientName, setClientName] = useState('');
  const [balanceSheetDate, setBalanceSheetDate] = useState('');
  const [periodLength, setPeriodLength] = useState(12);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    const { data: project, error } = await supabase
      .from('projects')
      .insert([{ client_name: clientName, balance_sheet_date: balanceSheetDate, period_length: periodLength }])
      .select()
      .single();
    if (!error && user) {
      await supabase.from('user_projects').insert([{ user_id: user.id, project_id: project.id }]);
      onCreated && onCreated(project);
      setClientName('');
      setBalanceSheetDate('');
      setPeriodLength(12);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Client Name"
        value={clientName}
        onChange={(e) => setClientName(e.target.value)}
      />
      <input
        type="date"
        value={balanceSheetDate}
        onChange={(e) => setBalanceSheetDate(e.target.value)}
      />
      <select value={periodLength} onChange={(e) => setPeriodLength(Number(e.target.value))}>
        {Array.from({ length: 12 }).map((_, i) => (
          <option key={i + 1} value={i + 1}>{i + 1} months</option>
        ))}
      </select>
      <button type="submit">Create Project</button>
    </form>
  );
}
