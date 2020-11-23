import {toast} from 'react-toastify';

export default class ToastMaker {
    static warnToast(message) {
        toast.warn(message)
    }

    static defaultToast(message) {
        toast(message)
    }

    static darkToast(message) {
        toast.dark(message)
    }

    static errorToast(message) {
        toast.error(message)
    }

    static infoToast(message) {
        toast.info(message)
    }

    static successToast(message) {
        toast.success(message)
    }
}
