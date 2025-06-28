import useGoBack from '../hooks/useGoBack'

export default function Error404() {
    const goBack = useGoBack();

    return (
        <div className="flex flex-col justify-center items-center w-screen h-screen">
            <h2 className="text-8xl text-gray-400 dark:text-gray-500 font-bold">404</h2>
            <p className="text-gray-300 dark:text-gray-600">Page Not Found</p>
            <button className="appearance-none text-blue-600 dark:text-blue-400 hover:text-blue-400 dark:hover:text-blue-600 mt-8"
                onClick={goBack}>Go Back</button>
        </div>
    )
}
