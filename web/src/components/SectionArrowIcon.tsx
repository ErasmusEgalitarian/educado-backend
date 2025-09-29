import { Icon } from '@mdi/react';
import { mdiChevronUp } from '@mdi/js';
import { useEffect } from 'react';

interface SectionArrowIconProps {
  setArrowDirection: Function,
  arrowDirection: string,
  Checkbox: any
}

export const SectionArrowIcon = ({setArrowDirection, arrowDirection, Checkbox}: SectionArrowIconProps) => {

  useEffect(() => {
    if (Checkbox.current?.checked) {
      setArrowDirection(mdiChevronUp);
    }
  });


  return (
    <Icon path={arrowDirection} size={1} />
  );
}
