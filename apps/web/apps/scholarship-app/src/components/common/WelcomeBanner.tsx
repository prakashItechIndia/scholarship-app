import * as React from "react";

interface WelcomeBannerProps {
  userName: string;
  greeting?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const WelcomeBanner: React.FC<WelcomeBannerProps> = ({
  userName,
  greeting = "Have a nice day!",
  className,
  style,
}) => {
  return (
    <div
      className={className}
      style={{
        marginBottom: "18px",
        backgroundColor: "#F5F5F5",
        paddingTop: "12px",
        paddingBottom: "10px",
        ...style,
      }}
    >
      <h1
        style={{
          fontSize: "20px",
          fontWeight: 700,
          lineHeight: "28px",
          color: "#242424",
          fontFamily: "'Inter', sans-serif",
          paddingLeft: "20px",
        }}
      >
        Welcome {userName}!
      </h1>
      <p
        style={{
          fontSize: "13px",
          lineHeight: "20px",
          fontWeight: 400,
          color: "#707070",
          fontFamily: "'Inter', sans-serif",
          paddingLeft: "20px",
        }}
      >
        {greeting}
      </p>
    </div>
  );
};

