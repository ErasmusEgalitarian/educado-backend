import React, { useEffect } from "react";

const Loading: React.FC = () => {
  useEffect(() => {
    // Inject keyframes into the document head
    const keyframesStyle = `
      @keyframes l13 {
        100% { transform: rotate(1turn); }
      }
    `;
    const style = document.createElement("style");
    style.innerHTML = keyframesStyle;
    document.head.appendChild(style);

    // Cleanup on component unmount
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const loaderStyle: React.CSSProperties = {
    width: "50px",
    aspectRatio: "1",
    borderRadius: "50%",
    background: `
      radial-gradient(farthest-side, #186474 94%, transparent) top/8px 8px no-repeat,
      conic-gradient(transparent 30%, #186474)
    `,
    WebkitMask:
      "radial-gradient(farthest-side, transparent calc(100% - 8px), black 0)",
    animation: "l13 1s infinite linear",
  };

  const containerStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
  };

  return (
    <div style={containerStyle}>
      <div style={loaderStyle} />
    </div>
  );
};

export default Loading;
