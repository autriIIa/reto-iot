import {ReactNode} from "react"
interface Propiedades {
    //texto: string;
    children: ReactNode;
    alCierre: () => void;

}


const Alerta = ({children, alCierre}: Propiedades) => {


    return(
        <div className = "alert alert-danger alert_dim" role = "alert" >
            {children}
        <button 
            type="button" 
            className="btn-close" 
            data-bs-dismiss="alert" 
            aria-label="Close"
            onClick = {alCierre}></button>
        </div>

    );
}

export default Alerta;