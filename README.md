AuditCamp – V1 Specification for Softgen.ai
Owner: Aqueduct Financial Planning Ltd (AQFP)
Platform: Built in Softgen.ai
Backend: Supabase (Auth + Database)
AI Integration: OpenAI (via user-provided API Key)
🔐 Authentication
Use Supabase authentication

Email-based signup and login

Profile fields:

First name, Surname, Role

API Key field for OpenAI integration (set once per user)

🧱 Project Creation & Selection
Users can:

Create a new audit project with:

Client Name

Balance Sheet Date

Period Length (dropdown: 1–12 months)

See a list of existing projects to choose from

Each project has:

A structure of pages stored in 3 categories:

Audit Knowledge (global)

Client Permanent (client-specific)

Current Year (project-specific)

🗂️ Page Categories & Scope
Category	Scope	Description
Audit Knowledge	Global (across all projects)	Permanent conceptual content (e.g., going concern, internal controls)
Client Permanent	Per client	Info relevant to a client across years (e.g., operations, management team)
Current Year	Per project/year	Year-specific audit work and findings (e.g., going concern 2024, fraud work)

Each category is visible in the navigation pane (e.g. left sidebar)

Pages use lightweight Markdown formatting:

Title

Section headings

Paragraphs

Tables (if needed)

No nested lists, colors, or rich styles

➕ New Context Workflow
Purpose:
Allows users to input raw text (from research or ChatGPT Plus) into the system, then use AI to classify and integrate it.

Step-by-Step:
User clicks “New Context”

Opens a scrollable, plain-text input window

User pastes raw text (no formatting features)

Click “Analyze”

AI parses the input and classifies content into:

Audit Knowledge

Client Permanent

Current Year Audit

If no content matches a section, label as "None"

Navigation Arrows:

Navigate between classified categories (Audit Knowledge → Client Permanent → Current Year)

🏷️ Tagging & Page Updating Workflow
Within each section (especially Client Permanent and Current Year):

AI suggests Tags:

Tags represent potential target pages (e.g., “Operations”, “Internal Controls”)

User can:

Accept, delete, or add tags manually

Click “Reanalyze”:

For each selected tag:

App checks if a page with that tag already exists

If exists:

Reads current content of that page

Analyzes how the new context could enhance it

Displays potential additions to user for approval

If page does not exist:

Option to create a new page for the tag

On Approval:

The app sends a prompt to ChatGPT:

Existing page content

New context

Suggested additions

AI returns a rewritten, merged version of the page

App updates the page with the new Markdown content

✅ Summary: MVP Features
Email-based authentication (Supabase)

Project creation and selection

Three content areas: Audit Knowledge, Client Permanent, Current Year

New Context input and classification

Tagging system to route context to correct pages

AI-driven page updating (with user control)

Profile settings with OpenAI API key input

Clean, markdown-based page formatting (no rich text editor needed)# AuditCamp
