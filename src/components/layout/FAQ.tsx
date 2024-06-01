import Image from "next/image";
import minus from "../../../public/Minus.svg";
import QASubComponent from "../../components/layout/SubFaqs";

export default function FaqPage() {
  return (
    <div className="py-12 pr-5">
      <div className="flex flex-col lg:flex-row lg:gap-x-6">
        <div className="lg:flex-1 lg:py-8 lg:pr-14">
          <h3 className="text-[#EB2891] text-[14px] font-medium leading-[22px]">
            Frequently Asked Questions
          </h3>
          <h1 className="py-[16px] text-[24px] font-medium leading-9">
            Let&#39;s clarify some of your questions
          </h1>
          <p className="text-[#36485C] text-[16px] font-[400px] leading-6">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore
          </p>
        </div>
        <div className="pt-6 lg:flex-1">
          <div className="p-4  bg-[#E3F1FF] rounded-lg flex flex-col">
            <div>
              <div className="flex justify-between items-center gap-x-4">
                <h2 className="text-[#172026] text-[16px] font-medium leading-6">
                  Ut enim ad minima veniam, quis nostrum exercitationem ullam?
                </h2>
                <Image src={minus} alt="minur svg" />
              </div>
              <div className="pt-2">
                <p className="text-[#36485C] text-[16px] font-[400px] leading-6">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore. Nemo enim ipsam
                  voluptatem quia voluptas sit aspernatur aut odit aut fugit.
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Neque
                  porro quisquam est, qui dolorem ipsum quia dolor sit amet.
                </p>
              </div>
            </div>
          </div>
          <div className="p-4 mt-4 bg-[#E3F1FF] rounded-lg">
            <QASubComponent
              headingText={
                "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit?"
              }
            />
          </div>
          <div className="p-4 mt-4 bg-[#E3F1FF] rounded-lg">
            <QASubComponent
              headingText={
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit?"
              }
            />
          </div>
          <div className="p-4 mt-4 bg-[#E3F1FF] rounded-lg">
            <QASubComponent
              headingText={
                "Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet?"
              }
            />
          </div>
          <div className="p-4 mt-4 bg-[#E3F1FF] rounded-lg">
            <QASubComponent
              headingText={
                "Ut enim ad minima veniam, quis nostrum exercitationem ullam?"
              }
            />
          </div>
          <div className="p-4 mt-4 bg-[#E3F1FF] rounded-lg">
            <QASubComponent
              headingText={
                "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit?"
              }
            />
          </div>
          <div className="p-4 mt-4 bg-[#E3F1FF] rounded-lg">
            <QASubComponent
              headingText={
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit?"
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
