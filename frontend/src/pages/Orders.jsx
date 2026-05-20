import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Package, ChevronDown, ChevronUp, Clock } from 'lucide-react';
import orderService from '../services/orderService';
import { useAuth } from '../context/AuthContext';

const Orders = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth', { state: { from: location } });
    }
  }, [user, authLoading, navigate, location]);

  if (authLoading || !user) {
    return (
      <div style={styles.page}>
        <div className="container">
          <div style={styles.loading}>Loading...</div>
        </div>
      </div>
    );
  }

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const { data } = await orderService.getOrders();
      setOrders(data);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleOrder = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const getStatusColor = (status) => {
    const colors = {
      'Processing': 'var(--accent)',
      'Shipped': '#3498db',
      'Delivered': 'var(--success)',
      'Cancelled': '#e74c3c',
    };
    return colors[status] || 'var(--text-secondary)';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div style={styles.page}>
        <div className="container">
          <div style={styles.loading}>Loading orders...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in" style={styles.page}>
      <div className="container">
        <h1 style={styles.pageTitle}>Your Orders</h1>

        {orders.length === 0 ? (
          <div style={styles.emptyOrders}>
            <Package size={64} color="var(--text-secondary)" />
            <h2>No orders yet</h2>
            <p>Your order history will appear here after you make a purchase.</p>
          </div>
        ) : (
          <div style={styles.ordersList}>
            {orders.map(order => (
              <div key={order.id} className="card" style={styles.orderCard}>
                <div
                  style={styles.orderHeader}
                  onClick={() => toggleOrder(order.id)}
                >
                  <div style={styles.orderInfo}>
                    <span style={styles.orderId}>{order.id}</span>
                    <span style={styles.orderDate}>
                      <Clock size={14} />
                      {formatDate(order.date)}
                    </span>
                  </div>
                  <div style={styles.orderMeta}>
                    <span
                      style={{
                        ...styles.orderStatus,
                        color: getStatusColor(order.status),
                      }}
                    >
                      {order.status}
                    </span>
                    <span style={styles.orderTotal}>${order.total.toFixed(2)}</span>
                    {expandedOrder === order.id ? (
                      <ChevronUp size={20} color="var(--text-secondary)" />
                    ) : (
                      <ChevronDown size={20} color="var(--text-secondary)" />
                    )}
                  </div>
                </div>

                {expandedOrder === order.id && (
                  <div style={styles.orderDetails}>
                    <h3 style={styles.detailsTitle}>Order Items</h3>
                    <div style={styles.itemsList}>
                      {order.items.map((item, index) => (
                        <div key={index} style={styles.orderItem}>
                          <div style={styles.itemInfo}>
                            <span style={styles.itemTitle}>{item.title}</span>
                            <span style={styles.itemQty}>Qty: {item.quantity}</span>
                          </div>
                          <span style={styles.itemPrice}>
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div style={styles.orderSummary}>
                      <div style={styles.summaryRow}>
                        <span>Subtotal</span>
                        <span>${order.total.toFixed(2)}</span>
                      </div>
                      <div style={styles.summaryRow}>
                        <span>Shipping</span>
                        <span style={styles.freeShipping}>FREE</span>
                      </div>
                      <div style={styles.divider}></div>
                      <div style={styles.summaryTotal}>
                        <span>Total</span>
                        <span>${order.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  page: {
    padding: '40px 0',
    minHeight: '60vh',
  },
  pageTitle: {
    fontSize: '2.5rem',
    marginBottom: '30px',
  },
  loading: {
    textAlign: 'center',
    padding: '60px',
    color: 'var(--text-secondary)',
  },
  emptyOrders: {
    textAlign: 'center',
    padding: '80px 20px',
    background: 'var(--surface)',
    borderRadius: '12px',
  },
  ordersList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  orderCard: {
    overflow: 'hidden',
  },
  orderHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px',
    cursor: 'pointer',
    transition: 'background 0.3s ease',
  },
  orderInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  orderId: {
    fontSize: '1.1rem',
    fontWeight: '600',
  },
  orderDate: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.9rem',
    color: 'var(--text-secondary)',
  },
  orderMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  orderStatus: {
    fontWeight: '600',
    fontSize: '0.9rem',
  },
  orderTotal: {
    fontSize: '1.2rem',
    fontWeight: '700',
  },
  orderDetails: {
    padding: '20px',
    borderTop: '1px solid var(--border)',
    background: 'var(--primary)',
  },
  detailsTitle: {
    fontSize: '1.1rem',
    marginBottom: '16px',
  },
  itemsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '20px',
  },
  orderItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemInfo: {
    display: 'flex',
    gap: '12px',
  },
  itemTitle: {
    color: 'var(--text-primary)',
  },
  itemQty: {
    color: 'var(--text-secondary)',
    fontSize: '0.9rem',
  },
  itemPrice: {
    fontWeight: '600',
  },
  orderSummary: {
    paddingTop: '16px',
    borderTop: '1px solid var(--border)',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '8px',
    color: 'var(--text-secondary)',
  },
  freeShipping: {
    color: 'var(--success)',
  },
  divider: {
    height: '1px',
    background: 'var(--border)',
    margin: '12px 0',
  },
  summaryTotal: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '1.1rem',
    fontWeight: '700',
  },
};

export default Orders;