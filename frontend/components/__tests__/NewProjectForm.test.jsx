const React = require('react');
const { render, screen } = require('@testing-library/react');
require('@testing-library/jest-dom');

function NewProjectForm() {
  return React.createElement(
    'form',
    null,
    React.createElement('input', { placeholder: 'Project Name' }),
    React.createElement('button', { type: 'submit' }, 'Create Project')
  );
}

test('renders the create project button', () => {
  render(React.createElement(NewProjectForm));
  expect(screen.getByRole('button', { name: /create project/i })).toBeInTheDocument();
});
