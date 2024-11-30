interface BarNavProps {
    onNavigate: (section: "home" | "graphs" | "equipo") => void;
}

const BarNav = ({ onNavigate }: BarNavProps) => {
    return (
        <nav className="navbar navbar-dark fixed-top">
            <div className="container-fluid d-flex align-items-center">
                {/* Logo */}
                <a
                    className="navbar-brand d-flex align-items-center"
                    href="#"
                    onClick={() => onNavigate("home")}
                >
                    <img
                        src="/iot-logo.jpg"
                        alt="IoT Logo"
                        height="40"
                        className="me-2"
                    />
                    <span>Implementación IoT</span>
                </a>

                {/* Botones de Navegación */}
                <div className="ms-auto d-flex align-items-center">
                    <button
                        className="btn btn-outline-light me-2"
                        onClick={() => onNavigate("home")}
                    >
                        Home
                    </button>
                    <button
                        className="btn btn-outline-light me-2"
                        onClick={() => onNavigate("equipo")}
                    >
                        Equipo
                    </button>
                    <button
                        className="btn btn-warning"
                        onClick={() => onNavigate("graphs")}
                    >
                        Gráficas
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default BarNav;
