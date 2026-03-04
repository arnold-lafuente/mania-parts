import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Select, MenuItem, Collapse, IconButton } from '@mui/material';
import { History, Calendar, User, DollarSign, ChevronDown, ChevronUp, Package, UserCheck } from 'lucide-react';
import { api } from '../services/api';

const SalesHistory = () => {
    const [sales, setSales] = useState([]);
    const [expandedId, setExpandedId] = useState(null);

    useEffect(() => {
        loadSales();
    }, []);

    const loadSales = async () => {
        try {
            const proformas = await api.getProformas();
            const sorted = (proformas || []).sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
            setSales(sorted);
        } catch (error) {
            console.error('Error loading sales history:', error);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const d = new Date(dateString);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const handleStatusChange = async (sale, newStatus) => {
        try {
            await api.updateProformaStatus(sale.id, newStatus);
            loadSales();
        } catch (error) {
            console.error('Error updating status:', error);
            alert(error?.message || 'Error al actualizar el estado');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'vendido': return { bg: '#dcfce7', color: '#166534' };
            case 'cancelado': return { bg: '#fee2e2', color: '#991b1b' };
            default: return { bg: '#fef9c3', color: '#854d0e' };
        }
    };

    return (
        <Box sx={{ p: 0 }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: '#1e293b' }}>
                    Histórico de Ventas
                </Typography>
                <Typography variant="body1" sx={{ color: '#64748b' }}>
                    Registro completo de ventas y proformas generadas
                </Typography>
            </Box>

            <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 3, boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)' }}>
                <TableContainer sx={{ maxHeight: 600 }}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold', color: '#64748b', bgcolor: '#f8fafc', width: 48 }}></TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: '#64748b', bgcolor: '#f8fafc' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Calendar size={16} />
                                        Fecha
                                    </Box>
                                </TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: '#64748b', bgcolor: '#f8fafc' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <User size={16} />
                                        Cliente
                                    </Box>
                                </TableCell>
                                <TableCell align="right" sx={{ fontWeight: 'bold', color: '#64748b', bgcolor: '#f8fafc' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
                                        <DollarSign size={16} />
                                        Valor Total
                                    </Box>
                                </TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold', color: '#64748b', bgcolor: '#f8fafc' }}>
                                    Estado
                                </TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: '#64748b', bgcolor: '#f8fafc' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <UserCheck size={16} />
                                        Usuario
                                    </Box>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {sales.map((sale) => {
                                const statusColor = getStatusColor(sale.status || 'pendiente');
                                const isExpanded = expandedId === sale.id;
                                return (
                                    <React.Fragment key={sale.id}>
                                        <TableRow hover>
                                            <TableCell sx={{ py: 0.5, width: 48 }}>
                                                <IconButton
                                                    size="small"
                                                    onClick={() => setExpandedId(isExpanded ? null : sale.id)}
                                                >
                                                    {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                                </IconButton>
                                            </TableCell>
                                            <TableCell sx={{ color: '#334155' }}>
                                                {formatDate(sale.createdAt)}
                                            </TableCell>
                                            <TableCell sx={{ fontWeight: 'medium', color: '#1e293b' }}>
                                                {sale.client?.name || 'Cliente Desconocido'}
                                            </TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 'bold', color: '#059669' }}>
                                                Bs {Number(sale.total || 0).toFixed(2)}
                                            </TableCell>
                                            <TableCell align="center">
                                                <Select
                                                    value={sale.status || 'pendiente'}
                                                    onChange={(e) => handleStatusChange(sale, e.target.value)}
                                                    disabled={sale.status === 'vendido' || sale.status === 'cancelado'}
                                                    size="small"
                                                    variant="standard"
                                                    disableUnderline
                                                    sx={{
                                                        backgroundColor: statusColor.bg,
                                                        color: statusColor.color,
                                                        borderRadius: 1,
                                                        padding: '2px 8px',
                                                        fontSize: '0.75rem',
                                                        fontWeight: 'bold',
                                                        '& .MuiSelect-select': { paddingRight: '24px !important' }
                                                    }}
                                                >
                                                    <MenuItem value="pendiente">Pendiente</MenuItem>
                                                    <MenuItem value="vendido">Vendido</MenuItem>
                                                    <MenuItem value="cancelado">Cancelado</MenuItem>
                                                </Select>
                                            </TableCell>
                                            <TableCell sx={{ fontSize: '0.8rem', color: '#64748b' }}>
                                                {sale.statusChangedBy || '-'}
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell colSpan={6} sx={{ py: 0, borderBottom: 'none' }}>
                                                <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                                                    <Box sx={{ py: 2, px: 2, bgcolor: '#f8fafc', borderRadius: 2 }}>
                                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2, mb: 2 }}>
                                                            <Typography variant="subtitle2" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                <Package size={16} />
                                                                Productos
                                                            </Typography>
                                                            <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                                                                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                                    <DollarSign size={14} />
                                                                    <strong>Total: Bs {Number(sale.total || 0).toFixed(2)}</strong>
                                                                </Typography>
                                                                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                                    <UserCheck size={14} />
                                                                    <strong>Emitido por: {sale.statusChangedBy || '-'}</strong>
                                                                </Typography>
                                                            </Box>
                                                        </Box>
                                                        <Table size="small">
                                                            <TableHead>
                                                                <TableRow>
                                                                    <TableCell sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}>Código</TableCell>
                                                                    <TableCell sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}>Producto</TableCell>
                                                                    <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}>Cant.</TableCell>
                                                                    <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}>P. Unit</TableCell>
                                                                    <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}>Subtotal</TableCell>
                                                                </TableRow>
                                                            </TableHead>
                                                            <TableBody>
                                                                {(sale.items || []).map((item) => (
                                                                    <TableRow key={item.id}>
                                                                        <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{item.product?.code || '-'}</TableCell>
                                                                        <TableCell>{item.product?.name || '-'}</TableCell>
                                                                        <TableCell align="center">{item.quantity}</TableCell>
                                                                        <TableCell align="right">Bs {Number(item.price || 0).toFixed(2)}</TableCell>
                                                                        <TableCell align="right">Bs {Number(item.subtotal || 0).toFixed(2)}</TableCell>
                                                                    </TableRow>
                                                                ))}
                                                            </TableBody>
                                                        </Table>
                                                    </Box>
                                                </Collapse>
                                            </TableCell>
                                        </TableRow>
                                    </React.Fragment>
                                );
                            })}
                            {sales.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, color: '#94a3b8' }}>
                                            <History size={48} strokeWidth={1.5} />
                                            <Typography>No hay ventas registradas aún</Typography>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Box>
    );
};

export default SalesHistory;
