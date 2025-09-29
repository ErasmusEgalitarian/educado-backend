// Interfaces
import statuses from "../../helpers/courseStatuses";

interface DraftCircleProps {
  statusSTR: string;
}

export const DraftCircle = ({statusSTR}: DraftCircleProps) => {

  return (
    <div>
      <div className={'w-3 h-3 mx-2 rounded-full m-auto '+(statuses[statusSTR].color ?? statuses.default.color)} />
      <p className='italic'>
        {statuses[statusSTR].br ?? statuses.default.br}
      </p>
    </div>
  );
}
