import { mdiPencil } from "@mdi/js";
import { Icon } from "@mdi/react";

import { Course } from "../types/Course";

/**
 * Returns a string with the time difference between two dates.
 * > Note: doesn't account for leap years, different month lengths, etc.\
 * > Couldn't be arsed, I'm sorry
 *
 * @param fromDate
 * @param toDate
 * @returns String
 */
const getFormattedTimeDifference = (fromDate: Date, toDate: Date): string => {
  const minuteDifference = Math.floor(
    (toDate.getTime() - fromDate.getTime()) / 1000 / 60
  );

  // Minutes
  if (minuteDifference < 60) {
    return `${minuteDifference} minutos atrás`;
  }
  // Hours
  if (minuteDifference < 60 * 24) {
    return `${Math.floor(minuteDifference / 60)} horas atrás`;
  }
  // Days
  if (minuteDifference < 60 * 24 * 7) {
    return `${Math.floor(minuteDifference / 60 / 24)} dias atrás`;
  }
  // Weeks
  if (minuteDifference < 60 * 24 * 30) {
    return `${Math.floor(minuteDifference / 60 / 24)} semanas atrás`;
  }
  // Months
  if (minuteDifference < 60 * 24 * 365) {
    return `${Math.floor(minuteDifference / 60 / 24 / 30)} meses atrás`;
  }

  // Show date if difference is > 1 year
  return fromDate.toLocaleDateString();
};

/**
 * Displays the last time a course was edited
 *
 * @param course
 * @returns HTML Element
 */
export const LastEdited = ({ course }: { course: Course }) => {
  return (
    <>
      <div className="flex flex-row">
        <Icon path={mdiPencil} className="w-4 mr-1 inline-block mr-1" />
        <p className="text-md italic">
          {getFormattedTimeDifference(
            new Date(course.dateUpdated ?? Date.now()),
            new Date()
          )}
        </p>
      </div>
    </>
  );
};
