import { Loader2 } from "lucide-react";

const Loading = ({text}) => {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                <p className="mt-2 text-sm">{text}</p>
            </div>
        </div>
    );
};

export default Loading