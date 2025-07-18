/**
 * Optimized styles for the Land Registry DApp
 * Using CSS-in-JS to avoid render-blocking CSS files
 */

// Main container styles
export const containerStyles = {
  maxWidth: "500px",
  margin: "auto",
  padding: "2rem",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  borderRadius: "8px",
  backgroundColor: "#ffffff",
};

// Header styles
export const headerStyles = {
  color: "#333",
  marginBottom: "1.5rem",
  borderBottom: "1px solid #eee",
  paddingBottom: "0.5rem",
};

// Form styles
export const formStyles = {
  display: "flex",
  flexDirection: "column",
  gap: "0.5rem",
};

// Input styles
export const inputStyles = {
  padding: "0.75rem",
  borderRadius: "4px",
  border: "1px solid #ddd",
  fontSize: "1rem",
  width: "100%",
  boxSizing: "border-box",
  marginBottom: "1rem",
};

// Button styles
export const buttonStyles = {
  padding: "0.75rem 1.5rem",
  backgroundColor: "#4CAF50",
  color: "white",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  fontSize: "1rem",
  fontWeight: "bold",
  transition: "background-color 0.2s",
};

// Connect wallet button styles
export const connectButtonStyles = {
  ...buttonStyles,
  backgroundColor: "#2196F3",
};

// Message styles
export const messageStyles = (isSuccess) => ({
  marginTop: "1rem",
  padding: "0.75rem",
  borderRadius: "4px",
  backgroundColor: isSuccess ? "#E8F5E9" : "#FFEBEE",
  color: isSuccess ? "#2E7D32" : "#C62828",
  fontWeight: "500",
});

// Status indicator styles
export const statusStyles = {
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
  padding: "0.5rem",
  backgroundColor: "#E3F2FD",
  borderRadius: "4px",
  marginBottom: "1rem",
};