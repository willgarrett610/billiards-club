import { Header } from '@/components/header/header'
import { Ranking, useGetRankings } from '@/services/playerService';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';


const Rankings = () => {
  const { data: rankings } = useGetRankings();

  console.log(rankings);

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
              {rankings?.map((ranking: Ranking, index) => (
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

export default Rankings;
