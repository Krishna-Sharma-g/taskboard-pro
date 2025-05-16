import Badge from "./Badge"
import "./BadgesList.css"

const BadgesList = ({ badges, size = "small" }) => {
    if (!badges || badges.length === 0) {
        return null
    }

    return (
        <div className="badges-container">
            {badges.map((badge, index) => (
                <div key={`badge-${index}`} className="badge-list-item">
                    <Badge name={badge.name} size={size} />
                </div>
            ))}
        </div>
    )
}

export default BadgesList
