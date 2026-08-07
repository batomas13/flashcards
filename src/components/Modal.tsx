import { ReactNode } from "react";

import "../styles/Modal.css";

interface ModalProps {
    open: boolean;
    children: ReactNode;
    onClose: () => void;
}

function Modal({
    open,
    children,
    onClose,
}: ModalProps) {

    if (!open) {
        return null;
    }

    return (
        <div
            className="modal-overlay"
            onClick={onClose}
        >

            <div
                className="modal"
                onClick={(event) => event.stopPropagation()}
            >
                {children}
            </div>

        </div>
    );
}

export default Modal;
