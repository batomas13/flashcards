import "../styles/Header.css";

interface HeaderProps {
    title: string;
    onBack: () => void;
}

function Header({
    title,
    onBack,
}: HeaderProps) {

    return (
        <header className="page-header">

            <button
                className="back-button"
                onClick={onBack}
            >
                ←
            </button>

            <h1 className="page-title">
                {title}
            </h1>

        </header>
    );
}

export default Header;
