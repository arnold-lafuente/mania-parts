import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Button, Paper, TextField, InputAdornment, IconButton,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Grid, Divider, List, ListItem, ListItemButton, ListItemText, Card, CardContent
} from '@mui/material';
import { Search, Printer, Save, FileText, User, X, Trash2, Plus } from 'lucide-react';
import { api } from '../services/api';

const Proforma = () => {
    const [clients, setClients] = useState([]);
    const [products, setProducts] = useState([]);

    const [selectedClient, setSelectedClient] = useState(null);
    const [items, setItems] = useState([]);
    const [productSearch, setProductSearch] = useState('');
    const [clientSearch, setClientSearch] = useState('');

    const [showProductSearch, setShowProductSearch] = useState(false);
    const [showClientSearch, setShowClientSearch] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [clientsData, productsData] = await Promise.all([
                    api.getClients(),
                    api.getProducts()
                ]);
                setClients(clientsData);
                setProducts(productsData);
            } catch (error) {
                console.error('Error loading data:', error);
            }
        };
        loadData();
    }, []);

    const addItem = (product) => {
        const existingItem = items.find(item => item.productId === product.id);
        if (existingItem) {
            setItems(items.map(item =>
                item.productId === product.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            ));
        } else {
            setItems([...items, {
                productId: product.id,
                code: product.code,
                name: product.name,
                unit: product.unit,
                price: parseFloat(product.price),
                quantity: 1
            }]);
        }
        setProductSearch('');
        setShowProductSearch(false);
    };

    const updateQuantity = (index, newQty) => {
        if (newQty < 1) return;
        const newItems = [...items];
        newItems[index].quantity = parseFloat(newQty);
        setItems(newItems);
    };

    const removeItem = (index) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const calculateTotal = () => {
        return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    };

    const handleSave = async () => {
        if (!selectedClient) {
            alert('Por favor seleccione un cliente');
            return;
        }
        if (items.length === 0) {
            alert('Por favor agregue productos');
            return;
        }

        const proforma = {
            client: selectedClient,
            clientId: selectedClient.id,
            items: items.map((i) => ({
                productId: i.productId,
                quantity: i.quantity,
                price: i.price,
            })),
            discount: 0,
        };

        try {
            await api.saveProforma(proforma);
            alert('Proforma guardada exitosamente');
            // Reset form
            setSelectedClient(null);
            setItems([]);
        } catch (error) {
            console.error('Error saving proforma:', error);
            alert('Error al guardar la proforma');
        }
    };

    const filteredProducts = products.filter(p =>
        String(p.name || '').toLowerCase().includes(productSearch.toLowerCase()) ||
        String(p.code || '').toLowerCase().includes(productSearch.toLowerCase())
    );

    const filteredClients = clients.filter(c =>
        String(c.name || '').toLowerCase().includes(clientSearch.toLowerCase()) ||
        String(c.nit || '').toLowerCase().includes(clientSearch.toLowerCase())
    );

    return (
        <Box sx={{ p: 0 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
                <Box>
                    <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: '#1e293b' }}>
                        Nueva Proforma
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#64748b' }}>
                        Crear orden de compra y cotización
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                        variant="outlined"
                        startIcon={<Printer size={20} />}
                        onClick={() => window.print()}
                        sx={{ textTransform: 'none', borderColor: '#cbd5e1', color: '#475569' }}
                    >
                        Imprimir
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<Save size={20} />}
                        onClick={handleSave}
                        sx={{
                            backgroundColor: '#003366',
                            '&:hover': { backgroundColor: '#002244' },
                            textTransform: 'none',
                            borderRadius: 2,
                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
                        }}
                    >
                        Guardar Proforma
                    </Button>
                </Box>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* Client Selection */}
                <Paper sx={{ p: 3, borderRadius: 3, boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <User size={20} className="text-yellow-500" />
                        <Typography variant="h6" fontWeight="bold" color="#1e293b">
                            Datos del Cliente
                        </Typography>
                    </Box>

                    {selectedClient ? (
                        <Box sx={{ bgcolor: '#f8fafc', p: 2, borderRadius: 2, border: '1px solid #e2e8f0', position: 'relative' }}>
                            <IconButton
                                onClick={() => setSelectedClient(null)}
                                size="small"
                                sx={{ position: 'absolute', top: 8, right: 8, color: '#94a3b8', '&:hover': { color: '#ef4444', bgcolor: '#fee2e2' } }}
                            >
                                <X size={18} />
                            </IconButton>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6} lg={3}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                        <Typography variant="caption" fontWeight="bold" color="#64748b" textTransform="uppercase">Razón Social</Typography>
                                        <Typography variant="body1" fontWeight="medium" color="#334155">{selectedClient.name}</Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} md={6} lg={3}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                        <Typography variant="caption" fontWeight="bold" color="#64748b" textTransform="uppercase">NIT / CI</Typography>
                                        <Typography variant="body1" fontWeight="medium" color="#334155" fontFamily="monospace">{selectedClient.nit}</Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} md={6} lg={3}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                        <Typography variant="caption" fontWeight="bold" color="#64748b" textTransform="uppercase">Dirección</Typography>
                                        <Typography variant="body1" fontWeight="medium" color="#334155">{selectedClient.address || '-'}</Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} md={6} lg={3}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                        <Typography variant="caption" fontWeight="bold" color="#64748b" textTransform="uppercase">Teléfono</Typography>
                                        <Typography variant="body1" fontWeight="medium" color="#334155">{selectedClient.phone || '-'}</Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>
                    ) : (
                        <Box sx={{ position: 'relative' }}>
                            <TextField
                                fullWidth
                                placeholder="Buscar cliente por nombre o NIT..."
                                value={clientSearch}
                                onChange={(e) => {
                                    setClientSearch(e.target.value);
                                    setShowClientSearch(true);
                                }}
                                onFocus={() => setShowClientSearch(true)}
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
                            {showClientSearch && clientSearch && (
                                <Paper sx={{ position: 'absolute', zIndex: 10, width: '100%', mt: 1, maxHeight: 240, overflow: 'auto', boxShadow: 3 }}>
                                    <List disablePadding>
                                        {filteredClients.length > 0 ? (
                                            filteredClients.map(client => (
                                                <ListItemButton
                                                    key={client.id}
                                                    onClick={() => {
                                                        setSelectedClient(client);
                                                        setClientSearch('');
                                                        setShowClientSearch(false);
                                                    }}
                                                    divider
                                                >
                                                    <ListItemText
                                                        primary={client.name}
                                                        secondary={`NIT: ${client.nit}`}
                                                        primaryTypographyProps={{ fontWeight: 'medium' }}
                                                    />
                                                </ListItemButton>
                                            ))
                                        ) : (
                                            <ListItem>
                                                <ListItemText primary="No se encontraron clientes" sx={{ color: '#64748b', textAlign: 'center' }} />
                                            </ListItem>
                                        )}
                                    </List>
                                </Paper>
                            )}
                        </Box>
                    )}
                </Paper>

                {/* Product List */}
                <Paper sx={{ p: 3, borderRadius: 3, boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)', minHeight: 400 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <FileText size={20} className="text-yellow-500" />
                            <Typography variant="h6" fontWeight="bold" color="#1e293b">
                                Detalle de Productos
                            </Typography>
                        </Box>

                        <Box sx={{ position: 'relative', width: 300 }}>
                            <TextField
                                fullWidth
                                placeholder="Agregar producto..."
                                value={productSearch}
                                onChange={(e) => {
                                    setProductSearch(e.target.value);
                                    setShowProductSearch(true);
                                }}
                                onFocus={() => setShowProductSearch(true)}
                                size="small"
                                InputProps={{
                                    sx: { borderRadius: 2, backgroundColor: '#f8fafc', fontSize: '0.875rem' }
                                }}
                            />
                            {showProductSearch && productSearch && (
                                <Paper sx={{ position: 'absolute', zIndex: 10, width: '100%', mt: 1, maxHeight: 240, overflow: 'auto', boxShadow: 3 }}>
                                    <List disablePadding>
                                        {filteredProducts.length > 0 ? (
                                            filteredProducts.map(product => (
                                                <ListItemButton
                                                    key={product.id}
                                                    onClick={() => addItem(product)}
                                                    divider
                                                    sx={{ display: 'flex', justifyContent: 'space-between' }}
                                                >
                                                    <Box>
                                                        <Typography variant="body2" fontWeight="medium">{product.name}</Typography>
                                                        <Typography variant="caption" color="text.secondary">{product.code}</Typography>
                                                    </Box>
                                                    <Typography variant="body2" fontWeight="bold" color="#334155">Bs {product.price}</Typography>
                                                </ListItemButton>
                                            ))
                                        ) : (
                                            <ListItem>
                                                <ListItemText primary="No se encontraron productos" sx={{ color: '#64748b', textAlign: 'center' }} />
                                            </ListItem>
                                        )}
                                    </List>
                                </Paper>
                            )}
                        </Box>
                    </Box>

                    <TableContainer>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ color: '#64748b', fontWeight: 'bold', fontSize: '0.75rem', textTransform: 'uppercase' }}>#</TableCell>
                                    <TableCell sx={{ color: '#64748b', fontWeight: 'bold', fontSize: '0.75rem', textTransform: 'uppercase' }}>Código</TableCell>
                                    <TableCell sx={{ color: '#64748b', fontWeight: 'bold', fontSize: '0.75rem', textTransform: 'uppercase', width: '40%' }}>Producto</TableCell>
                                    <TableCell align="center" sx={{ color: '#64748b', fontWeight: 'bold', fontSize: '0.75rem', textTransform: 'uppercase' }}>Cant.</TableCell>
                                    <TableCell align="right" sx={{ color: '#64748b', fontWeight: 'bold', fontSize: '0.75rem', textTransform: 'uppercase' }}>P. Unit</TableCell>
                                    <TableCell align="right" sx={{ color: '#64748b', fontWeight: 'bold', fontSize: '0.75rem', textTransform: 'uppercase' }}>Total</TableCell>
                                    <TableCell align="center" sx={{ width: 50 }}></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {items.map((item, index) => (
                                    <TableRow key={index} hover>
                                        <TableCell sx={{ color: '#64748b' }}>{index + 1}</TableCell>
                                        <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.75rem', color: '#475569' }}>{item.code}</TableCell>
                                        <TableCell sx={{ fontWeight: 'medium', fontSize: '0.875rem' }}>{item.name}</TableCell>
                                        <TableCell align="center">
                                            <TextField
                                                type="number"
                                                value={item.quantity}
                                                onChange={(e) => updateQuantity(index, e.target.value)}
                                                size="small"
                                                inputProps={{ min: 1, style: { textAlign: 'center', padding: '4px 8px' } }}
                                                sx={{ width: 80 }}
                                            />
                                        </TableCell>
                                        <TableCell align="right" sx={{ fontSize: '0.875rem' }}>{item.price.toFixed(2)}</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '0.875rem' }}>{(item.price * item.quantity).toFixed(2)}</TableCell>
                                        <TableCell align="center">
                                            <IconButton
                                                onClick={() => removeItem(index)}
                                                size="small"
                                                sx={{ color: '#dc2626', '&:hover': { backgroundColor: '#fef2f2' } }}
                                            >
                                                <Trash2 size={16} />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {items.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={7} align="center" sx={{ py: 6, color: '#94a3b8', fontStyle: 'italic' }}>
                                            Agregue productos a la lista
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* Totals Section inside Paper */}
                    <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
                        <Box sx={{ width: { xs: '100%', md: '300px' } }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2" color="text.secondary">Subtotal:</Typography>
                                <Typography variant="body2" fontWeight="medium">Bs {calculateTotal().toFixed(2)}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                <Typography variant="body2" color="text.secondary">Descuento:</Typography>
                                <Typography variant="body2" fontWeight="medium">Bs 0.00</Typography>
                            </Box>
                            <Divider sx={{ mb: 2 }} />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="h6" fontWeight="bold" color="primary.main">Total:</Typography>
                                <Typography variant="h6" fontWeight="bold" color="primary.main">Bs {calculateTotal().toFixed(2)}</Typography>
                            </Box>
                            <Typography variant="caption" display="block" align="right" color="text.secondary" sx={{ mb: 3 }}>
                                Son: {calculateTotal().toFixed(2)} Bolivianos
                            </Typography>

                            <Button
                                fullWidth
                                variant="contained"
                                onClick={handleSave}
                                size="large"
                                sx={{
                                    bgcolor: '#eab308',
                                    color: '#0f172a',
                                    fontWeight: 'bold',
                                    '&:hover': { bgcolor: '#ca8a04' }
                                }}
                            >
                                Confirmar Propuesta
                            </Button>
                        </Box>
                    </Box>
                </Paper>
            </Box>
        </Box>
    );
};

export default Proforma;
