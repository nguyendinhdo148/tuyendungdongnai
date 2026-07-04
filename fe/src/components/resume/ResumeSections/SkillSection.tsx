import Progress from "../components/Progress";

interface Skill {
  name: string;
  progress: number;
  accentColor?: string;
  bgColor?: string;
}

interface Props {
  skills: Skill[];
  accentColor: string;
  bgColor: string;
}

const SkillInfo = ({
  name,
  progress,
  accentColor,
  bgColor,
}: Skill & { accentColor: string; bgColor: string }) => {
  return (
    <div className="grid grid-cols-[80px_1fr] items-center">
      <p className="text-[12px] font-semibold text-gray-900">{name}</p>

      {progress > 0 && (
        <Progress
          progress={(progress / 100) * 5}
          color={accentColor}
          bgColor={bgColor}
          total={5}
        />
      )}
    </div>
  );
};

const SkillSection = ({ skills, accentColor, bgColor }: Props) => {
  return (
    <div className="grid grid-cols-2 gap-x-5 gap-y-1 mb-5">
      {skills?.map((skill, index) => (
        <SkillInfo
          key={index}
          name={skill.name}
          progress={skill.progress}
          accentColor={accentColor}
          bgColor={bgColor}
        />
      ))}
    </div>
  );
};

export default SkillSection;
