import Header from '@/components/header/header'
import { getPlayers } from '@/util/playerUtil'
import { Autocomplete, TextField } from '@mui/material'
import { Player } from '@prisma/client'
import { useState } from 'react'

export default () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  if (!loading && players.length == 0) {
    setLoading(true);
    getPlayers().then(players => {
      setPlayers(players);
    });
  }

  const options = players.map(player => player.name);

  return (<>
    <Header />
    <div className="pageTitle">Add Game</div>
    <Autocomplete
        id="player-name"
        freeSolo
        options={options}
        renderInput={(params) => <TextField {...params} label="freeSolo" />}
      />
  </>)
}