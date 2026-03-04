import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Paper, Typography, TextField, Button, InputAdornment, Alert } from '@mui/material';
import { Lock, User, ArrowRight } from 'lucide-react';
import { api } from '../services/api';

const IS_DEV_BYPASS = import.meta.env.VITE_ENV === 'dev';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (IS_DEV_BYPASS) {
            api.login(); // Bypass: sesión local, sin API
            navigate('/', { replace: true });
        }
    }, [navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const user = await api.login({ username, password });
            // Session is set inside api.login
            navigate('/');
        } catch (err) {
            setError('Credenciales incorrectas o error de conexión.');
            console.error(err);
        }
    };

    if (IS_DEV_BYPASS && !error) {
        return (
            <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #003366 0%, #004c99 50%, #003366 100%)' }}>
                <Typography color="white">Entrando al sistema...</Typography>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #003366 0%, #004c99 50%, #003366 100%)',
                p: 2
            }}
        >
            <Container maxWidth="xs">
                <Box sx={{ textAlign: 'center', mb: 4, color: 'white' }}>
                    <Typography variant="h3" component="h1" fontWeight="bold" sx={{ mb: 1 }}>
                        Sistema Vania
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#bfdbfe' }}>
                        Ingrese a su cuenta para continuar
                    </Typography>
                </Box>

                <Paper
                    elevation={10}
                    sx={{
                        p: 4,
                        borderRadius: 4,
                        bgcolor: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(10px)'
                    }}
                >
                    <form onSubmit={handleLogin}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            <TextField
                                fullWidth
                                label="Usuario"
                                variant="outlined"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <User size={20} className="text-blue-600" />
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <TextField
                                fullWidth
                                label="Contraseña"
                                type="password"
                                variant="outlined"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Lock size={20} className="text-blue-600" />
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            {error && (
                                <Alert severity="error" sx={{ width: '100%' }}>
                                    {error}
                                </Alert>
                            )}

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                size="large"
                                endIcon={<ArrowRight size={20} />}
                                sx={{
                                    mt: 1,
                                    py: 1.5,
                                    bgcolor: '#D32F2F',
                                    fontWeight: 'bold',
                                    fontSize: '1rem',
                                    '&:hover': {
                                        bgcolor: '#B71C1C',
                                        transform: 'scale(1.02)'
                                    },
                                    transition: 'all 0.2s'
                                }}
                            >
                                Iniciar Sesión
                            </Button>
                        </Box>
                    </form>
                </Paper>

                <Typography variant="body2" align="center" sx={{ mt: 4, color: '#bfdbfe' }}>
                    &copy; {new Date().getFullYear()} Sistema Vania. Todos los derechos reservados.
                </Typography>
            </Container>
        </Box>
    );
};

export default Login;
