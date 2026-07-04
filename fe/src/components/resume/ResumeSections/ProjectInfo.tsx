import { GoLink } from "react-icons/go";
import { FaGithub } from "react-icons/fa";
import ActionLink from "../components/ActionLink";

interface Props {
  title: string;
  description: string;
  githubLink: string;
  liveDemoLink: string;
  bgColor: string;
  isPreview: boolean;
}

const ProjectInfo = ({
  title,
  description,
  githubLink,
  liveDemoLink,
  bgColor,
  isPreview,
}: Props) => {
  return (
    <div className="mb-5">
      <h3
        className={`${
          isPreview ? "text-xs" : "text-base"
        } font-semibold  text-gray-900`}
      >
        {title}
      </h3>

      <p className="text-sm text-gray-700 font-medium mt-1">{description}</p>

      <div className="flex items-center gap-3 mt-2">
        {githubLink && (
          <ActionLink icon={<FaGithub />} link={githubLink} bgColor={bgColor} />
        )}

        {liveDemoLink && (
          <ActionLink icon={<GoLink />} link={liveDemoLink} bgColor={bgColor} />
        )}
      </div>
    </div>
  );
};

export default ProjectInfo;
