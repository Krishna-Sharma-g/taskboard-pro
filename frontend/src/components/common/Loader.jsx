"use client"

const Loader = ({ type = "spinner", size = "medium", text = "Loading..." }) => {
    const getLoaderSize = () => {
        switch (size) {
            case "small":
                return { width: "24px", height: "24px", borderWidth: "3px" }
            case "large":
                return { width: "64px", height: "64px", borderWidth: "6px" }
            case "medium":
            default:
                return { width: "40px", height: "40px", borderWidth: "4px" }
        }
    }

    const getDotSize = () => {
        switch (size) {
            case "small":
                return { width: "8px", height: "8px" }
            case "large":
                return { width: "16px", height: "16px" }
            case "medium":
            default:
                return { width: "12px", height: "12px" }
        }
    }

    const renderLoader = () => {
        switch (type) {
            case "dots":
                return (
                    <div style={styles.dotsContainer}>
                        <div style={{ ...styles.dot, ...getDotSize() }}></div>
                        <div style={{ ...styles.dot, ...getDotSize() }}></div>
                        <div style={{ ...styles.dot, ...getDotSize() }}></div>
                    </div>
                )
            case "spinner":
            default:
                return <div style={{ ...styles.spinner, ...getLoaderSize() }}></div>
        }
    }

    return (
        <div style={styles.container}>
            {renderLoader()}
            {text && <div style={styles.text}>{text}</div>}
        </div>
    )
}

const styles = {
    container: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        width: "100%",
    },
    spinner: {
        border: "4px solid rgba(0, 0, 0, 0.1)",
        borderLeftColor: "#3a6df0",
        borderRadius: "50%",
        width: "40px",
        height: "40px",
        animation: "spin 1s linear infinite",
    },
    dotsContainer: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "8px",
    },
    dot: {
        width: "12px",
        height: "12px",
        borderRadius: "50%",
        backgroundColor: "#3a6df0",
        display: "inline-block",
        animation: "pulse 1.5s ease-in-out infinite",
    },
    text: {
        marginTop: "16px",
        color: "#64748b",
        fontSize: "14px",
        fontWeight: "500",
    },
    "@keyframes spin": {
        "0%": {
            transform: "rotate(0deg)",
        },
        "100%": {
            transform: "rotate(360deg)",
        },
    },
    "@keyframes pulse": {
        "0%": {
            transform: "scale(1)",
        },
        "50%": {
            transform: "scale(1.2)",
        },
        "100%": {
            transform: "scale(1)",
        },
    },
}

export default Loader
