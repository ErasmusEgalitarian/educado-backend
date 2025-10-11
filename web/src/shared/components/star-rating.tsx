import { mdiStar, mdiStarOutline, mdiStarHalfFull } from "@mdi/js";
import { Icon } from "@mdi/react";
import { useMemo } from "react";

import { cn } from "../lib/utils";

interface StarRatingProps {
  rating?: number;
  maxRating?: number;
  starCount?: number;
  className?: string;
  size?: "sm" | "md" | "lg";
}

/**
 * Helper function for rounding to nearest half
 *
 * @param num
 * @returns rounded number
 */
const roundHalf = (num: number) => {
  return Math.round(num * 2) / 2;
};

const getValidationError = (
  rating: number,
  starCount: number,
  maxRating: number
): string | null => {
  if (starCount <= 0) return "Invalid starCount: must be a positive integer.";
  if (maxRating <= 0) return "Invalid maxRating: must be a positive integer.";
  if (!Number.isFinite(rating))
    return "Invalid rating: must be a finite number.";
  if (rating < 0)
    return "Invalid rating: must be between 0 and " + String(maxRating) + ".";
  if (rating > maxRating)
    return "Invalid rating: must be between 0 and " + String(maxRating) + ".";
  return null;
};

/**
 * @param props
 * @param props.rating
 * @param props.maxRating (optional) default=5
 * @param props.starCount (optional) default=5
 * @param props.className (optional)
 * @returns HTML Element
 *
 * #### This component takes a rating and displays it as stars.
 *
 * It is mainly used to display an average rating of 1 to 5.
 * But it can take any range of ratings and display it as any amount of stars.
 */
const StarRating = ({
  rating = 0,
  maxRating = 5,
  starCount = 5,
  className,
  size = "md",
}: StarRatingProps) => {
  // Pre-generate stable ids for keys to satisfy lint rules (hook before any early return)
  const starIds = useMemo(
    () => Array.from({ length: starCount }, (_, i) => "star-" + String(i)),
    [starCount]
  );
  // Validate synchronously (avoid setState during render)
  const validationError = getValidationError(rating, starCount, maxRating);

  if (validationError !== null) {
    return (
      <div
        role="alert"
        className={cn(className, "font-bold text-error-text-label")}
      >
        {validationError}
      </div>
    );
  }

  // Clamp rating to [0, maxRating] for safety even if validation is bypassed
  const clampedRating = Math.min(Math.max(rating, 0), maxRating);

  // Calculate how many stars should be filled
  const ratingPercentage: number = clampedRating / maxRating;
  const totalFilledStars: number = roundHalf(ratingPercentage * starCount);
  const fullStars: number = Math.floor(totalFilledStars);
  const shouldShowHalfStar: boolean = totalFilledStars % 1 === 0.5;
  const emptyStars: number = Math.max(
    0,
    starCount - fullStars - (shouldShowHalfStar ? 1 : 0)
  );

  // Determine star size based on size prop
  const starSizes = {
    sm: 0.8,
    md: 1.2,
    lg: 1.6,
  };

  const textSizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-xl",
  };

  return (
    <div className={cn(className, "flex items-center text-chart-4")}>
      <div className="flex items-center leading-none">
        {/* Generate full stars */}
        {starIds.slice(0, Math.max(0, fullStars)).map((id) => (
          <Icon
            key={id}
            path={mdiStar}
            className="shrink-0 leading-none"
            size={starSizes[size]}
          />
        ))}

        {/* Generate half star if needed */}
        {shouldShowHalfStar && (
          <Icon
            path={mdiStarHalfFull}
            className="shrink-0 leading-none"
            size={starSizes[size]}
          />
        )}

        {/* Generate empty stars */}
        {starIds
          .slice(
            fullStars + (shouldShowHalfStar ? 1 : 0),
            fullStars + (shouldShowHalfStar ? 1 : 0) + Math.max(0, emptyStars)
          )
          .map((id) => (
            <Icon
              key={id}
              path={mdiStarOutline}
              className="shrink-0 leading-none"
              size={starSizes[size]}
            />
          ))}
      </div>

      {/* Display the rating as text */}
      <p className={cn("ml-2 leading-none self-center", textSizes[size])}>
        {Math.round(clampedRating * 10) / 10}
      </p>
    </div>
  );
};

export default StarRating;
