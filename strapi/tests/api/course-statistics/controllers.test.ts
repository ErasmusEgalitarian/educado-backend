/* Tests for controllers */
import { getCertificatesStats, getStudentStats, getContentCreatorFeedback } from "../../../src/api/course-statistics/controllers/course-statistics";
import feedback from "../../../src/api/feedback/controllers/feedback";

describe('Test statistics', () => {
    let strapiMock;
    const contentCreatorId = "creator";
    const currentDate = "2025-11-15";

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
                    {completionDate: new Date("2025-10-10"), course: {documentId: "course2"}},
                    {completionDate: new Date("2025-10-30"), course: {documentId: "course1"}},
                    {completionDate: new Date("2025-11-05"), course: {documentId: "course2"}},
                ]),
                count: jest.fn().mockResolvedValue(2)
            }
        });

        let result : any = await getCertificatesStats(contentCreatorId);
        expect(result).toBeDefined();
        expect(result.total).toBeDefined();
        expect(result.progress).toBeDefined();
        expect(result.progress).toEqual({
            thisMonth: 33,
            lastSevenDays: 0,
            lastThirtyDays: 100
        });
    });

    it('Get students statistics for a content creator', async () => {
        strapiMock.documents = jest.fn().mockImplementation((api) => {
            return {
                findFirst: jest.fn().mockResolvedValue({
                    courses: [
                        { documentId: "course1", course_relations: [
                            {enrollmentDate: new Date("2025-10-05")},
                            {enrollmentDate: new Date("2025-10-10")},
                            {enrollmentDate: new Date("2025-10-19")},
                            {enrollmentDate: new Date("2025-10-20")},
                            {enrollmentDate: new Date("2025-10-25")}
                        ]}, 
                        { documentId: "course2", course_relations: [
                            {enrollmentDate: new Date("2025-9-05")},
                            {enrollmentDate: new Date("2025-10-11")},
                            {enrollmentDate: new Date("2025-10-19")},
                            {enrollmentDate: new Date("2025-10-21")},
                            {enrollmentDate: new Date("2025-11-12")}
                        ]}
                    ]
                })
            }
        });

        let result : any = await getStudentStats(contentCreatorId, ["course1", "course2"]);
        expect(result).toBeDefined();
        expect(result.total).toBeDefined();
        expect(result.progress).toBeDefined();
        expect(result.total).toEqual(10);
        expect(result.progress).toEqual({
            thisMonth: 11,
            lastSevenDays: 11,
            lastThirtyDays: 150
        });
    });

    it('Get all course feedbacks for a content creator', async () => {
        strapiMock.documents = jest.fn().mockImplementation((api) => {
            return {
                findFirst: jest.fn().mockResolvedValue({
                    courses: [
                        { documentId: "course1", feedbacks:[ 
                            { rating: 4, dateCreated: new Date("2025-11-14") },
                            { rating: 3, dateCreated: new Date("2025-11-14") },
                            { rating: 5, dateCreated: new Date("2025-11-14") },
                            { rating: 4, dateCreated: new Date("2025-11-01") },
                            { rating: 2, dateCreated: new Date("2025-11-01") },
                            { rating: 2, dateCreated: new Date("2025-11-01") },
                            { rating: 5, dateCreated: new Date("2025-11-01") },
                        ]}, 
                        { documentId: "course2", feedbacks:[ 
                            { rating: 1, dateCreated: new Date("2025-09-05") },
                            { rating: 1, dateCreated: new Date("2025-09-05") },
                            { rating: 1, dateCreated: new Date("2025-09-05") },
                            { rating: 2, dateCreated: new Date("2025-10-21") },
                            { rating: 3, dateCreated: new Date("2025-10-21") },
                            { rating: 2, dateCreated: new Date("2025-10-21") },
                            { rating: 5, dateCreated: new Date("2025-10-21") }
                        ]}
                    ]
                })
            }
        });

        let result : any = await getContentCreatorFeedback(contentCreatorId);
        expect(result).toBeDefined();
        expect(result.total).toBeDefined();
        expect(result.progress).toBeDefined();
        expect(result.total).toBe(2.9);
        expect(result.progress).toEqual({
            thisMonth: 0.7,
            lastSevenDays: 1.1,
            lastThirtyDays: 0.5
        });
    });
});

