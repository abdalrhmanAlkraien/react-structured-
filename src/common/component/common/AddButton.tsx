import { useNavigate } from "react-router-dom";

interface Props {
    label: string;
    to: string;
}

export function AddButton({ label, to }: Props) {
    const navigate = useNavigate();

    return (
        <button
            className="btn btn-primary btn-md"
            onClick={() => navigate(to)}
        >
            {label}
        </button>
    );
}