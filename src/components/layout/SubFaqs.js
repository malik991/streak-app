import plus from "../../../public/Plus.svg";
import Image from "next/image";
export default function QASubComponent({ headingText }) {
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-[#172026] text-[16px] font-medium leading-6">
        {headingText}
      </h2>
      <Image src={plus} alt="plus pic" />
    </div>
  );
}
