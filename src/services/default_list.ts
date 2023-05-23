export const default_leagues: string[] = [
  'Brasileiro Série A',
]

export const allowed_leagues: string[] = [
  'Brasileiro Série A',
  'Premier League',
  'LaLiga',
  'Serie A',
  'Bundesliga',
  'Ligue 1',
  'Primeira Liga',
  'Eredivisie',
  'UEFA Champions League',
  'UEFA Europa League',
  'UEFA Europa Conference League'
]

export const generateLeagueOptions = () => {
  let options = '';
  allowed_leagues.forEach((league, index) => {
    options += `${index + 1}. ${league}\n`;
  });
  return options;
};
