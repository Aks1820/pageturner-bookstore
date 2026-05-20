import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  BookOpen,
  Home,
  Package,
  LogIn,
  LogOut,
  User,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { getItemCount } = useCart();
  const { user, logout } = useAuth();
  const [cartCount, setCartCount] = useState(0);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setCartCount(getItemCount());
  }, [getItemCount]);

  const handleCartChange = () => {
    setAnimate(true);
    setTimeout(() => setAnimate(false), 300);
  };

  useEffect(() => {
    handleCartChange();
  }, [cartCount]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const baseNavLinks = [
    { path: "/", label: "Home", icon: Home },
    { path: "/books", label: "Books", icon: BookOpen },
  ];

  const navLinks = user
    ? [...baseNavLinks, { path: "/orders", label: "Orders", icon: Package }]
    : baseNavLinks;

  return (
    <nav style={styles.navbar}>
      <div className="container" style={styles.container}>
        <Link to="/" style={styles.logo}>
          <BookOpen size={28} color="var(--accent)" />
          <span style={styles.logoText}>PageTurner</span>
        </Link>

        <div style={styles.navLinks}>
          {navLinks.map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              style={{
                ...styles.navLink,
                ...(location.pathname === path ? styles.navLinkActive : {}),
              }}
            >
              <Icon size={18} />
              {label}
            </Link>
          ))}
        </div>

        <div style={styles.rightSection}>
          {user ? (
            <div style={styles.userSection}>
              <span style={styles.userName}>
                <User size={16} />
                {user.name}
              </span>
              <button onClick={handleLogout} style={styles.logoutBtn}>
                <LogOut size={18} />
                Logout
              </button>
            </div>
          ) : (
            <Link to="/auth" style={styles.loginBtn}>
              <LogIn size={18} />
              Sign In
            </Link>
          )}

          <Link to="/cart" style={styles.cartLink}>
            <div className={animate ? "bounce" : ""} style={styles.cartIcon}>
              <ShoppingCart size={22} />
              {cartCount > 0 && (
                <span style={styles.cartBadge}>{cartCount}</span>
              )}
            </div>
          </Link>
        </div>
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    background: "var(--surface)",
    borderBottom: "1px solid var(--border)",
    padding: "16px 0",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  logoText: {
    fontFamily: "var(--font-heading)",
    fontSize: "1.5rem",
    fontWeight: "700",
    color: "var(--text-primary)",
  },
  navLinks: {
    display: "flex",
    gap: "8px",
  },
  navLink: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 20px",
    borderRadius: "8px",
    color: "var(--text-secondary)",
    fontWeight: "500",
    transition: "all 0.3s ease",
  },
  navLinkActive: {
    background: "var(--accent)",
    color: "white",
  },
  rightSection: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  userSection: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  userName: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    color: "var(--text-secondary)",
    fontWeight: "500",
  },
  logoutBtn: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    background: "transparent",
    border: "1px solid var(--border)",
    color: "var(--text-secondary)",
    padding: "8px 16px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "500",
    transition: "all 0.3s ease",
  },
  loginBtn: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "var(--accent)",
    color: "white",
    padding: "10px 20px",
    borderRadius: "8px",
    fontWeight: "600",
    transition: "all 0.3s ease",
  },
  cartLink: {
    position: "relative",
  },
  cartIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "10px",
    borderRadius: "8px",
    background: "var(--primary)",
    color: "var(--text-primary)",
  },
  cartBadge: {
    position: "absolute",
    top: "-5px",
    right: "-5px",
    background: "var(--accent)",
    color: "white",
    fontSize: "0.75rem",
    fontWeight: "700",
    padding: "2px 6px",
    borderRadius: "10px",
    minWidth: "20px",
    textAlign: "center",
  },
};

export default Navbar;
