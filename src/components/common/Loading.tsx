import React, { useCallback } from "react";


export function Loading({ show }: { show: boolean }) {

    return show ? <div className="fixed top-0 left-0 w-[100vw] h-[100vh!important] z-52 flex items-center justify-center  bg-gray-300  opacity-20 cursor-no-drop">
        <div className="flex items-center space-x-2">
            <div className="w-16 h-16 border-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
        </div>
    </div > : null


}
