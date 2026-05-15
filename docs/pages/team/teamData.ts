export { teamData }
export type { TeamMember }

// Plain-data source of truth for the team list. Imported by:
//   - pages/team/maintainersList.tsx (decorates each entry with JSX roles)
//   - vite.config.ts (serves it as /team.json via teamJsonPlugin)
// Keep this file JSX-free so it can be loaded from vite.config.ts.

type TeamMember = {
  username: string
  firstName: string
  isCoreTeam: boolean
}

const teamData = [
  { username: 'brillout', firstName: 'Rom', isCoreTeam: true },
  { username: 'magne4000', firstName: 'Joël', isCoreTeam: true },
  { username: 'nitedani', firstName: 'Dániel', isCoreTeam: true },
  { username: 'richard-unterberg', firstName: 'Richard', isCoreTeam: true },
  { username: 'phonzammi', firstName: 'Muhammad', isCoreTeam: true },
  { username: 'NilsJacobsen', firstName: 'Nils', isCoreTeam: false },
  { username: 'louwers', firstName: 'Bart', isCoreTeam: false },
  { username: 'ambergristle', firstName: 'Aristo', isCoreTeam: false },
  { username: 'lourot', firstName: 'Aurélien', isCoreTeam: false },
  { username: '4350pChris', firstName: 'Chris', isCoreTeam: false },
  { username: 'Blankeos', firstName: 'Carlo', isCoreTeam: false },
] as const satisfies TeamMember[]
