import type { Deck } from "../models/Deck";
import type { StudyMode } from "../models/StudyMode";

interface StudyMenuProps {
    deck: Deck;
    onClose: () => void;
    onStartStudy: (
        deck: Deck,
        mode: StudyMode,
    ) => void;
}

function StudyMenu({
    deck,
    onClose,
    onStartStudy,
}: StudyMenuProps) {

    return (
        <div>

            <button
                className="modal-close"
                onClick={onClose}
            >
                ✕
            </button>

            <h2 className="modal-title">
                {deck.name}
            </h2>

            <div className="modal-options">

                <button
                    className="modal-button"
                    onClick={() => onStartStudy(deck, "hanzi")}
                >
                    <span className="modal-option-title">
                        Hanzi
                    </span>
                </button>

                <button
                    className="modal-button"
                    onClick={() => onStartStudy(deck, "pinyin")}
                >
                    <span className="modal-option-title">
                        Pinyin
                    </span>
                </button>

                <button
                    className="modal-button"
                    onClick={() => onStartStudy(deck, "both")}
                >
                    <span className="modal-option-title">
                        Both
                    </span>
                </button>

            </div>

        </div>
    );
}

export default StudyMenu;
