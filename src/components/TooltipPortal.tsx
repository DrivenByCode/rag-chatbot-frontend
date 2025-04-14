import ReactDOM from "react-dom";

type Props = {
    children: React.ReactNode;
};

const TooltipPortal: React.FC<Props> = ({ children }) => {
    const el = document.getElementById("tooltip-root");
    return el ? ReactDOM.createPortal(children, el) : null;
};

export default TooltipPortal;
