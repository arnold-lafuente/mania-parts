import React, { useState, useEffect } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions,
    IconButton, InputAdornment, Typography, Box
} from '@mui/material';
import { Search, Plus, Edit, Trash2, User, Save, X } from 'lucide-react';
import { api } from '../services/api';

const Clients = () => {
    const [clients, setClients] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentClient, setCurrentClient] = useState({ name: '', nit: '', address: '', phone: '', email: '' });
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        loadClients();
    }, []);

    const loadClients = async () => {
        try {
            const data = await api.getClients();
            setClients(data);
        } catch (error) {
            console.error('Error loading clients:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.saveClient(currentClient);
            loadClients();
            closeModal();
        } catch (error) {
            console.error('Error saving client:', error);
            alert('Error al guardar el cliente');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Está seguro de eliminar este cliente?')) {
            try {
                await api.deleteClient(id);
                loadClients();
            } catch (error) {
                console.error('Error deleting client:', error);
                alert('Error al eliminar el cliente');
            }
        }
    };

    const openModal = (client = null) => {
        if (client) {
            setCurrentClient(client);
            setIsEditing(true);
        } else {
            setCurrentClient({ name: '', nit: '', address: '', phone: '', email: '' });
            setIsEditing(false);
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentClient({ name: '', nit: '', address: '', phone: '', email: '' });
    };

    const filteredClients = clients.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.nit.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Box sx={{ p: 0 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
                <Box>
                    <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: '#1e293b' }}>
                        Clientes
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#64748b' }}>
                        Gestione su base de datos de clientes
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<Plus size={20} />}
                    onClick={() => openModal()}
                    sx={{
                        backgroundColor: '#003366',
                        '&:hover': { backgroundColor: '#002244' },
                        textTransform: 'none',
                        borderRadius: 2,
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
                    }}
                >
                    Nuevo Cliente
                </Button>
            </Box>

            <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 3, boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)' }}>
                <Box sx={{ p: 2 }}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Buscar por nombre o NIT/CI..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search size={20} className="text-slate-400" />
                                </InputAdornment>
                            ),
                            sx: { borderRadius: 2, backgroundColor: '#f8fafc' }
                        }}
                        size="small"
                    />
                </Box>

                <TableContainer sx={{ maxHeight: 600 }}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold', color: '#475569', backgroundColor: '#f8fafc' }}>NIT/CI</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: '#475569', backgroundColor: '#f8fafc' }}>Nombre / Razón Social</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: '#475569', backgroundColor: '#f8fafc' }}>Dirección</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: '#475569', backgroundColor: '#f8fafc' }}>Teléfono</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: '#475569', backgroundColor: '#f8fafc' }}>Email</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold', color: '#475569', backgroundColor: '#f8fafc', width: 120 }}>Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredClients.length > 0 ? (
                                filteredClients.map((client) => (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={client.id}>
                                        <TableCell sx={{ fontFamily: 'monospace', color: '#475569' }}>{client.nit}</TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                <Box sx={{
                                                    width: 32, height: 32, borderRadius: '50%', backgroundColor: '#f1f5f9',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b'
                                                }}>
                                                    <User size={16} />
                                                </Box>
                                                <Typography variant="body2" fontWeight="medium">{client.name}</Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell sx={{ color: '#475569' }}>{client.address || '-'}</TableCell>

                                        <TableCell sx={{ color: '#475569' }}>{client.phone || '-'}</TableCell>
                                        <TableCell sx={{ color: '#475569' }}>{client.email || '-'}</TableCell>
                                        <TableCell align="center">
                                            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                                <IconButton
                                                    onClick={() => openModal(client)}
                                                    size="small"
                                                    sx={{ color: '#2563eb', '&:hover': { backgroundColor: '#eff6ff' } }}
                                                >
                                                    <Edit size={18} />
                                                </IconButton>
                                                <IconButton
                                                    onClick={() => handleDelete(client.id)}
                                                    size="small"
                                                    sx={{ color: '#dc2626', '&:hover': { backgroundColor: '#fef2f2' } }}
                                                >
                                                    <Trash2 size={18} />
                                                </IconButton>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} align="center" sx={{ py: 4, color: '#64748b' }}>
                                        No se encontraron clientes.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            <Dialog
                open={isModalOpen}
                onClose={closeModal}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: { borderRadius: 3 }
                }}
            >
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
                    <Typography variant="h6" fontWeight="bold" color="#1e293b">
                        {isEditing ? 'Editar Cliente' : 'Nuevo Cliente'}
                    </Typography>
                    <IconButton onClick={closeModal} size="small">
                        <X size={20} />
                    </IconButton>
                </DialogTitle>
                <form onSubmit={handleSubmit}>
                    <DialogContent>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                            <TextField
                                autoFocus
                                label="Nombre o Razón Social"
                                fullWidth
                                required
                                variant="outlined"
                                value={currentClient.name}
                                onChange={(e) => setCurrentClient({ ...currentClient, name: e.target.value })}
                            />
                            <TextField
                                label="NIT / CI"
                                fullWidth
                                required
                                variant="outlined"
                                value={currentClient.nit}
                                onChange={(e) => setCurrentClient({ ...currentClient, nit: e.target.value })}
                            />
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <TextField
                                    label="Teléfono"
                                    fullWidth
                                    variant="outlined"
                                    value={currentClient.phone}
                                    onChange={(e) => setCurrentClient({ ...currentClient, phone: e.target.value })}
                                />
                                <TextField
                                    label="Email"
                                    fullWidth
                                    type="email"
                                    variant="outlined"
                                    value={currentClient.email}
                                    onChange={(e) => setCurrentClient({ ...currentClient, email: e.target.value })}
                                />
                            </Box>
                            <TextField
                                label="Dirección"
                                fullWidth
                                variant="outlined"
                                value={currentClient.address}
                                onChange={(e) => setCurrentClient({ ...currentClient, address: e.target.value })}
                            />
                        </Box>
                    </DialogContent>
                    <DialogActions sx={{ px: 3, pb: 3 }}>
                        <Button onClick={closeModal} variant="outlined" sx={{ textTransform: 'none', color: '#64748b', borderColor: '#cbd5e1' }}>
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            startIcon={<Save size={18} />}
                            sx={{ backgroundColor: '#003366', '&:hover': { backgroundColor: '#002244' }, textTransform: 'none' }}
                        >
                            Guardar
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </Box>
    );
};

export default Clients;
