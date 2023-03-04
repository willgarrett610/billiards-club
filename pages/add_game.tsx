import Header from '@/components/header/header'
import { getPlayers } from '@/util/playerUtil'
import { Autocomplete, AutocompleteRenderInputParams, TextField } from '@mui/material'
import { Player } from '@prisma/client'
import { useState } from 'react'

import styles from '@/styles/AddGame.module.css';
import { useSession } from 'next-auth/react'
import AdminOnly from '@/components/admin-only'

export default () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [player1, setPlayer1] = useState<Player | string | null>(null);
  const [player2, setPlayer2] = useState<Player | string | null>(null);

  if (!loading && players.length == 0) {
    setLoading(true);
    getPlayers().then(players => {
      if (players != null)
        setPlayers(players);
    });
  }

  const autoCompProps = {
    freeSolo: true,
    options: players,
    getOptionLabel: (option: Player | string) => (typeof option == "string") ? option : option.name,
    className: styles.playerInput,
    renderInput: (params: AutocompleteRenderInputParams) => <TextField {...params} label="Name" />
  };

  return (<>
    <Header />
    <AdminOnly>
      <div className="content">
        <div className="pageTitle">Add Game</div>
        <div className={styles.formArea}>
          <div className={styles.playerSection}>
            <div className={styles.playerName}>Player 1</div>
            <div className={styles.playerInputs}>
              <Autocomplete
                {...autoCompProps}
                id="name1"
                value={player1}
                onChange={(e: any, newValue: Player | string | null) => {
                  setPlayer1(newValue);
                }}
              />
              <TextField 
                value={typeof player1 == "string" ? undefined : player1?.email} 
                InputLabelProps={{
                  shrink: (player1 != null && (typeof player1 != "string")) ? true : undefined,
                }}
                id="email1" 
                label="Email" 
                className={styles.playerInput} 
              />
              <TextField
                id="score1"
                label="Score"
                type="number"
                className={styles.playerInput}
                // InputLabelProps={{
                //   shrink: true,
                // }}
              />
            </div>
          </div>
          <div className={styles.playerSection}>
            <div className={styles.playerName}>Player 2</div>
            <div className={styles.playerInputs}>
              <Autocomplete
                {...autoCompProps}
                id="name2"
                value={player2}
                onChange={(e: any, newValue: Player | string | null) => {
                  setPlayer2(newValue);
                }}
              />
              <TextField id="email2" label="Email" className={styles.playerInput}/>
              <TextField
                id="score2"
                label="Score"
                type="number"
                className={styles.playerInput}
                // InputLabelProps={{
                //   shrink: true,
                // }}
              />
            </div>
          </div>
        </div>
      </div>
    </AdminOnly>
  </>)
}