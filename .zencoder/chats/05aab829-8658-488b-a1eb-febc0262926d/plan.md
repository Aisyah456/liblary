# Spec and build

## Agent Instructions

Ask the user questions when anything is unclear or needs their input. This includes:

- Ambiguous or incomplete requirements
- Technical decisions that affect architecture or user experience
- Trade-offs that require business context

Do not make assumptions on important decisions — get clarification first.

---

## Workflow Steps

### [x] Step: Technical Specification

Assess the task's difficulty, as underestimating it leads to poor outcomes.

- easy: Straightforward implementation, trivial bug fix or feature
- medium: Moderate complexity, some edge cases or caveats to consider
- hard: Complex logic, many caveats, architectural considerations, or high-risk changes

Create a technical specification for the task that is appropriate for the complexity level:

- Review the existing codebase architecture and identify reusable components.
- Define the implementation approach based on established patterns in the project.
- Identify all source code files that will be created or modified.
- Define any necessary data model, API, or interface changes.
- Describe verification steps using the project's test and lint commands.

Save the output to `c:\xampp\htdocs\abalone\.zencoder\chats\05aab829-8658-488b-a1eb-febc0262926d/spec.md` with:

- Technical context (language, dependencies)
- Implementation approach
- Source code structure changes
- Data model / API / interface changes
- Verification approach

If the task is complex enough, create a detailed implementation plan based on `c:\xampp\htdocs\abalone\.zencoder\chats\05aab829-8658-488b-a1eb-febc0262926d/spec.md`:

- Break down the work into concrete tasks (incrementable, testable milestones)
- Each task should reference relevant contracts and include verification steps
- Replace the Implementation step below with the planned tasks

Rule of thumb for step size: each step should represent a coherent unit of work (e.g., implement a component, add an API endpoint, write tests for a module). Avoid steps that are too granular (single function).

Save to `c:\xampp\htdocs\abalone\.zencoder\chats\05aab829-8658-488b-a1eb-febc0262926d/plan.md`. If the feature is trivial and doesn't warrant this breakdown, keep the Implementation step below as is.

---

### [ ] Step: Implementation

1. **Fix PHP Style Issues**
   - Run `composer lint` (Pint) to fix style issues automatically.
2. **Fix React Component Errors**
   - Address `setState` in `useEffect` in `TurnitinProcess.tsx`, `LibraryFree.tsx`, `References.tsx`.
   - Remove unused variables/imports in various components.
   - Replace `any` types with proper interfaces in navigation and student/user components.
3. **Verification and Testing**
   - Run `npm run lint` and `npm run types`.
   - Run `php artisan test` (if applicable).
4. **Final Report**
   - Write a report to `c:\xampp\htdocs\abalone\.zencoder\chats\05aab829-8658-488b-a1eb-febc0262926d/report.md`.
