const assert = require('assert');
const fs = require('fs');
const pages = require('../pages');

const category = 'audit-knowledge';
// Reset storage
fs.writeFileSync(pages.categoryFiles[category], '[]');

const created = pages.createPage(category, 'Test Title', 'Test Body');
assert.ok(created.id, 'created page has id');

const fetched = pages.getPage(category, created.id);
assert.strictEqual(fetched.title, 'Test Title');

pages.updatePage(category, created.id, 'Updated Title', 'Updated Body');
const updated = pages.getPage(category, created.id);
assert.strictEqual(updated.title, 'Updated Title');

const list = pages.listPages(category);
assert.strictEqual(list.length, 1);

pages.deletePage(category, created.id);
const listAfter = pages.listPages(category);
assert.strictEqual(listAfter.length, 0);

console.log('CRUD operations succeeded');
