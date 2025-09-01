const ProductOverviewSkeleton = () => {
    return (
        <section className="py-8 bg-white md:py-16 dark:bg-gray-900 antialiased animate-pulse">
            <div className="max-w-screen-xl px-4 mx-auto 2xl:px-0">
                <div className="lg:grid lg:grid-cols-2 lg:gap-8 xl:gap-16">

                    {/* Image Placeholder */}
                    <div className="shrink-0 max-w-md lg:max-w-lg mx-auto">
                        <div className="w-full h-80 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                    </div>

                    {/* Info Placeholder */}
                    <div className="mt-6 sm:mt-8 lg:mt-0 space-y-4">
                        {/* Title */}
                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>

                        {/* Price + Rating */}
                        <div className="flex gap-4 items-center">
                            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                            <div className="flex gap-1">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <div
                                        key={i}
                                        className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded"
                                    ></div>
                                ))}
                            </div>
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4">
                            <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                            <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                        </div>

                        <hr className="my-6 border-gray-200 dark:border-gray-800" />

                        {/* Description */}
                        <div className="space-y-3">
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProductOverviewSkeleton;
