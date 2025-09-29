import { Main } from '../../interfaces/Course';

// Components
import { CourseGridCard } from './CourseGridCard';

export const CourseGrid = (data: Main) => {
    // local data clone
    // const [localData, setLocalData] = useState(data);
    // const [search, setSearch] = useState<string>("");
    // const debouncedSearch = useDebounce<string>(search, 250);

    // // Simple search change
    // const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    //     setSearch(event.target.value)
    // }

    // // Client side filtering
    // useEffect(() => {
    //     if (debouncedSearch !== '') {
    //         setLocalData(localData.filter((d: any) => d.title.toLowerCase().includes(debouncedSearch.toLowerCase()) == true));
    //     } else {
    //         setLocalData(data);
    //     }
    // }, [debouncedSearch, localData, data]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 p-6">
            {data.data.map((course: any, key: number) => <CourseGridCard course={course} key={key} />)}
        </div>
    )
}
