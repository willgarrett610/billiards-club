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
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

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
                            <ListItemButton>
                                <ListItemIcon>
                                    <HomeIcon />
                                </ListItemIcon>
                                <ListItemText primary={'Home'} />
                            </ListItemButton>
                        </ListItem>
                        <ListItem key="rankings" disablePadding>
                            <ListItemButton>
                                <ListItemIcon>
                                    <WorkspacePremiumIcon />
                                </ListItemIcon>
                                <ListItemText primary={'Rankings'} />
                            </ListItemButton>
                        </ListItem>
                        <ListItem key="tournaments" disablePadding>
                            <ListItemButton>
                                <ListItemIcon>
                                    <EmojiEventsIcon />
                                </ListItemIcon>
                                <ListItemText primary={'Tournaments'} />
                            </ListItemButton>
                        </ListItem>
                    </List>
                </Box>
            </Drawer>
        </>
    );
};
