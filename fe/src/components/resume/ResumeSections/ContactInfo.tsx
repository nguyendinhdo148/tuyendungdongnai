interface Props {
  icon: React.ReactNode;
  iconBg: string;
  value: string;
}

const ContactInfo = ({ icon, iconBg, value }: Props) => {
  return (
    <div className="flex gap-3 items-center">
      <div
        className="w-[30px] h-[30px] flex items-center justify-center rounded-full"
        style={{ backgroundColor: iconBg }}
      >
        {icon}
      </div>

      <p className="flex-1 text-[12px] font-medium break-all">{value}</p>
    </div>
  );
};

export default ContactInfo;
