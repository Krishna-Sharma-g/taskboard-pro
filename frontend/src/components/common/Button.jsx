"use client"

const Button = ({
                    children,
                    onClick,
                    variant = "primary",
                    size = "medium",
                    fullWidth = false,
                    disabled = false,
                    type = "button",
                    icon = null,
                    className = "",
                    style = {},
                }) => {
    const getVariantStyles = () => {
        switch (variant) {
            case "secondary":
                return styles.secondary
            case "outline":
                return styles.outline
            case "danger":
                return styles.danger
            case "success":
                return styles.success
            case "text":
                return styles.text
            case "primary":
            default:
                return styles.primary
        }
    }

    const getSizeStyles = () => {
        switch (size) {
            case "small":
                return styles.small
            case "large":
                return styles.large
            case "medium":
            default:
                return styles.medium
        }
    }

    const buttonStyles = {
        ...styles.button,
        ...getVariantStyles(),
        ...getSizeStyles(),
        ...(fullWidth ? styles.fullWidth : {}),
        ...(disabled ? styles.disabled : {}),
        ...style,
    }

    return (
        <button
            type={type}
            onClick={disabled ? undefined : onClick}
            style={buttonStyles}
            disabled={disabled}
            className={className}
        >
            {icon && <span style={styles.icon}>{icon}</span>}
            {children}
        </button>
    )
}

const styles = {
    button: {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "500",
        borderRadius: "8px",
        transition: "all 0.3s ease",
        cursor: "pointer",
        border: "none",
        outline: "none",
        position: "relative",
        overflow: "hidden",
    },
    primary: {
        backgroundColor: "#3a6df0",
        color: "white",
        boxShadow: "0 2px 5px rgba(58, 109, 240, 0.3)",
        "&:hover": {
            backgroundColor: "#5a89ff",
            transform: "translateY(-2px)",
            boxShadow: "0 4px 8px rgba(58, 109, 240, 0.4)",
        },
        "&:active": {
            transform: "translateY(0)",
        },
    },
    secondary: {
        backgroundColor: "#f1f5f9",
        color: "#1e293b",
        border: "1px solid #e2e8f0",
        "&:hover": {
            backgroundColor: "#e2e8f0",
            transform: "translateY(-2px)",
        },
    },
    outline: {
        backgroundColor: "transparent",
        color: "#3a6df0",
        border: "1px solid #3a6df0",
        "&:hover": {
            backgroundColor: "rgba(58, 109, 240, 0.1)",
            transform: "translateY(-2px)",
        },
    },
    danger: {
        backgroundColor: "#ef4444",
        color: "white",
        "&:hover": {
            backgroundColor: "#f87171",
            transform: "translateY(-2px)",
            boxShadow: "0 4px 8px rgba(239, 68, 68, 0.3)",
        },
    },
    success: {
        backgroundColor: "#10b981",
        color: "white",
        "&:hover": {
            backgroundColor: "#34d399",
            transform: "translateY(-2px)",
            boxShadow: "0 4px 8px rgba(16, 185, 129, 0.3)",
        },
    },
    text: {
        backgroundColor: "transparent",
        color: "#3a6df0",
        "&:hover": {
            backgroundColor: "rgba(58, 109, 240, 0.1)",
        },
    },
    small: {
        padding: "6px 12px",
        fontSize: "14px",
    },
    medium: {
        padding: "10px 16px",
        fontSize: "16px",
    },
    large: {
        padding: "12px 24px",
        fontSize: "18px",
    },
    fullWidth: {
        width: "100%",
    },
    disabled: {
        opacity: 0.6,
        cursor: "not-allowed",
        "&:hover": {
            transform: "none",
            boxShadow: "none",
        },
    },
    icon: {
        marginRight: "8px",
        display: "flex",
        alignItems: "center",
    },
}

export default Button
