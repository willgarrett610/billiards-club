import styles from '@/styles/MobileHeader.module.css';
import MenuIcon from '@mui/icons-material/Menu';
import {
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
} from '@mui/material';
import { Box } from '@mui/system';
import { useState } from 'react';
import HomeIcon from '@mui/icons-material/Home';
import AddIcon from '@mui/icons-material/Add';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import { AdminOnly } from '../admin-only';

export const MobileNavMenu = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    return (
        <>
            <MenuIcon onClick={() => setIsOpen(true)} className={styles.menuBtn} />
            <Drawer anchor="left" open={isOpen} onClose={() => setIsOpen(false)}>
                <Box
                    sx={{ width: 250 }}
                    role="presentation"
                    onClick={() => setIsOpen(false)}
                    onKeyDown={() => setIsOpen(false)}
                >
                    <List>
                        <ListItem key="home" disablePadding>
                            <ListItemButton href='/'>
                                <ListItemIcon>
                                    <HomeIcon />
                                </ListItemIcon>
                                <ListItemText primary={'Home'} />
                            </ListItemButton>
                        </ListItem>
                        <ListItem key="rankings" disablePadding>
                            <ListItemButton href='/rankings'>
                                <ListItemIcon>
                                    <WorkspacePremiumIcon />
                                </ListItemIcon>
                                <ListItemText primary={'Rankings'} />
                            </ListItemButton>
                        </ListItem>
                        <AdminOnly noExtras>
                            <ListItem key="add_game" disablePadding>
                                <ListItemButton href='/add_game'>
                                    <ListItemIcon>
                                        <AddIcon />
                                    </ListItemIcon>
                                    <ListItemText primary={'Add Game'} />
                                </ListItemButton>
                            </ListItem>
                        </AdminOnly>
                    </List>
                </Box>
            </Drawer>
        </>
    );
};
