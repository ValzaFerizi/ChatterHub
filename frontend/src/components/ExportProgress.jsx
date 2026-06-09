import { useEffect, useState } from "react";

function ExportProgress({ loading, message, progress }) {
  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    if (loading) {
      setAnimatedProgress(0);
      const interval = setInterval(() => {
        setAnimatedProgress((prev) => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);
      return () => clearInterval(interval);
    } else {
      setAnimatedProgress(progress || 100);
    }
  }, [loading, progress]);

  if (!loading && !message) return null;

  return (
    <div style={{
      padding: "16px",
      borderRadius: "8px",
      backgroundColor: "#f8fafc",
      border: "1px solid #e2e8f0",
      marginBottom: "16px",
    }}>
      {loading && (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
            <span style={{ fontSize: "14px", color: "#555" }}>⏳ Duke u procesuar...</span>
            <span style={{ fontSize: "14px", fontWeight: "600", color: "#6d28d9" }}>{animatedProgress}%</span>
          </div>
          <div style={{
            width: "100%",
            height: "8px",
            backgroundColor: "#e2e8f0",
            borderRadius: "4px",
            overflow: "hidden",
          }}>
            <div style={{
              width: `${animatedProgress}%`,
              height: "100%",
              backgroundColor: "#6d28d9",
              borderRadius: "4px",
              transition: "width 0.3s ease",
            }} />
          </div>
        </>
      )}
      {message && (
        <p style={{
          margin: loading ? "12px 0 0" : "0",
          padding: "10px",
          borderRadius: "6px",
          backgroundColor: message.includes("✅") ? "#f0fdf4" : "#fef2f2",
          color: message.includes("✅") ? "#16a34a" : "#dc2626",
          fontSize: "14px",
          fontWeight: "500",
        }}>
          {message}
        </p>
      )}
    </div>
  );
}

  export default ExportProgress;