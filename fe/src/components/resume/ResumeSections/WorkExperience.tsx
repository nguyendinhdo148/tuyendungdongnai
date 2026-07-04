interface WorkExperienceProps {
  company: string;
  role: string;
  duration: string;
  durationColor: string;
  description: string;
}

const WorkExperience = ({
  company,
  role,
  duration,
  durationColor,
  description,
}: WorkExperienceProps) => {
  return (
    <div className="mb-5">
      <div className="grid grid-cols-[1fr_auto] gap-2">
        <div>
          <h3 className="text-[15px] font-semibold text-gray-900">{company}</h3>
          <p className="text-[15px] font-medium text-gray-700 break-words">
            {role}
          </p>
        </div>

        <p
          className="text-xs font-bold italic whitespace-nowrap text-right"
          style={{ color: durationColor }}
        >
          {duration}
        </p>
      </div>

      <p className="text-smt text-gray-600 font-medium italic mt-1">
        {description}
      </p>
    </div>
  );
};

export default WorkExperience;
