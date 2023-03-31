import { Header } from '@/components/header/header'
import { getRankings, Ranking } from '@/util/playerUtil';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useState } from 'react';


export default () => {
  const [rankings, setRankings] = useState<Ranking[]>([]);
  const [loading, setLoading] = useState(false);

  if (!loading && rankings.length === 0) {
    setLoading(true);
    getRankings().then((rankings) => {
        setRankings(rankings);
    });
  }

  return (
    <>
      <Header />
      <div className="content">
        <div className="pageTitle">Player Rankings</div>
        <TableContainer component={Paper}>
          <Table aria-label="rankings table">
            <TableHead>
              <TableRow>
                <TableCell>Rank</TableCell>
                <TableCell>Player</TableCell>
                <TableCell>Elo</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rankings.map((ranking, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{ranking.name}</TableCell>
                  <TableCell>{ranking.elo}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </>
  )
};
