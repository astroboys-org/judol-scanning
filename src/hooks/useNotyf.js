import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

export default function useNotyf() {
    const notyf = new Notyf({
        types: [
            {type: 'info', background: 'gray', icon: false},
            {type: 'warning', background: 'yellow', icon: false},
        ]
    });
    return notyf;
}