import { useEffect, useRef } from "react";
import { IDataset } from "../interface";
import { IMessage } from "../services/llm";
import { getValidVegaSpec } from "../utils";
import ReactVega from "./react-vega";
import { HandThumbDownIcon, HandThumbUpIcon, TrashIcon, UserIcon } from "@heroicons/react/20/solid";
import { CpuChipIcon } from "@heroicons/react/24/outline";
import DataTable from "./datasetCreation/dataTable";

interface VizChatProps {
    messages: IMessage[];
    dataset: IDataset;
    onDelete?: (message: IMessage, mIndex: number) => void;
    onUserFeedback?: (messagePair: IMessage[], mIndex: number, action: string) => void;
}

const VizChat: React.FC<VizChatProps> = ({ messages, dataset, onDelete, onUserFeedback }) => {
    const container = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (container.current) {
            container.current.scrollTop = container.current.scrollHeight;
        }
    }, [messages]);
    return (
        <div className="border-2 border-zinc-100 overflow-y-auto" ref={container} style={{ maxHeight: "80vh" }}>
            {messages.map((message, index) => {
                if (message.role === "assistant") {
                    const spec = getValidVegaSpec(message.content);
                    if (spec) {
                        return (
                            <div className="p-4 flex justify-top" key={index}>
                                <div className="grow-0">
                                    <div className="inline-block h-10 w-10 rounded-full mx-4 bg-indigo-500 text-white flex items-center justify-center">
                                        <CpuChipIcon className="w-6" />
                                    </div>
                                </div>
                                <div className="grow pl-8">
                                    <ReactVega spec={spec} data={dataset.dataSource ?? []} />
                                </div>
                                <div className="float-right flex gap-4 items-start">
                                    <HandThumbUpIcon
                                        className="w-4 text-gray-500 cursor-pointer hover:scale-125"
                                        onClick={() => {
                                            onUserFeedback &&
                                                onUserFeedback([messages[index - 1], message], index, "like");
                                        }}
                                    />
                                    <HandThumbDownIcon
                                        className="w-4 text-gray-500 cursor-pointer hover:scale-125"
                                        onClick={() => {
                                            onUserFeedback &&
                                                onUserFeedback([messages[index - 1], message], index, "dislike");
                                        }}
                                    />
                                    <TrashIcon
                                        className="w-4 text-gray-500 cursor-pointer hover:scale-125"
                                        onClick={() => {
                                            onDelete && onDelete(message, index);
                                        }}
                                    />
                                </div>
                            </div>
                        );
                    } else {
                        return (
                            <div className="p-4 flex justify-top" key={index}>
                                <div className="grow-0">
                                    <div className="inline-block h-10 w-10 rounded-full mx-4 bg-indigo-500 text-white flex items-center justify-center">
                                        <CpuChipIcon className="w-6" />
                                    </div>
                                </div>
                                <div className="grow pl-8 overflow-x-auto">
                                    <p>{message.content}</p>
                                    <DataTable
                                        data={dataset.dataSource}
                                        metas={dataset.fields}
                                        onMetaChange={() => {
                                            console.log("meta changed");
                                        }}
                                    />
                                </div>
                            </div>
                        );
                    }
                }
                return (
                    <div className="p-4 bg-zinc-100 flex" key={index}>
                        <div className="grow-0">
                            <div className="inline-block h-10 w-10 rounded-full mx-4 bg-green-500 text-white flex items-center justify-center">
                                <UserIcon className="w-6" />
                            </div>
                        </div>
                        <div className="grow pl-8">
                            <p>{message.content}</p>
                        </div>
                        <div className="float-right">
                            <TrashIcon
                                className="w-4 text-gray-500 cursor-pointer hover:scale-125"
                                onClick={() => {
                                    onDelete && onDelete(message, index);
                                }}
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default VizChat;
