import React, { useState, useEffect } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions,
    IconButton, InputAdornment, Typography, Box, Select, MenuItem, FormControl, InputLabel, Chip
} from '@mui/material';
import { Search, Plus, Edit, Trash2, Save, X, Package } from 'lucide-react';
import { api } from '../services/api';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentProduct, setCurrentProduct] = useState({ name: '', code: '', brand: '', price: '', stock: '', unit: 'PIEZAS', location: '', cost: '' });
    const [isEditing, setIsEditing] = useState(false);

    const loadProducts = async () => {
        try {
            const data = await api.getProducts();
            setProducts(data);
        } catch (error) {
            console.error('Error loading products:', error);
        }
    };

    useEffect(() => {
        loadProducts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const productToSend = {
                ...currentProduct,
                price: parseFloat(currentProduct.price) || 0,
                stock: parseInt(currentProduct.stock, 10) || 0,
                cost: currentProduct.cost ? parseFloat(currentProduct.cost) : null
            };
            console.log(productToSend)
            await api.saveProduct(productToSend);
            loadProducts();
            closeModal();
        } catch (error) {
            console.error('Error saving product:', error);
            alert('Error al guardar el producto');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Está seguro de eliminar este producto?')) {
            try {
                await api.deleteProduct(id);
                loadProducts();
            } catch (error) {
                console.error('Error deleting product:', error);
                alert('Error al eliminar el producto');
            }
        }
    };

    const openModal = (product = null) => {
        if (product) {
            setCurrentProduct(product);
            setIsEditing(true);
        } else {
            setCurrentProduct({ name: '', code: '', brand: '', price: '', stock: '', unit: 'PIEZAS', location: '', cost: '' });
            setIsEditing(false);
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentProduct({ name: '', code: '', price: '', stock: '', unit: 'PIEZAS', location: '', cost: '' });
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.code.toLowerCase().includes(searchTerm.toLowerCase())
    );


    return (
        <Box sx={{ p: 0 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
                <Box>
                    <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: '#1e293b' }}>
                        Productos
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#64748b' }}>
                        Gestione su inventario de productos
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
                    Nuevo Producto
                </Button>
            </Box>

            <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 3, boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)' }}>
                <Box sx={{ p: 2 }}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Buscar por nombre o código..."
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
                                <TableCell sx={{ fontWeight: 'bold', color: '#475569', backgroundColor: '#f8fafc' }}>Producto</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: '#475569', backgroundColor: '#f8fafc' }}>Código</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: '#475569', backgroundColor: '#f8fafc' }}>Precio</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: '#475569', backgroundColor: '#f8fafc' }}>Stock</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: '#475569', backgroundColor: '#f8fafc' }}>Precio Anterior</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: '#475569', backgroundColor: '#f8fafc' }}>Modificado por</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: '#475569', backgroundColor: '#f8fafc' }}>Marca</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: '#475569', backgroundColor: '#f8fafc' }}>Unidad</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold', color: '#475569', backgroundColor: '#f8fafc', width: 120 }}>Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredProducts.length > 0 ? (
                                filteredProducts.map((product) => (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={product.id}>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                <Box sx={{
                                                    width: 32, height: 32, borderRadius: '50%', backgroundColor: '#f1f5f9',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b'
                                                }}>
                                                    <Package size={16} />
                                                </Box>
                                                <Typography variant="body2" fontWeight="medium">{product.name}</Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell sx={{ fontFamily: 'monospace', color: '#475569' }}>{product.code}</TableCell>
                                        <TableCell sx={{ color: '#475569' }}>Bs {Number(product.price || 0).toFixed(2)}</TableCell>
                                        <TableCell sx={{ color: '#475569' }}>{product.stock ?? 0} {product.unit || ''}</TableCell>
                                        <TableCell sx={{ color: '#475569' }}>{product.previousPrice != null ? `Bs ${Number(product.previousPrice).toFixed(2)}` : '-'}</TableCell>
                                        <TableCell sx={{ color: '#475569', fontSize: '0.8rem' }}>{product.lastModifiedBy || '-'}</TableCell>
                                        <TableCell sx={{ color: '#475569' }}>{product.brand || '-'}</TableCell>
                                        <TableCell>
                                            <Chip label={product.unit} size="small" sx={{ borderRadius: 1, backgroundColor: '#f1f5f9', fontWeight: 600, color: '#475569', fontSize: '0.75rem' }} />
                                        </TableCell>
                                        <TableCell align="center">
                                            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                                <IconButton
                                                    onClick={() => openModal(product)}
                                                    size="small"
                                                    sx={{ color: '#2563eb', '&:hover': { backgroundColor: '#eff6ff' } }}
                                                >
                                                    <Edit size={18} />
                                                </IconButton>
                                                <IconButton
                                                    onClick={() => handleDelete(product.id)}
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
                                        No se encontraron productos.
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
                        {isEditing ? 'Editar Producto' : 'Nuevo Producto'}
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
                                label="Nombre del Producto"
                                fullWidth
                                required
                                variant="outlined"
                                value={currentProduct.name}
                                onChange={(e) => setCurrentProduct({ ...currentProduct, name: e.target.value })}
                            />
                            <TextField
                                label="Código"
                                fullWidth
                                required
                                variant="outlined"
                                value={currentProduct.code}
                                onChange={(e) => setCurrentProduct({ ...currentProduct, code: e.target.value })}
                            />
                            <TextField
                                label="Marca"
                                fullWidth
                                variant="outlined"
                                placeholder="Ej. Toyota, Nissan, Genérico"
                                value={currentProduct.brand}
                                onChange={(e) => setCurrentProduct({ ...currentProduct, brand: e.target.value })}
                            />
                            <TextField
                                label="Ubicación / Localización"
                                fullWidth
                                variant="outlined"
                                placeholder="Ej. Estante A, Fila 2"
                                value={currentProduct.location}
                                onChange={(e) => setCurrentProduct({ ...currentProduct, location: e.target.value })}
                            />

                            <FormControl fullWidth>
                                <InputLabel>Unidad</InputLabel>
                                <Select
                                    value={currentProduct.unit}
                                    label="Unidad"
                                    onChange={(e) => setCurrentProduct({ ...currentProduct, unit: e.target.value })}
                                >
                                    <MenuItem value="PIEZAS">PIEZAS</MenuItem>
                                    <MenuItem value="METROS">METROS</MenuItem>
                                    <MenuItem value="KIT">KIT</MenuItem>
                                </Select>
                            </FormControl>


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

export default Products;
