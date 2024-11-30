
interface HeroSectionProps {
    title: string;
    subtitle: string;
    imageUrl: string;
    description?: string;
}

const HeroSection = ({ title, subtitle, imageUrl, description }: HeroSectionProps) => {
    return (
        <div className="container my-5 hero-section">
            <div className="row align-items-center">
                {/* Imagen del carrito */}
                <div className="col-lg-6 text-center">
                    <img
                        src={imageUrl}
                        alt={title}
                        className="img-fluid hero-image" style={{ maxWidth: "80%", height: "auto" }}
                    />
                </div>
                {/* Texto del Hero Section */}
                <div className="col-lg-6 text-center text-lg-start">
                    <h1 className="mb-3" style={{ fontSize: "1.5rem" }}>{title}</h1>
                    <h3 className="text-muted mb-4" style={{ fontSize: "1.2rem" }}>{subtitle}</h3>
                    {description && <p className="lead" style={{ fontSize: "0.9rem" }}>{description}</p>}
                </div>
            </div>
        </div>
    );
};

export default HeroSection;
