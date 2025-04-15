import { CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";

export const SuccessPopup = ({
    message = "Success!",
    size = "md",
    onClose,
    autoClose = true,
    duration = 3,
}) => {


    // Icon size mapping
    const iconSizes = {
        sm: "h-6 w-6",
        md: "h-8 w-8",
        lg: "h-12 w-12",
    };

    const [interval, setIntervalstate] = useState(duration);
    setInterval(() => {
        if (interval == 0) {
            setIntervalstate("")
            return
        }
        setIntervalstate(interval - 1);
    }, 1000);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
            {/* Main popup container with animations */}
            <div className={`
        flex flex-col items-center gap-3 rounded-xl bg-white p-6 shadow-lg
        transition-all duration-300
      `}>
                {/* Icon with bounce animation */}
                <CheckCircle2
                    className={`
            text-green-500 ${iconSizes[size]}
            animate-[bounce_0.6s_ease-in-out]
          `}
                />

                {/* Message text with fade-in */}
                <p className="text-center font-medium text-gray-800 animate-[fadeIn_0.5s_ease-out]">
                    {interval}
                </p>
                <p className="text-center font-medium text-gray-800 animate-[fadeIn_0.5s_ease-out]">
                    {message}
                </p>

                {/* Close button (if manual close enabled) */}

            </div>
        </div>
    );
};