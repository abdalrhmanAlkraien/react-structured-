import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FiCircle } from "react-icons/fi";
import styles from "./style/Step.module.css";
import type {StepStatus} from "./type/StepStatus.ts";


interface Props {
    label: string;
    status: StepStatus;
}

export function Step({ label, status }: Props) {


    function renderIcon() {
        switch (status) {
            case "processing":
                return (
                    <AiOutlineLoading3Quarters
                        className={styles.spin}
                        size={14}
                    />
                );

            case "success":
                return <FaCheckCircle className="text-success" size={14} />;

            case "error":
                return <FaTimesCircle className="text-danger" size={14} />;

            default:
                return <FiCircle className="text-muted" size={14} />;
        }
    }

    return (
        <div className={styles.step}>
            {renderIcon()}
            <span>{label}</span>
        </div>
    );
}

