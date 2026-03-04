import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    Autocomplete,
    Grid,
    Alert,
    CircularProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Collapse
} from '@mui/material';
import { Save, Search, PackagePlus, Plus, Trash2, History, ChevronDown, ChevronUp } from 'lucide-react';
import { api } from '../services/api';

const BatchRegistration = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [inputValue, setInputValue] = useState('');
    const [formData, setFormData] = useState({
        cost: '',
        price: '',
        quantity: ''
    });
    const [status, setStatus] = useState({ type: '', message: '' });
    const [submitting, setSubmitting] = useState(false);
    const [historyOpen, setHistoryOpen] = useState(false);
    const [invoiceHistory, setInvoiceHistory] = useState([]);
    const [loadingHistory, setLoadingHistory] = useState(false);
    const [historyFilter, setHistoryFilter] = useState('');

    // Staging list for batches
    const [batchList, setBatchList] = useState([]);
    const [invoiceNumber, setInvoiceNumber] = useState('');
    const [provider, setProvider] = useState('');

    // Effect for debounced search
    useEffect(() => {
        const timer = setTimeout(() => {
            loadProducts(inputValue);
        }, 500); // 500ms debounce

        return () => clearTimeout(timer);
    }, [inputValue]);

    const loadProducts = async (search = '') => {
        try {
            setLoading(true);
            const data = await api.getProducts(search);
            setProducts(data);
        } catch (error) {
            console.error('Error loading products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        // Only allow numbers and one decimal point
        if (value === '' || /^\d*\.?\d*$/.test(value)) {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleAddToBatch = (e) => {
        e.preventDefault();

        if (!selectedProduct) {
            setStatus({ type: 'error', message: 'Debe seleccionar un producto' });
            return;
        }

        if (!formData.cost || !formData.price || !formData.quantity) {
            setStatus({ type: 'error', message: 'Todos los campos son obligatorios' });
            return;
        }

        const newBatch = {
            id: Date.now(), // Temporary ID for list management
            product: selectedProduct,
            cost: parseFloat(formData.cost),
            price: parseFloat(formData.price),
            quantity: parseInt(formData.quantity, 10)
        };

        setBatchList([...batchList, newBatch]);

        // Reset inputs for next entry
        setFormData({ cost: '', price: '', quantity: '' });
        setSelectedProduct(null);
        setInputValue('');
        setStatus({ type: '', message: '' });
    };

    const handleRemoveFromBatch = (id) => {
        setBatchList(batchList.filter(item => item.id !== id));
    };

    const handleSaveAll = async () => {
        if (batchList.length === 0) return;

        if (!invoiceNumber.trim()) {
            setStatus({ type: 'error', message: 'Debe ingresar el número de factura' });
            return;
        }

        if (!provider.trim()) {
            setStatus({ type: 'error', message: 'Debe ingresar el proveedor' });
            return;
        }

        try {
            setSubmitting(true);

            // Process all batches sequentially
            // In a real app, maybe backend has a bulk endpoint. 
            // Here we loop as per plan.
            // Process all batches as a bulk payload
            const payload = batchList.map(batch => ({
                productId: batch.product.id,
                cost: batch.cost,
                price: batch.price,
                quantity: batch.quantity,
                invoiceNumber: invoiceNumber,
                provider: provider
            }));

            await api.registerBatch(payload);

            setStatus({ type: 'success', message: 'Registro de factura guardado correctamente' });
            setBatchList([]);
            setInvoiceNumber('');
            setProvider('');
            if (historyOpen) loadHistory();

        } catch (error) {
            console.error('Error registering batches:', error);
            setStatus({ type: 'error', message: 'Error al registrar los lotes: ' + error.message });
        } finally {
            setSubmitting(false);
        }
    };

    const loadHistory = async () => {
        try {
            setLoadingHistory(true);
            const data = await api.getInvoiceHistory();
            setInvoiceHistory(Array.isArray(data) ? data : []);
        } catch (error) {
            setInvoiceHistory([]);
        } finally {
            setLoadingHistory(false);
        }
    };

    const toggleHistory = () => {
        if (!historyOpen && invoiceHistory.length === 0) loadHistory();
        setHistoryOpen(!historyOpen);
    };

    const filteredHistory = invoiceHistory.filter((entry) => {
        if (!historyFilter.trim()) return true;
        const term = historyFilter.toLowerCase();
        const inv = (entry.invoiceNumber || '').toLowerCase();
        const code = (entry.product?.code || '').toLowerCase();
        const product = (entry.product?.name || '').toLowerCase();
        return inv.includes(term) || code.includes(term) || product.includes(term);
    });

    const formatDate = (dateStr) => {
        if (!dateStr) return '-';
        const d = new Date(dateStr);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        return `${day}/${month}/${year}`;
    };

    return (
        <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: '#1e293b', display: 'flex', alignItems: 'center', gap: 2 }}>
                    <PackagePlus size={32} />
                    Registro de Factura
                </Typography>
                <Typography variant="body1" sx={{ color: '#64748b', mt: 1 }}>
                    Búsqueda de producto y entrada de mercancía
                </Typography>
            </Box>

            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Paper sx={{ p: 4, borderRadius: 3, boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)' }}>
                        {status.message && (
                            <Alert
                                severity={status.type}
                                sx={{ mb: 3 }}
                                onClose={() => setStatus({ type: '', message: '' })}
                            >
                                {status.message}
                            </Alert>
                        )}

                        <form onSubmit={handleAddToBatch}>
                            <Grid container spacing={4}>
                                <Grid item xs={12}>
                                    <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1, color: '#475569' }}>
                                        1. Datos de Facturación
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        label="Número de Factura"
                                        variant="outlined"
                                        value={invoiceNumber}
                                        onChange={(e) => {
                                            const newInvoiceNumber = e.target.value;
                                            setInvoiceNumber(newInvoiceNumber);
                                            // Update all items in the list with the new invoice number
                                            if (batchList.length > 0) {
                                                setBatchList(prevList => prevList.map(item => ({ ...item, invoiceNumber: newInvoiceNumber })));
                                            }
                                        }}
                                        placeholder="Ingrese el número de factura para este ingreso..."
                                        required
                                    />
                                    <TextField
                                        fullWidth
                                        label="Proveedor"
                                        variant="outlined"
                                        value={provider}
                                        onChange={(e) => {
                                            const newProvider = e.target.value;
                                            setProvider(newProvider);
                                            // Update all items in the list with the new provider
                                            if (batchList.length > 0) {
                                                setBatchList(prevList => prevList.map(item => ({ ...item, provider: newProvider })));
                                            }
                                        }}
                                        placeholder="Ingrese el nombre del proveedor..."
                                        sx={{ mt: 2 }}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1, color: '#475569' }}>
                                        2. Seleccionar Producto
                                    </Typography>
                                    <Autocomplete
                                        options={products}
                                        getOptionLabel={(option) => `${option.code} - ${option.name}`}
                                        value={selectedProduct}
                                        onChange={(_, newValue) => setSelectedProduct(newValue)}
                                        inputValue={inputValue}
                                        onInputChange={(_, newInputValue) => setInputValue(newInputValue)}
                                        loading={loading}
                                        noOptionsText={inputValue ? "No se encontraron productos" : "Escriba para buscar..."}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Buscar por código o nombre..."
                                                variant="outlined"
                                                InputProps={{
                                                    ...params.InputProps,
                                                    startAdornment: (
                                                        <>
                                                            <Search size={20} className="text-slate-400 mr-2" />
                                                            {params.InputProps.startAdornment}
                                                        </>
                                                    ),
                                                    endAdornment: (
                                                        <>
                                                            {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                                            {params.InputProps.endAdornment}
                                                        </>
                                                    ),
                                                }}
                                            />
                                        )}
                                        renderOption={(props, option) => {
                                            const { key, ...otherProps } = props;
                                            return (
                                                <li key={key} {...otherProps}>
                                                    <Box>
                                                        <Typography variant="body1" fontWeight="medium">
                                                            {option.name}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            Código: {option.code} | Stock actual: {option.stock} {option.unit}
                                                        </Typography>
                                                    </Box>
                                                </li>
                                            );
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1, color: '#475569', opacity: selectedProduct ? 1 : 0.5 }}>
                                        3. Detalles de la Factura
                                    </Typography>
                                    <Grid container spacing={3} alignItems="flex-end">
                                        <Grid item xs={12} md={3}>
                                            <TextField
                                                fullWidth
                                                label="Costo Unitario (Bs)"
                                                name="cost"
                                                value={formData.cost}
                                                onChange={handleChange}
                                                disabled={!selectedProduct}
                                                InputProps={{
                                                    startAdornment: <Typography color="text.secondary" sx={{ mr: 1 }}>Bs</Typography>
                                                }}
                                                helperText=" "
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={3}>
                                            <TextField
                                                fullWidth
                                                label="Valor Venta (Bs)"
                                                name="price"
                                                value={formData.price}
                                                onChange={handleChange}
                                                disabled={!selectedProduct}
                                                InputProps={{
                                                    startAdornment: <Typography color="text.secondary" sx={{ mr: 1 }}>Bs</Typography>
                                                }}
                                                helperText={selectedProduct ? `Actual: Bs ${!isNaN(parseFloat(selectedProduct.price)) ? parseFloat(selectedProduct.price).toFixed(2) : '0.00'}` : ' '}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={3}>
                                            <TextField
                                                fullWidth
                                                label="Cantidad"
                                                name="quantity"
                                                value={formData.quantity}
                                                onChange={handleChange}
                                                disabled={!selectedProduct}
                                                helperText=" "
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={3}>
                                            <Button
                                                type="submit"
                                                fullWidth
                                                variant="outlined"
                                                size="large"
                                                disabled={!selectedProduct}
                                                startIcon={<Plus size={20} />}
                                                sx={{
                                                    height: 56,
                                                    borderWidth: 2,
                                                    textTransform: 'none',
                                                    fontWeight: 'bold',
                                                    '&:hover': { borderWidth: 2 }
                                                }}
                                            >
                                                Agregar a la lista
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </form>
                    </Paper>
                </Grid>

                {/* List Section */}
                {batchList.length > 0 && (
                    <Grid item xs={12}>
                        <Paper sx={{ p: 4, borderRadius: 3, boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)' }}>
                            <Grid container spacing={4}>
                                <Grid item xs={12}>
                                    <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, px: 2, color: '#1e293b' }}>
                                        Lista de Ingreso ({batchList.length} items)
                                    </Typography>
                                    <TableContainer>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell sx={{ fontWeight: 'bold' }}>N° Factura</TableCell>
                                                    <TableCell sx={{ fontWeight: 'bold' }}>Proveedor</TableCell>
                                                    <TableCell sx={{ fontWeight: 'bold' }}>Producto</TableCell>
                                                    <TableCell sx={{ fontWeight: 'bold' }}>Código</TableCell>
                                                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>Costo</TableCell>
                                                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>Venta</TableCell>
                                                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>Cantidad</TableCell>
                                                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>Total</TableCell>
                                                    <TableCell align="center" sx={{ fontWeight: 'bold', width: 80 }}></TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {batchList.map((item) => (
                                                    <TableRow key={item.id}>
                                                        <TableCell>{invoiceNumber}</TableCell>
                                                        <TableCell>{provider}</TableCell>
                                                        <TableCell>{item.product.name}</TableCell>
                                                        <TableCell sx={{ fontFamily: 'monospace' }}>{item.product.code}</TableCell>
                                                        <TableCell align="right">Bs {item.cost.toFixed(2)}</TableCell>
                                                        <TableCell align="right">Bs {item.price.toFixed(2)}</TableCell>
                                                        <TableCell align="right">{item.quantity}</TableCell>
                                                        <TableCell align="right" sx={{ fontWeight: 'bold', color: '#0f172a' }}>
                                                            Bs {(item.cost * item.quantity).toFixed(2)}
                                                        </TableCell>
                                                        <TableCell align="center">
                                                            <IconButton
                                                                size="small"
                                                                color="error"
                                                                onClick={() => handleRemoveFromBatch(item.id)}
                                                            >
                                                                <Trash2 size={18} />
                                                            </IconButton>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                    <Box sx={{ py: 2, px: 0, display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #e2e8f0', mt: 2 }}>
                                        <Button
                                            variant="contained"
                                            size="large"
                                            onClick={handleSaveAll}
                                            disabled={submitting}
                                            startIcon={submitting ? <CircularProgress size={20} color="inherit" /> : <Save size={20} />}
                                            sx={{
                                                backgroundColor: '#003366',
                                                '&:hover': { backgroundColor: '#002244' },
                                                px: 4,
                                                py: 1.5,
                                                borderRadius: 2,
                                                textTransform: 'none',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            {submitting ? 'Guardando...' : 'Confirmar Ingreso'}
                                        </Button>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                )}

                {/* Historial de Ingresos */}
                <Grid item xs={12}>
                    <Paper sx={{ p: 2, borderRadius: 3, boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)' }}>
                        <Button
                            fullWidth
                            onClick={toggleHistory}
                            startIcon={<History size={20} />}
                            endIcon={historyOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                            sx={{ justifyContent: 'flex-start', textTransform: 'none', fontWeight: 'bold' }}
                        >
                            Historial de Ingresos
                        </Button>
                        <Collapse in={historyOpen}>
                            {loadingHistory ? (
                                <Box sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
                                    <CircularProgress />
                                </Box>
                            ) : (
                                <>
                                    <Box sx={{ mt: 2, mb: 2 }}>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            label="Buscar"
                                            placeholder="Buscar por N° factura, producto o código..."
                                            value={historyFilter}
                                            onChange={(e) => setHistoryFilter(e.target.value)}
                                            InputProps={{
                                                startAdornment: (
                                                    <Search size={18} style={{ marginRight: 8, color: '#94a3b8' }} />
                                                ),
                                            }}
                                            sx={{ maxWidth: 400 }}
                                        />
                                    </Box>
                                    <TableContainer sx={{ maxHeight: 400 }}>
                                        <Table size="small" stickyHeader>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell sx={{ fontWeight: 'bold' }}>Fecha</TableCell>
                                                <TableCell sx={{ fontWeight: 'bold' }}>N° Factura</TableCell>
                                                <TableCell sx={{ fontWeight: 'bold' }}>Proveedor</TableCell>
                                                <TableCell sx={{ fontWeight: 'bold' }}>Producto</TableCell>
                                                <TableCell sx={{ fontWeight: 'bold' }}>Código</TableCell>
                                                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Costo</TableCell>
                                                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Venta</TableCell>
                                                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Cant.</TableCell>
                                                <TableCell sx={{ fontWeight: 'bold' }}>Registrado por</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {invoiceHistory.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={9} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                                                        No hay registros aún
                                                    </TableCell>
                                                </TableRow>
                                            ) : filteredHistory.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={9} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                                                        No hay resultados con los filtros aplicados
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                filteredHistory.map((entry) => (
                                                    <TableRow key={entry.id}>
                                                        <TableCell>
                                                            {formatDate(entry.createdAt)}
                                                        </TableCell>
                                                        <TableCell>{entry.invoiceNumber}</TableCell>
                                                        <TableCell>{entry.provider}</TableCell>
                                                        <TableCell>{entry.product?.name || '-'}</TableCell>
                                                        <TableCell sx={{ fontFamily: 'monospace' }}>{entry.product?.code || '-'}</TableCell>
                                                        <TableCell align="right">Bs {Number(entry.cost).toFixed(2)}</TableCell>
                                                        <TableCell align="right">Bs {Number(entry.salePrice).toFixed(2)}</TableCell>
                                                        <TableCell align="right">{entry.quantity}</TableCell>
                                                        <TableCell>{entry.registeredBy || '-'}</TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                </>
                            )}
                        </Collapse>
                    </Paper>
                </Grid>
            </Grid>
        </Box >
    );
};

export default BatchRegistration;
