import { Dialog, DialogPanel } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'

export default function Modal({
    isOpen, onClose, showCloseButton=true,
    isFullScreen=false, className,
    title, children
}) {
    return (
        <Dialog open={isOpen} onClose={onClose} transition className="fixed inset-0 flex justify-center items-center bg-gray-900/50 backdrop-blur-xs w-screen z-[999]
            transition duration-200 ease-linear origin-center data-closed:scale-95 data-closed:opacity-0">
            <div className="fixed inset-0 flex justify-center items-center">
                <DialogPanel className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-800 rounded-2xl md:rounded-3xl shadow-xl min-w-64 ${isFullScreen && 'w-[90%]'} max-w-5xl space-y-4 ${className}`}>
                    <div className="flex justify-between border-b border-gray-200 dark:border-gray-800 p-4">
                        <span className="text-xl font-bold dark:text-white/80">{title}</span>
                        {showCloseButton && (
                            <button
                                onClick={onClose}
                                className="flex items-center justify-center rounded-full text-gray-400 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
                            >
                                <XMarkIcon className="size-5 stroke-2" />
                            </button>
                        )}
                    </div>
                    <div className="max-h-[80vh] mx-2 mb-6 px-2 overflow-y-auto custom-scrollbar">{children}</div>
                </DialogPanel>
            </div>
        </Dialog>
    )
}

export function ModalFooter({className, children}) {
    return (
        <div className={`flex justify-center sm:justify-end items-center gap-3 border-t dark:border-gray-900 mt-6 pt-2 ${className}`}>
            {children}
        </div>
    )
}