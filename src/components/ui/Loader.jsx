export default function LoaderSquare({className}) {
    return (
        <div className={`flex flex-nowrap gap-1 h-6 ${className}`}>
            <span className="loader-square" />
            <span className="loader-square animation-delay-200" />
            <span className="loader-square animation-delay-400" />
        </div>
    )
}

export function LoaderCircle({className}) {
    return (
        <div className={`flex flex-nowrap gap-[3px] h-4 ${className}`}>
            <span className="loader-circle" />
            <span className="loader-circle animation-delay-200" />
            <span className="loader-circle animation-delay-400" />
        </div>
    )
}
