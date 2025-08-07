const fs = require('fs');
const path = require('path');

const categoryFiles = {
  'audit-knowledge': path.join(__dirname, 'data', 'audit_knowledge.json'),
  'client-permanent': path.join(__dirname, 'data', 'client_permanent.json'),
  'current-year': path.join(__dirname, 'data', 'current_year.json')
};

function ensureFile(file) {
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, '[]');
  }
}

function read(category) {
  const file = categoryFiles[category];
  if (!file) throw new Error('Unknown category');
  ensureFile(file);
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function write(category, data) {
  const file = categoryFiles[category];
  ensureFile(file);
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

function listPages(category) {
  return read(category);
}

function getPage(category, id) {
  return read(category).find(p => p.id === id);
}

function createPage(category, title, body) {
  const pages = read(category);
  const id = pages.length ? pages[pages.length - 1].id + 1 : 1;
  const page = { id, title, body };
  pages.push(page);
  write(category, pages);
  return page;
}

function updatePage(category, id, title, body) {
  const pages = read(category);
  const page = pages.find(p => p.id === id);
  if (!page) return null;
  page.title = title;
  page.body = body;
  write(category, pages);
  return page;
}

function deletePage(category, id) {
  const pages = read(category);
  const index = pages.findIndex(p => p.id === id);
  if (index === -1) return false;
  pages.splice(index, 1);
  write(category, pages);
  return true;
}

module.exports = {
  listPages,
  getPage,
  createPage,
  updatePage,
  deletePage,
  categoryFiles
};
