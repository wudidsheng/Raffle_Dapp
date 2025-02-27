/// <reference types="vite/client" />
declare global {
    // 添加自定义钱包广播事件
    interface Window {
        ethereum: any;
    }
}