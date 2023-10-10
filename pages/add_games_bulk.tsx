import { Header } from '@/components/header/header';
import { useCreatePlayer, useGetPlayers } from '@/services/playerService';
import {
    Autocomplete,
    AutocompleteRenderInputParams,
    Box,
    Button,
    FormControl,
    IconButton,
    InputLabel,
    MenuItem,
    Modal,
    TextField,
} from '@mui/material';
import { Player } from '@prisma/client';
import { ChangeEvent, useState } from 'react';

import styles from '@/styles/AddGamesBulk.module.css';
import { AdminOnly } from '@/components/admin-only';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAddGamesBulk, useGetGameTypes } from '@/services/gameService';
import { useQueryClient } from '@tanstack/react-query';

const isValidEmail = (email: string) => email.match('(.*@.*\\.nmt\\.edu)+') != null;

const playerSection = (
    players: Player[] | undefined,
    player: Player | null,
    setPlayer: (player: Player | null) => void,
    score: number,
    setScore: (score: number) => void,
    showError: boolean,
) => {
    if (!players) return <></>;

    const autoCompProps = {
        options: players,
        getOptionLabel: (option: Player) => option.name,
        className: styles.playerInput,
        renderInput: (params: AutocompleteRenderInputParams) => (
            <TextField
                {...params}
                label="Name"
                error={showError}
                required
                inputProps={{
                    ...params.inputProps,
                    autoComplete: "off",
                }}
            />
        ),
    };

    return (
          <div className={styles.playerInputs}>
              <Autocomplete
                  {...autoCompProps}
                  id="name"
                  value={player}
                  onChange={(e, newValue: Player | null) => {
                      setPlayer(newValue);
                  }}
              />
              <TextField
                  id="score"
                  label="Score"
                  type="number"
                  className={styles.scoreInput}
                  value={score}
                  error={showError}
                  onChange={(
                      e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
                  ) => {
                      if (e.target.value === '') setScore(0);
                      const val = parseInt(e.target.value);
                      if (val >= 0) setScore(val);
                  }}
              />
          </div>
    );
};

type EnteredGame = {
  player1: Player | null,
  score1: number,
  player2: Player | null,
  score2: number,
};

export const AddGame = () => {
    const [enteredGames, setEnteredGames] = useState<EnteredGame[]>([{
      player1: null,
      score1: 0,
      player2: null,
      score2: 0
    }]);

    const [gameType, setGameType] = useState(1);

    const [errors, setErrors] = useState<number[]>([]);

    const [showCreatePlayer, setShowCreatePlayer] = useState(false);
    const [newPlayerName, setNewPlayerName] = useState('');
    const [newPlayerEmail, setNewPlayerEmail] = useState('');

    const {
        data: players
    } = useGetPlayers();
    const {
        data: gameTypes
    } = useGetGameTypes();

    console.log(gameTypes);

    const mutation = useAddGamesBulk();
    const createPlayerMutation = useCreatePlayer();
    const queryClient = useQueryClient();

    const addGame = () => {
      setEnteredGames([...enteredGames, {
        player1: null,
        score1: 0,
        player2: null,
        score2: 0
      }]);
      setErrors([]);
    }

    const deleteGame = (i: number) => {
      setEnteredGames(enteredGames.filter((_,index) => index !== i));
      setErrors([]);
    }

    const setGameValue = (i: number, key: keyof EnteredGame, value: Player | number | null) => {
      setEnteredGames(enteredGames.map((game, index) => {
        if (index === i) {
          const newGame: EnteredGame = {
            ...game
          };
          newGame[key] = value as any;
          return newGame;
        }
        return game;
      }));
    }

    const submitCreatePlayer = () => {
      if (newPlayerName.length === 0 || newPlayerEmail.length === 0 || !isValidEmail(newPlayerEmail)) {
        return;
      }

      createPlayerMutation.mutate({
        name: newPlayerName,
        email: newPlayerEmail,
      }, {
        onSuccess: () => {
          setNewPlayerName('');
          setNewPlayerEmail('');
          setShowCreatePlayer(false);
          queryClient.invalidateQueries(['getPlayers']);
        }
      });
    };

    const submit = () => {
        const gameErrors: number[] = [];
        enteredGames.forEach((game, i) => {
          if (game.player1 == null || game.player2 == null || (game.score1 === 0 && game.score2 === 0)) {
            gameErrors.push(i);
          }
        });
        if (gameErrors.length > 0) {
          setErrors(gameErrors);
          return;
        }

        mutation.mutate({
            games: enteredGames.map(game => ({
              player1: game.player1?.email as string,
              score1: game.score1,
              player2: game.player2?.email as string,
              score2: game.score2,
            })),
            gameType,
        }, {
            onSuccess: () => {
              setEnteredGames([{
                player1: null,
                score1: 0,
                player2: null,
                score2: 0
              }]);
              setGameType(1);
              setErrors([]);
            }
        })
    };

    return (
        <>
            <Header />
            <AdminOnly>
                <div className="content">
                    <div className="pageTitle">Add Games</div>
                    <div className={styles.formArea}>
                        {enteredGames.map((game, i) => (
                          <div className={styles.gameRow} key={i}>
                              {playerSection(
                                  players,
                                  game.player1,
                                  player => setGameValue(i, "player1", player),
                                  game.score1,
                                  score => setGameValue(i, "score1", score),
                                  i in errors,
                              )}
                              <span style={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                              }}>vs</span>
                              {playerSection(
                                  players,
                                  game.player2,
                                  player => setGameValue(i, "player2", player),
                                  game.score2,
                                  score => setGameValue(i, "score2", score),
                                  i in errors,
                              )}
                              <IconButton onClick={() => deleteGame(i)}><DeleteIcon/></IconButton>
                          </div>
                        ))}
                        <Button style={{marginTop: '20px'}} onClick={addGame} fullWidth>+ Add game</Button>
                        <FormControl sx={{ marginTop: '20px' }}>
                            <InputLabel id="gameLabel">Game</InputLabel>
                            <Select
                                labelId="gameLabel"
                                id="game"
                                defaultValue={1}
                                value={gameType}
                                label="Game"
                                onChange={(e: SelectChangeEvent<number>) =>
                                    setGameType(
                                        typeof e.target.value === 'string'
                                            ? parseInt(e.target.value)
                                            : e.target.value,
                                    )
                                }
                            >
                                {
                                  gameTypes?.map(gameType => (
                                    <MenuItem key={Number(gameType.id)} value={Number(gameType.id)}>{gameType.name}</MenuItem>
                                  ))
                                }
                            </Select>
                        </FormControl>
                        <div style={{
                          display: 'flex',
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          marginTop: '10px',
                          width: '100%',
                        }}>
                          <Button
                              onClick={submit}
                              disabled={mutation.isLoading}
                              variant="contained"
                              sx={{ width: '150px', marginTop: '20px' }}
                          >
                              Add games
                          </Button>
                          <Button
                              variant="contained"
                              sx={{ width: '200px', marginTop: '20px' }}
                              onClick={() => setShowCreatePlayer(true)}
                            >
                              Create new player
                          </Button>
                        </div>
                    </div>
                </div>
                <Modal
                  open={showCreatePlayer}
                  onClose={() => setShowCreatePlayer(false)}
                >
                    <Box className={styles.createPlayerModal}>
                        <div className={styles.createPlayerContainer}>
                            <h2>Create a new player</h2>
                            <TextField
                                id="newPlayerName"
                                label="Name"
                                className={styles.playerInput}
                                value={newPlayerName}
                                fullWidth
                                onChange={(
                                    e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
                                ) => {
                                  setNewPlayerName(e.target.value);
                                }}
                            />
                            <TextField
                                id="newPlayerEmail"
                                label="Email"
                                className={styles.playerInput}
                                value={newPlayerEmail}
                                fullWidth
                                onChange={(
                                    e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
                                ) => {
                                  setNewPlayerEmail(e.target.value);
                                }}
                            />
                            <Button 
                              style={{marginTop: '20px'}}
                              variant='contained'
                              onClick={submitCreatePlayer}
                            >
                              Create
                            </Button>
                        </div>
                    </Box>
                </Modal>
            </AdminOnly>
        </>
    );
};

export default AddGame;