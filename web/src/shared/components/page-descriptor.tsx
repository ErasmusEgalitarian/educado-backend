export const PageDescriptor = ({
  title,
  desc,
}: {
  title: string;
  desc: string;
}) => {
  return (
    <div className="header flex items-end justify-between p-6 border-b">
      <div className="title">
        <p className="text-3xl font-bold text-gray-800 mb-4">{title}</p>
        <p className="text-xl font-light text-gray-500">{desc}</p>
      </div>
    </div>
  );
};
