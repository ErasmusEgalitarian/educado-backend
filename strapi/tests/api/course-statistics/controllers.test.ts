
/* Tests for controllers */
import { getCertificatesStats, getStudentStats, getContentCreatorFeedback, getCoursesStats } from "../../../src/api/course-statistics/controllers/course-statistics";
import feedback from "../../../src/api/feedback/controllers/feedback";
describe('Test statistics', () => {
    let strapiMock;
    const contentCreatorId = "creator";
    const currentDate = "2025-11-15";

    const mockFilteredCourses = [
        {
            documentId: "course1", createdAt: new Date("2025-10-18"),
            course_relations: [{enrollmentDate: new Date("2025-11-13")}, {enrollmentDate: new Date("2025-11-14")}, {enrollmentDate: new Date("2025-10-18")}, {enrollmentDate: new Date("2025-11-2")}],
            feedbacks: [{createdAt: new Date("2025-10-20"), rating: 5}, {createdAt: new Date("2025-11-15"), rating: 3}, {createdAt: new Date("2025-11-15"), rating: 3}, {createdAt: new Date("2025-11-15"), rating: 3}],
        },
        {
            documentId: "course2", createdAt: new Date("2025-9-2"),
            course_relations: [{enrollmentDate: new Date("2025-9-3")}, {enrollmentDate: new Date("2025-9-3")}, {enrollmentDate: new Date("2025-10-18")}, {enrollmentDate: new Date("2025-11-2")}],
            feedbacks: [{createdAt: new Date("2025-10-20"), rating: 5}, {createdAt: new Date("2025-9-4"), rating: 5}, {createdAt: new Date("2025-11-15"), rating: 4}, {createdAt: new Date("2025-11-15"), rating: 4}],
        },
        {
            documentId: "course3", createdAt: new Date("2025-9-2"),
            course_relations: [{enrollmentDate: new Date("2025-9-3")}, {enrollmentDate: new Date("2025-9-3")}, {enrollmentDate: new Date("2025-10-18")}, {enrollmentDate: new Date("2025-11-2")}],
            feedbacks: [{createdAt: new Date("2025-10-20"), rating: 3}, {createdAt: new Date("2025-9-4"), rating: 2}, {createdAt: new Date("2025-11-15"), rating: 3}, {createdAt: new Date("2025-11-15"), rating: 3}],
        }
    ]

    beforeAll(() => {
        jest.spyOn(Date, "now").mockImplementation(() => new Date(currentDate).valueOf())
    })

    beforeEach(() => {
        strapiMock = {
            documents: jest.fn()
        };
        strapi = strapiMock;
    });

    it('Get certificate statistics for a content creator', async () => {
        strapiMock.documents = jest.fn().mockImplementation((api) => {
            return {
                findOne: jest.fn().mockResolvedValue({
                    courses: [{ documentId: "course1" }, { documentId: "course2" }]
                }),
                findMany: jest.fn().mockResolvedValue([
                    {completionDate: new Date("2025-10-05"), course: {documentId: "course1"}},
                    {completionDate: new Date("2025-10-10"), course: {documentId: "course1"}},
                    {completionDate: new Date("2025-10-30"), course: {documentId: "course2"}},
                    {completionDate: new Date("2025-11-05"), course: {documentId: "course2"}},
                    {completionDate: new Date("2025-11-10"), course: {documentId: "course3"}},
                    {completionDate: new Date("2025-11-15"), course: {documentId: "course3"}},
                ]),
                count: jest.fn().mockResolvedValue(2)
            }
        });

        const result = await getCertificatesStats(mockFilteredCourses);
        expect(result).toBeDefined();
        expect(result.total).toBeDefined();
        expect(result.progress).toBeDefined();
        expect(result.total).toBe(6);
        expect(result.progress).toEqual({
            thisMonth: 100,
            lastSevenDays: 50,
            lastThirtyDays: 200
        });
    });

    it('Get students statistics for a content creator', async () => {
        const result = await getStudentStats(mockFilteredCourses);
        expect(result).toBeDefined();
        expect(result.total).toBeDefined();
        expect(result.progress).toBeDefined();
        expect(result.total).toEqual(12);
        expect(result.progress).toEqual({
            thisMonth: 71,
            lastSevenDays: 20,
            lastThirtyDays: 200
        });
    });

    it('Get all course feedbacks for a content creator', async () => {
        const result = await getContentCreatorFeedback(mockFilteredCourses);
        expect(result).toBeDefined();
        expect(result.total).toBeDefined();
        expect(result.progress).toBeDefined();
        expect(result.total).toBe(3.6);
        expect(result.progress).toEqual({
            thisMonth: -0.3,
            lastSevenDays: -0.3,
            lastThirtyDays: 0
        });
    });

    it('Get course statistics for a content creator', async () => {
        const result = await getCoursesStats(mockFilteredCourses);
        expect(result).toBeDefined();
        expect(result.total).toBeDefined();
        expect(result.progress).toBeDefined();
        expect(result.total).toEqual(3);
        expect(result.progress).toEqual({
            lastSevenDays: 0,
            lastThirtyDays: 50,
            thisMonth: 0
        });
    });
    
});
