export const CourseGridCardLoading = () => {
  return (
    <div className="overflow-hidden shadow-lg rounded h-90 w-full cursor-pointer m-auto">
      <div className="bg-gray-200 h-48  rounded-t-xl p-3 overflow-hidden animate-pulse" />
      <div className="bg-white w-full p-4 space-y-2">
        <div className="h-6 w-16 bg-gray-200 rounded animate-pulse" />
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />

        <div className="flex items-center mt-4">
          <span className="block relative">
            <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse" />
          </span>
          <div className="flex flex-col justify-between ml-4 text-sm space-y-2">
            <div className="h-10 w-48 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
};
