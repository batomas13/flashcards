import "../styles/Card.css";

import type { CardAnimation } from "../models/CardAnimation";

interface CardProps {
    front: string;
    back: string;
    open: boolean;
    animation: CardAnimation;
    onToggle: () => void;
}

function Card({
    front,
    back,
    open,
    animation,
    onToggle,
}: CardProps) {

    return (
        <div
            className="flash-card"
            onClick={onToggle}
        >

            <div className="spiral">

                {Array.from({ length: 7 }).map((_, index) => (
                    <div
                        key={index}
                        className="ring"
                    />
                ))}

            </div>

            <div
                className={`page ${open ? "open" : ""} ${animation ?? ""}`}
            >

                <div className="card-front">

                    <span className="card-text">
                        {front}
                    </span>

                </div>

                <div className="card-divider" />

                <div className="card-back">

                    <span className="card-text">
                        {back}
                    </span>

                </div>

            </div>

        </div>
    );
}

export default Card;
