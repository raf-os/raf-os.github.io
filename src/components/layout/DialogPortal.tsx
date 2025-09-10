'use client';

import DialogManager, { type DialogProps, type DialogObserver } from "@/components/singletons/DialogManager";
import { useRef, useEffect, useState, createContext } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { v4 as uuid } from "uuid";

import { X as CloseIcon } from "lucide-react";

type DialogMessageContent = null | {
    id: string,
    title?: string,
    content: React.ReactNode,
};

export default function DialogPortal() {
    const observer = useRef<DialogObserver | null>(null);
    const [ isShowing, setIsShowing ] = useState<boolean>(false);
    const [ msgContent, setMsgContent ] = useState<DialogMessageContent>(null);
    const [ isMounted, setIsMounted ] = useState<boolean>(false);

    const showMessage = async (props: DialogProps) => {
        setIsShowing(true);
        const mId = uuid();
        setMsgContent({
            id: mId,
            content: props.message,
            title: props.title,
        });
    }

    const dismissMessage = () => {
        setIsShowing(false);
        setMsgContent(null);
    }

    useEffect(() => {
        observer.current = DialogManager.connectObserver(showMessage);
        setIsMounted(true);

        return () => {
            DialogManager.disconnectObserver(observer.current);
        }
    });

    return isMounted? createPortal((
        <AnimatePresence>
            { isShowing && (
                <motion.div
                    initial={{
                        opacity: 0,
                    }}
                    animate={{
                        opacity: 1,
                        transition: {
                            ease: "linear",
                            duration: 0.25
                        }
                    }}
                    exit={{
                        opacity: 0,
                        transition: {
                            ease: "linear",
                            duration: 0.25,
                        }
                    }}
                    className="fixed z-50 top-0 left-0 w-full h-full"
                >
                    <DialogWrapper
                        dismissFn={dismissMessage}
                        title={msgContent?.title}
                        key={msgContent?.id}
                    >
                        { msgContent?.content }
                    </DialogWrapper>
                </motion.div>
            )}
        </AnimatePresence>
    ), document.body) : null;
}

export type TDialogContext = {
    dismissFn: () => void,
};
export const DefaultDialogContext: TDialogContext = {
    dismissFn: () => {},
};
export const DialogContext = createContext<TDialogContext>(DefaultDialogContext);

type DialogWrapperProps = {
    title?: string,
    children: React.ReactNode,
    dismissFn: () => void,
}

export function DialogWrapper({
    children,
    title,
    dismissFn,
}: DialogWrapperProps) {
    const offsetY = 64;

    const closeModal = () => {
        dismissFn();
    }

    const ctx: TDialogContext = {
        ...DefaultDialogContext,
        dismissFn: closeModal,
    }

    return (
        <div className="w-full h-full flex items-center justify-center bg-black/50 px-2 md:px-0" onClick={closeModal}>
            <motion.div
                initial={{
                    y: offsetY,
                    scale: 0.5,
                }}
                animate={{
                    y: 0,
                    scale: 1,
                    transition: {
                        ease: "circOut",
                        duration: 0.25,
                    }
                }}
                exit={{
                    y: offsetY,
                    scale: 0.5,
                    transition: {
                        ease: "circOut",
                        duration: 0.25,
                    }
                }}
                className="bg-emerald-600 rounded-lg p-[2px] w-full md:w-[600px]"
                onClick={e => e.stopPropagation()}
            >
                <div
                    className="flex items-center flex-nowrap justify-between rounded-t-md text-neutral-50 py-1"
                >
                    <h1 className="font-semibold text-lg md:text-base grow-1 shrink-1 overflow-hidden text-ellipsis px-3">
                        { title }
                    </h1>

                    <div className="grow-0 shrink-0 mr-1 p-[2px] hover:bg-gray-800 rounded-lg" onClick={closeModal}>
                        <CloseIcon size="24px" strokeWidth={3} />
                    </div>
                </div>

                <div className="bg-gray-800 text-neutral-50 rounded-b-md p-2 text-lg md:text-base dialog-styling">
                    <DialogContext.Provider value={ctx}>
                        { children }
                    </DialogContext.Provider>
                </div>
            </motion.div>
        </div>
    )
}