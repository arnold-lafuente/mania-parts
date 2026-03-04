import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    AppBar, Box, CssBaseline, Divider, Drawer, IconButton, List, ListItem,
    ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography, Button,
    Avatar
} from '@mui/material';
import {
    Menu as MenuIcon, LayoutDashboard, Package, Users, FileText, LogOut,
    ChevronLeft, History, PackagePlus
} from 'lucide-react';
import { api } from '../services/api';

const drawerWidth = 240;

const Layout = ({ children }) => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const session = api.getUser();
    const user = session?.user ?? session;

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleLogout = () => {
        api.logout();
        navigate('/login');
    };

    const menuItems = [
        { path: '/', icon: <LayoutDashboard size={20} />, label: 'Inicio' },
        { path: '/productos', icon: <Package size={20} />, label: 'Productos' },
        { path: '/registro-lote', icon: <PackagePlus size={20} />, label: 'Registro de Factura' },
        { path: '/clientes', icon: <Users size={20} />, label: 'Clientes' },
        { path: '/proforma', icon: <FileText size={20} />, label: 'Proforma' },
        { path: '/ventas', icon: <History size={20} />, label: 'Historico ventas' },
    ];

    const drawer = (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'primary.main', color: 'white' }}>
            <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2 }}>
                <Box>
                    <Typography variant="h6" noWrap component="div" fontWeight="bold">
                        Sistema Vania
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        Control de Stock
                    </Typography>
                </Box>
                {/* Mobile Close Button */}
                <IconButton
                    onClick={handleDrawerToggle}
                    sx={{ display: { sm: 'none' }, color: 'white' }}
                >
                    <ChevronLeft />
                </IconButton>
            </Toolbar>
            <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.12)' }} />
            <List sx={{ flexGrow: 1, py: 2 }}>
                {menuItems.map((item) => (
                    <ListItem key={item.path} disablePadding sx={{ mb: 1 }}>
                        <ListItemButton
                            component={Link}
                            to={item.path}
                            selected={location.pathname === item.path}
                            onClick={() => setMobileOpen(false)}
                            sx={{
                                mx: 1,
                                borderRadius: 2,
                                '&.Mui-selected': {
                                    bgcolor: 'secondary.main',
                                    '&:hover': {
                                        bgcolor: 'secondary.dark',
                                    },
                                },
                                '&:hover': {
                                    bgcolor: 'rgba(255, 255, 255, 0.08)',
                                },
                            }}
                        >
                            <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText primary={item.label} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.12)' }} />
            <Box sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, px: 1 }}>
                    <Avatar sx={{ bgcolor: 'primary.dark', width: 32, height: 32, fontSize: 14 }}>
                        {user?.username?.charAt(0).toUpperCase() || 'U'}
                    </Avatar>
                    <Box sx={{ overflow: 'hidden' }}>
                        <Typography variant="body2" noWrap fontWeight="medium">
                            {user?.username || 'Usuario'}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                            Admin
                        </Typography>
                    </Box>
                </Box>
                <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<LogOut size={18} />}
                    onClick={handleLogout}
                    sx={{
                        color: 'white',
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                        '&:hover': {
                            borderColor: 'white',
                            bgcolor: 'rgba(255, 255, 255, 0.08)'
                        }
                    }}
                >
                    Cerrar Sesión
                </Button>
            </Box>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar
                position="fixed"
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                    bgcolor: 'white',
                    color: 'text.primary',
                    boxShadow: 1
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                        {menuItems.find(i => i.path === location.pathname)?.label || 'Panel'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ display: { xs: 'none', sm: 'block' } }}>
                        {new Date().toLocaleDateString('es-BO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </Typography>
                </Toolbar>
            </AppBar>
            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
                aria-label="mailbox folders"
            >
                {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>
            <Box
                component="main"
                sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` }, bgcolor: '#f8fafc', minHeight: '100vh' }}
            >
                <Toolbar />
                {children}
            </Box>
        </Box>
    );
};

export default Layout;
