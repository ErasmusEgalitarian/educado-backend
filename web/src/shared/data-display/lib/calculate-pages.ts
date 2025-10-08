/* eslint-disable @typescript-eslint/naming-convention */

export type PageElement = number | "...";

export const calculatePages = (
    currentPage: number,
    totalPages: number
): PageElement[] => {
    const maxPageNumbersToShow = 7;
    let pages: PageElement[];

    if (totalPages <= maxPageNumbersToShow) {
        pages = Array.from<number>({ length: totalPages }).map((_, index) => index);
    } else {
        pages = Array.from<PageElement>({ length: maxPageNumbersToShow }).fill(0);
        pages[0] = 0;
        pages[maxPageNumbersToShow - 1] = totalPages - 1;

        if (currentPage <= 3) {
            for (let index = 1; index < maxPageNumbersToShow - 2; index++) {
                pages[index] = index;
            }
            pages[maxPageNumbersToShow - 2] = "...";
        } else if (currentPage >= totalPages - 4) {
            pages[1] = "...";
            for (
                let index = 2, index_ = totalPages - 5;
                index < maxPageNumbersToShow - 1;
                index++, index_++
            ) {
                pages[index] = index_;
            }
        } else {
            pages[1] = "...";
            pages[maxPageNumbersToShow - 2] = "...";
            pages[2] = currentPage - 1;
            pages[3] = currentPage;
            pages[4] = currentPage + 1;
        }
    }

    return pages;
};