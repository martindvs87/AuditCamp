import { useState } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';

export default function NewProjectForm({ user }) {
  const supabase = useSupabaseClient();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!user) {
      setError('You must be logged in to create a project.');
      return;
    }

    setLoading(true);
    try {
      const { error: supabaseError } = await supabase
        .from('projects')
        .insert({ name, description, user_id: user.id });

      if (supabaseError) {
        setError(supabaseError.message);
      } else {
        setName('');
        setDescription('');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Project name"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Project'}
        </button>
      </form>
    </div>
  );
}

