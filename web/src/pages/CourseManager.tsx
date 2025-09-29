import { CourseComponent } from "../components/Courses/CourseComponent";
import { CoursePreview } from "../components/Courses/CoursePreview";
import { SectionCreation } from "../components/SectionCreation";
import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { useApi } from "@hooks/useAPI";
import { getUserToken } from '../helpers/userInfo';
import Checklist from "../components/Checklist";
import FeedbackBox from "../components/FeedbackBox";
import Layout from "../components/Layout";
import CourseServices from '../services/course.services';
import StorageServices from '../services/storage.services';
import Loading from '../components/general/Loading';
import NotFound from '../pages/NotFound';
import { CourseProvider, useCourse, useMedia} from '../contexts/courseStore';
import { convertSrcToFile } from "@helpers/fileHelpers";

import { Course } from '../interfaces/Course';

/**
 * This component is responsible for creating and editing courses.
 * 
 * @param token The user token
 * @param id The course id
 * @returns HTML Element
 */

const CourseManager = () => {
    const token = getUserToken();
    const { tick } = useParams();
    const [id, setId] = useState<string>(useParams().id ?? "0");
    const [tickChange, setTickChange] = useState<number>(parseInt(tick ?? "0"));
    const [highestTick, setHighestTick] = useState<number>(0);
    const {course, updateCourse } = useCourse();
    const { addMediaToCache } = useMedia();
    const newCourse = id === "0";
    const courseCached = course.title !== "";
    /**
     * Extra function to handle the response from the course service before it is passed to the useSWR hook
     * 
     * @param url The url to fetch the course details from backend
     * @param token The user token
     * @returns The course details
     */
    const {call: getCourseDetails, isLoading: fetchLoading, error: fetchError } = useApi(CourseServices.getCourseDetail);
    const { call: fetchCoverImg} = useApi(StorageServices.getMedia);
    
    useEffect(() => {
        if (courseCached) return
        if (newCourse) return
        const fetchCourseData = async () => {
            const data = await getCourseDetails(id, token)
            updateCourse(data) 

        }
        const fetchPreview = async () => {
            const courseImgId = id + "_c";
            const fileSrc = await fetchCoverImg(courseImgId);
            const validFileSrc = fileSrc !== null && fileSrc !== undefined;
            if (validFileSrc) {
              const file = await convertSrcToFile(fileSrc, `${id}_c`);
              addMediaToCache({ id: id, file: file, parentType: "c" });
            }
          };
          const fetchData = async () => {
            try {
                await Promise.all([fetchCourseData(), fetchPreview()]);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        
        fetchData();
    }, [])


    const isCourseBasicInformation = (course: Course) => {
        return course.title !== "" && course.description !== "" && course.category !== "" && (course.difficulty !== 0) && course.coverImg !== "";
    }

    const doesCourseSectionsExist = (course: Course) => {
        return course.sections.length > 0;
    }

    useEffect(() => {
        const calculateMaxTick = (data: Course) => {
            if (isCourseBasicInformation(data)) {
                if (doesCourseSectionsExist(data)) return 2;
                else return 1;
            }
            return 0;
        };
        if (newCourse) {
            return;
        }

        if (courseCached) {
            const maxTick = calculateMaxTick(course);
            setHighestTick(maxTick);
        }
    }, [course, id]);

    function handleTickChange(newTick: number) {
        setTickChange(newTick);
        if (newTick > highestTick) {
            setHighestTick(newTick);
        }
    }

    function updateHighestTick(newHighestTick: number) {
        setHighestTick(newHighestTick);
    }

    if (fetchLoading) return <Layout meta='course overview'><Loading /></Layout>;
    if (fetchError) return <NotFound />;

    return (
        <Layout meta="Course Manager">
            <div className="flex flex-row  w-full">
                <div className="flex flex-col h-full items-start justify-start m-8 w-[312px] ">
                    <Checklist tickChange={tickChange} highestTick={highestTick} id={id ?? ""} setTickChange={handleTickChange} />
                    <p className="text-2xl text-grayMedium my-4">Feedbacks</p>
                    <FeedbackBox id={id ?? ''} token={token} />
                </div>
                <div className='flex-none w-2/3 mr-20'>
                    {tickChange === 0 && <CourseComponent id={id} setTickChange={handleTickChange} setId={setId} updateHighestTick={updateHighestTick} />}
                    {tickChange === 1 && <SectionCreation  setTickChange={handleTickChange} />}
                    {tickChange === 2 && <CoursePreview id={id ?? ""} setTickChange={handleTickChange}/>}
                </div>
            </div>
        </Layout>
    );
};

const CourseManagerWrapper = () => (
    <CourseProvider>
        <CourseManager />
    </CourseProvider>
);

export default CourseManagerWrapper;