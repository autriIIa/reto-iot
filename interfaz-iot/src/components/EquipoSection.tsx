import React from "react";

interface EquipoSectionProps {
  title: string;
  members: string[];
  imageUrl: string;
}

const EquipoSection: React.FC<EquipoSectionProps> = ({ title, members, imageUrl }) => {
  return (
    <section className="py-5 bg-light">
      <div className="container text-center">
        <h2 className="mb-4">{title}</h2>
        <div className="row justify-content-center align-items-center">
          {/* Imagen del equipo */}
          <div className="col-md-6 col-lg-5 mb-4">
            <img
              src={imageUrl}
              alt="Equipo"
              className="img-fluid rounded shadow"
            />
          </div>
          {/* Miembros del equipo */}
          <div className="col-md-6 col-lg-5">
            <div className="card border-0 shadow">
              <div className="card-body">
                <h5 className="card-title mb-3">Miembros del Equipo</h5>
                <ul className="list-unstyled">
                  {members.map((member, index) => (
                    <li key={index}>{member}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EquipoSection;
