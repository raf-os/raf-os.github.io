import { Observable, type Observer } from "@babylonjs/core";

let instance: DialogManager;

export type DialogProps = {
    message: React.ReactNode,
    title?: string,
}

export type DialogObserver = Observer<DialogProps>;

class DialogManager {
    private observable: Observable<DialogProps>;

    constructor() {
        if (instance) {
            throw new Error("Attempted to create duplicate instance of DialogManager.");
        }
        instance = this;

        this.observable = new Observable();
    }

    connectObserver(callback: (props: DialogProps) => void) {
        const observer = this.observable.add(callback);
        return observer;
    }

    disconnectObserver(observer: Observer<DialogProps> | undefined | null) {
        if (!observer) return false;
        return this.observable.remove(observer);
    }

    showMessage(props: DialogProps) {
        this.observable.notifyObservers(props);
    }
}

export default new DialogManager();