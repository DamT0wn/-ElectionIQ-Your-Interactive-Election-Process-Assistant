const express = require('express');
const router = express.Router();

/**
 * GET /api/calendar/events
 * Return key election dates for the user to add to their Google Calendar.
 * The frontend uses these to create events via the Google Calendar API (client-side OAuth).
 */
router.get('/events', (req, res) => {
  const year = parseInt(req.query.year, 10) || new Date().getFullYear();

  const events = [
    {
      id: 'voter_reg_deadline',
      title: '📋 Voter Registration Deadline',
      description:
        'Last day to register to vote in the upcoming election. Check your state for specific rules.',
      date: `${year}-10-07`,
      endDate: `${year}-10-07`,
      color: '#6366f1',
      category: 'registration',
    },
    {
      id: 'early_voting_start',
      title: '🗳️ Early Voting Begins',
      description:
        'Early voting period opens in most states. Vote before Election Day to avoid long lines.',
      date: `${year}-10-21`,
      endDate: `${year}-11-04`,
      color: '#8b5cf6',
      category: 'voting',
    },
    {
      id: 'absentee_deadline',
      title: '✉️ Absentee Ballot Request Deadline',
      description: 'Deadline to request an absentee or mail-in ballot in most states.',
      date: `${year}-10-28`,
      endDate: `${year}-10-28`,
      color: '#a78bfa',
      category: 'voting',
    },
    {
      id: 'election_day',
      title: '🇺🇸 Election Day',
      description: 'The first Tuesday after the first Monday in November. Go vote!',
      date: `${year}-11-05`,
      endDate: `${year}-11-05`,
      color: '#ef4444',
      category: 'election',
    },
    {
      id: 'results_certification',
      title: '📊 Results Certification Deadline',
      description: 'States must certify their election results by this date.',
      date: `${year}-12-11`,
      endDate: `${year}-12-11`,
      color: '#10b981',
      category: 'results',
    },
    {
      id: 'electoral_college',
      title: '🏛️ Electoral College Votes',
      description: 'Electors in each state formally cast their votes for president.',
      date: `${year}-12-17`,
      endDate: `${year}-12-17`,
      color: '#f59e0b',
      category: 'results',
    },
    {
      id: 'inauguration',
      title: '🎉 Inauguration Day',
      description: 'The new or re-elected president is sworn into office.',
      date: `${year + 1}-01-20`,
      endDate: `${year + 1}-01-20`,
      color: '#3b82f6',
      category: 'inauguration',
    },
  ];

  res.json({ year, events });
});

module.exports = router;
