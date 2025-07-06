import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

export default function useNotyf() {
    const notyf = new Notyf({
        types: [
            {type: 'info', background: '#99a1af', icon: false},
            {type: 'warning', background: '#efb100', icon: false},
        ]
    });
    return notyf;
}