import { Header } from '@/components/header/header';
import { getPlayers } from '@/util/playerUtil';
import {
    Autocomplete,
    AutocompleteRenderInputParams,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    TextField,
} from '@mui/material';
import { Player } from '@prisma/client';
import { ChangeEvent, Dispatch, SetStateAction, useState } from 'react';

import styles from '@/styles/AddGame.module.css';
import { AdminOnly } from '@/components/admin-only';
import Select, { SelectChangeEvent } from '@mui/material/Select';

const isValidEmail = (email: string) => email.match('(.*@.*\\.nmt\\.edu)+') != null;

const playerSection = (
    players: Player[],
    player: Player | string,
    setPlayer: Dispatch<SetStateAction<string | Player>>,
    email: string,
    setEmail: Dispatch<SetStateAction<string>>,
    score: number,
    setScore: Dispatch<SetStateAction<number>>,
    showError: boolean,
) => {
    const playerExists = typeof player !== 'string';

    const playerErr = player === '' && showError;
    const emailErr = !isValidEmail(email) && showError;

    const autoCompProps = {
        freeSolo: true,
        options: players,
        getOptionLabel: (option: Player | string) =>
            typeof option === 'string' ? option : option.name,
        className: styles.playerInput,
        renderInput: (params: AutocompleteRenderInputParams) => (
            <TextField
                {...params}
                error={playerErr}
                label="Name"
                required
                autoComplete="off"
                inputProps={{
                    ...params.inputProps,
                    autoComplete: Math.random().toString(36).substring(7),
                }}
            />
        ),
    };

    const emailValue = playerExists ? player.email : email;

    return (
        <div className={styles.playerSection}>
            <div className={styles.playerName}>Player 1</div>
            <div className={styles.playerInputs}>
                <Autocomplete
                    {...autoCompProps}
                    id="name1"
                    value={player}
                    onChange={(e, newValue: Player | string | null) => {
                        if (newValue == null) {
                            if (typeof player !== 'string') setEmail('');
                            setPlayer('');
                            return;
                        }
                        setPlayer(newValue);
                        if (newValue instanceof Object) {
                            setEmail(newValue.email);
                        }
                    }}
                />
                <TextField
                    value={emailValue}
                    onChange={(
                        e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
                    ) => {
                        setEmail(e.target.value);
                    }}
                    InputLabelProps={{
                        shrink: playerExists ? true : undefined,
                    }}
                    id="email1"
                    label="Email"
                    error={emailErr}
                    className={styles.playerInput}
                    required
                />
                <TextField
                    id="score1"
                    label="Score"
                    type="number"
                    className={styles.playerInput}
                    value={score}
                    onChange={(
                        e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
                    ) => {
                        if (e.target.value === '') setScore(0);
                        const val = parseInt(e.target.value);
                        if (val >= 0) setScore(val);
                    }}
                />
            </div>
        </div>
    );
};

export const AddGame = () => {
    const [players, setPlayers] = useState<Player[]>([]);
    const [loading, setLoading] = useState(false);

    const [player1, setPlayer1] = useState<Player | string>('');
    const [email1, setEmail1] = useState('');
    const [score1, setScore1] = useState(0);
    const [player2, setPlayer2] = useState<Player | string>('');
    const [email2, setEmail2] = useState('');
    const [score2, setScore2] = useState(0);

    const [game, setGame] = useState(1);

    const [showError, setShowError] = useState(false);

    const [submitting, setSubmitting] = useState(false);

    if (!loading && players.length === 0) {
        setLoading(true);
        getPlayers().then((players) => {
            setPlayers(players);
        });
    }

    const submit = () => {
        if (![player1, player2, email1, email2].every(Boolean)) {
            setShowError(true);
            return;
        }

        setSubmitting(true);

        const playerName1 = typeof player1 === 'string' ? player1 : player1.name;
        const playerName2 = typeof player2 === 'string' ? player2 : player2.name;

        console.log({
            playerName1,
            email1,
            score1,
            playerName2,
            email2,
            score2,
            game,
        });

        fetch('/api/add_game', {
            body: JSON.stringify({
                player1: playerName1,
                email1,
                score1,
                player2: playerName2,
                email2,
                score2,
                game,
            }),
            method: 'POST',
        }).then((res) => {
            if (res.status === 200) {
                setPlayer1('');
                setEmail1('');
                setScore1(0);
                setPlayer2('');
                setEmail2('');
                setScore2(0);
                setGame(1);
                setSubmitting(false);
            }
        });
    };

    return (
        <>
            <Header />
            <AdminOnly>
                <div className="content">
                    <div className="pageTitle">Add Game</div>
                    <div className={styles.formArea}>
                        <div className="mobileFlex"
                            style={{
                                justifyContent: 'space-between'
                            }}
                        >
                            {playerSection(
                                players,
                                player1,
                                setPlayer1,
                                email1,
                                setEmail1,
                                score1,
                                setScore1,
                                showError,
                            )}
                            {playerSection(
                                players,
                                player2,
                                setPlayer2,
                                email2,
                                setEmail2,
                                score2,
                                setScore2,
                                showError,
                            )}
                        </div>
                        <FormControl sx={{ marginTop: '20px' }}>
                            <InputLabel id="gameLabel">Game</InputLabel>
                            <Select
                                labelId="gameLabel"
                                id="game"
                                defaultValue={1}
                                value={game}
                                label="Game"
                                onChange={(e: SelectChangeEvent<number>) =>
                                    setGame(
                                        typeof e.target.value === 'string'
                                            ? parseInt(e.target.value)
                                            : e.target.value,
                                    )
                                }
                            >
                                <MenuItem value={1}>8-ball</MenuItem>
                                <MenuItem value={2}>9-ball</MenuItem>
                                <MenuItem value={3}>Snooker</MenuItem>
                            </Select>
                        </FormControl>
                        <Button
                            onClick={submit}
                            disabled={submitting}
                            variant="contained"
                            sx={{ width: '150px', marginTop: '20px' }}
                        >
                            Add game
                        </Button>
                    </div>
                </div>
            </AdminOnly>
        </>
    );
};

export default AddGame;