import "./Badge.css"

const Badge = ({ name, size = "small" }) => {
    // Define badge colors based on name
    const getBadgeColor = (badgeName) => {
        const colors = {
            Completed: "badge-completed",
            "On Time": "badge-ontime",
            "Star Performer": "badge-star",
            Important: "badge-important",
            Review: "badge-review",
            default: "badge-default",
        }

        return colors[badgeName] || colors.default
    }

    const badgeClass = getBadgeColor(name)
    const sizeClass = `badge-${size}`

    return <span className={`badge ${badgeClass} ${sizeClass}`}>{name}</span>
}

export default Badge
