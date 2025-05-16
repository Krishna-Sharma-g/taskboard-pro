"use client"

const Badge = ({ name, size = "small" }) => {
    // Define badge colors based on name
    const getBadgeColor = (badgeName) => {
        const colors = {
            Completed: { bg: "#dcfce7", text: "#14532d", border: "#86efac" },
            "On Time": { bg: "#dbeafe", text: "#1e3a8a", border: "#93c5fd" },
            "Star Performer": { bg: "#fef9c3", text: "#713f12", border: "#fde047" },
            default: { bg: "#f3f4f6", text: "#374151", border: "#d1d5db" },
        }

        return colors[badgeName] || colors.default
    }

    const badgeColor = getBadgeColor(name)

    // Define size styles
    const sizeStyles = {
        small: {
            padding: "3px 8px",
            fontSize: "12px",
            borderRadius: "12px",
        },
        medium: {
            padding: "4px 10px",
            fontSize: "13px",
            borderRadius: "14px",
        },
        large: {
            padding: "5px 12px",
            fontSize: "14px",
            borderRadius: "16px",
        },
    }

    const style = {
        display: "inline-block",
        backgroundColor: badgeColor.bg,
        color: badgeColor.text,
        fontWeight: "600",
        border: `1.5px solid ${badgeColor.border}`,
        boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
        ...sizeStyles[size],
    }

    return <span style={style}>{name}</span>
}

export default Badge
