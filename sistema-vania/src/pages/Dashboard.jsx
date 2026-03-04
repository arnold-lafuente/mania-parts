import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Grid, Card, CardContent, CardActionArea, Paper, Alert } from '@mui/material';
import { LayoutDashboard, TrendingUp, Users, Package, FileText, PlusCircle } from 'lucide-react';
import { api } from '../services/api';

const Dashboard = () => {
    const [products, setProducts] = useState([]);
    const [clients, setClients] = useState([]);
    const [proformas, setProformas] = useState([]);
    const [apiError, setApiError] = useState(false);

    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                setApiError(false);
                const [productsData, clientsData, proformasData] = await Promise.all([
                    api.getProducts(),
                    api.getClients(),
                    api.getProformas()
                ]);
                setProducts(Array.isArray(productsData) ? productsData : []);
                setClients(Array.isArray(clientsData) ? clientsData : []);
                setProformas(Array.isArray(proformasData) ? proformasData : []);
            } catch (error) {
                setApiError(true);
            }
        };
        loadDashboardData();
    }, []);

    const stats = [
        {
            title: 'Total Productos',
            value: products.length,
            icon: <Package size={24} />,
            color: '#3b82f6', // blue-500
            bgColor: '#dbeafe', // blue-100
            borderColor: '#3b82f6'
        },
        {
            title: 'Total Clientes',
            value: clients.length,
            icon: <Users size={24} />,
            color: '#22c55e', // green-500
            bgColor: '#dcfce7', // green-100
            borderColor: '#22c55e'
        },
        {
            title: 'Ventas Realizadas',
            value: proformas.length,
            icon: <TrendingUp size={24} />,
            color: '#eab308', // yellow-500
            bgColor: '#fef9c3', // yellow-100
            borderColor: '#eab308'
        }
    ];

    const quickLinks = [
        {
            title: 'Nueva Venta',
            description: 'Crear una nueva proforma o venta',
            path: '/proforma',
            icon: <FileText size={24} />,
            color: '#eab308'
        },
        {
            title: 'Gestionar Inventario',
            description: 'Agregar o editar productos',
            path: '/productos',
            icon: <Package size={24} />,
            color: '#3b82f6'
        },
        {
            title: 'Registrar Cliente',
            description: 'Agregar nuevo cliente a la base de datos',
            path: '/clientes',
            icon: <Users size={24} />,
            color: '#22c55e'
        }
    ];

    return (
        <Box sx={{ p: 0 }}>
            {apiError && (
                <Alert severity="warning" sx={{ mb: 3 }}>
                    No se puede conectar con la API (localhost:3000). Verifica que la API esté en ejecución con <code>docker compose up</code> o <code>npm run dev</code> en api-vania.
                </Alert>
            )}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: '#1e293b' }}>
                    Panel de Control
                </Typography>
                <Typography variant="body1" sx={{ color: '#64748b' }}>
                    Resumen general del sistema
                </Typography>
            </Box>

            <Grid container spacing={3} sx={{ mb: 6 }}>
                {stats.map((stat, index) => (
                    <Grid item xs={12} md={4} key={index}>
                        <Card sx={{ borderLeft: `4px solid ${stat.borderColor}`, borderRadius: 2, boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)' }}>
                            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 3 }}>
                                <Box sx={{
                                    p: 1.5,
                                    borderRadius: '50%',
                                    bgcolor: stat.bgColor,
                                    color: stat.color,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    {stat.icon}
                                </Box>
                                <Box>
                                    <Typography variant="body2" fontWeight="medium" color="#64748b">
                                        {stat.title}
                                    </Typography>
                                    <Typography variant="h4" fontWeight="bold" color="#1e293b">
                                        {stat.value}
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Paper sx={{ p: 3, borderRadius: 3, boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)' }}>
                <Typography variant="h6" fontWeight="bold" color="#1e293b" sx={{ mb: 3 }}>
                    Accesos Rápidos
                </Typography>
                <Grid container spacing={3}>
                    {quickLinks.map((link, index) => (
                        <Grid item xs={12} md={4} key={index}>
                            <Card
                                sx={{
                                    height: '100%',
                                    borderRadius: 2,
                                    border: '1px solid #e2e8f0',
                                    boxShadow: 'none',
                                    transition: 'all 0.2s',
                                    '&:hover': {
                                        borderColor: link.color,
                                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                    }
                                }}
                            >
                                <CardActionArea component={Link} to={link.path} sx={{ height: '100%', p: 2 }}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                            <Box sx={{ color: link.color }}>
                                                {link.icon}
                                            </Box>
                                            <Typography variant="h6" fontWeight="bold" color="#334155">
                                                {link.title}
                                            </Typography>
                                        </Box>
                                        <Typography variant="body2" color="#64748b">
                                            {link.description}
                                        </Typography>
                                    </Box>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Paper>
        </Box>
    );
};

export default Dashboard;
