/* Tests for controllers */
import { getCertificatesStats } from "../../../src/api/course-statistics/controllers/course-statistics";

describe("Test statistics", () => {
  let strapiMock;
  const contentCreatorId = "creator";
  const currentDate = "2025-11-15";

  beforeAll(() => {
    jest
      .spyOn(Date, "now")
      .mockImplementation(() => new Date(currentDate).valueOf());
  });

  beforeEach(() => {
    strapiMock = {
      documents: jest.fn(),
    };
    strapi = strapiMock;
  });

  it("Get certificate statistics for a content creator", async () => {
    strapiMock.documents = jest.fn().mockImplementation((api) => {
      return {
        findOne: jest.fn().mockResolvedValue({
          courses: [{ documentId: "course1" }, { documentId: "course2" }],
        }),
        findMany: jest.fn().mockResolvedValue([
          {
            completionDate: new Date("2025-10-05"),
            course: { documentId: "course1" },
          },
          {
            completionDate: new Date("2025-10-10"),
            course: { documentId: "course2" },
          },
          {
            completionDate: new Date("2025-10-30"),
            course: { documentId: "course1" },
          },
          {
            completionDate: new Date("2025-11-05"),
            course: { documentId: "course2" },
          },
          {
            completionDate: new Date("2025-11-11"),
            course: { documentId: "course3" },
          },
        ]),
        count: jest.fn().mockResolvedValue(2),
      };
    });

    let result: any = await getCertificatesStats(contentCreatorId);
    expect(result).toBeDefined();
    expect(result.total).toBeDefined();
    expect(result.progress).toBeDefined();
    expect(result.progress).toEqual({
      thisMonth: 33,
      lastSevenDays: 0,
      lastThirtyDays: 100,
    });
  });

  it("Get students statistics for a content creator", async () => {
    strapiMock.documents = jest.fn().mockImplementation((api) => {});
  });
});
