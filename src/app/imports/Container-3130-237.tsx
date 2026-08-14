import svgPaths from "./svg-lr9azy2d5a";
import imgImage1 from "figma:asset/50ba81ee3baed0d032549253a352c5d27d54adb9.png";

function Heading() {
  return (
    <div className="h-[23.999px] relative shrink-0 w-full" data-name="Heading 4">
      <p className="absolute css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] left-0 not-italic text-[#1f2933] text-[16px] top-[-0.73px] tracking-[-0.3125px]">Balanced Option</p>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="h-[31.996px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute css-4hzbpn font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[32px] left-[-0.03px] not-italic text-[#101828] text-[24px] top-[-0.5px] tracking-[0.0703px] w-[106px]">$1,450</p>
    </div>
  );
}

function Container2() {
  return (
    <div className="h-[59.993px] relative shrink-0 w-[105.49px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[3.999px] items-start relative size-full">
        <Heading />
        <Paragraph />
      </div>
    </div>
  );
}

function Badge() {
  return (
    <div className="bg-[#d0f4e0] h-[23.999px] relative rounded-[15252000px] shrink-0 w-[72.436px]" data-name="Badge">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center overflow-clip px-[12px] py-[4px] relative rounded-[inherit] size-full">
        <p className="css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#44ad33] text-[12px]">In policy</p>
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="content-stretch flex h-[59.993px] items-start justify-between relative shrink-0 w-full" data-name="Container">
      <Container2 />
      <Badge />
    </div>
  );
}

function Icon() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.pdab9800} id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Heading1() {
  return (
    <div className="h-[23.999px] relative shrink-0 w-[48.168px]" data-name="Heading 4">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[24px] left-0 not-italic text-[#1f2933] text-[16px] top-[-0.73px] tracking-[-0.3125px]">Flights</p>
      </div>
    </div>
  );
}

function Text() {
  return (
    <div className="absolute h-[35.994px] left-[211px] top-[-6px] w-[97.322px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[36px] left-[97.92px] not-italic text-[#0a0a0a] text-[18px] text-right top-[-0.31px] tracking-[0.3955px] translate-x-[-100%] w-[111px]">$1,300</p>
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div className="content-stretch flex gap-[7.997px] h-[24px] items-center relative shrink-0 w-full" data-name="Container">
      <Icon />
      <Heading1 />
      <Text />
    </div>
  );
}

function Group() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid items-[start] justify-items-[start] leading-[0] relative shrink-0">
      <div className="bg-white col-1 ml-0 mt-0 rounded-[8px] row-1 size-[40px]" />
      <div className="col-1 h-[30px] ml-[1.09px] mt-[5.45px] relative row-1 w-[37px]" data-name="image 1">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage1} />
      </div>
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex items-start relative shrink-0 text-[#101828] w-full">
      <p className="css-4hzbpn font-['Inter:Bold',sans-serif] font-bold h-[20px] relative shrink-0 w-[97px]">19:00 - 11:05</p>
      <p className="css-4hzbpn font-['Inter:Regular',sans-serif] font-normal h-[20px] relative shrink-0 w-[124px]">Tue, Mar 3, 2026</p>
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex flex-col h-[39px] items-start leading-[20px] not-italic relative shrink-0 text-[14px] tracking-[-0.1504px] w-[219px]">
      <Frame />
      <p className="css-4hzbpn font-['Inter:Regular',sans-serif] font-normal h-[20px] relative shrink-0 text-[#364153] w-[219px]">Detla Airlines · DE 1234 · Direct</p>
    </div>
  );
}

function Frame5() {
  return (
    <div className="bg-[rgba(179,173,196,0.11)] relative rounded-[16px] shrink-0 w-full">
      <div aria-hidden="true" className="absolute border border-[rgba(179,173,196,0.28)] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <div className="flex flex-row items-end size-full">
        <div className="content-stretch flex gap-[11px] items-end pl-[12px] py-[16px] relative w-full">
          <Group />
          <Frame1 />
        </div>
      </div>
    </div>
  );
}

function Group1() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid items-[start] justify-items-[start] leading-[0] relative shrink-0">
      <div className="bg-white col-1 ml-0 mt-0 rounded-[8px] row-1 size-[40px]" />
      <div className="col-1 h-[30px] ml-[1.09px] mt-[5.45px] relative row-1 w-[37px]" data-name="image 1">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage1} />
      </div>
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex items-start relative shrink-0 text-[#101828] w-full">
      <p className="css-4hzbpn font-['Inter:Bold',sans-serif] font-bold h-[20px] relative shrink-0 w-[97px]">19:00 - 11:05</p>
      <p className="css-4hzbpn font-['Inter:Regular',sans-serif] font-normal h-[20px] relative shrink-0 w-[124px]">Thu, Mar 5, 2026</p>
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex flex-col h-[39px] items-start leading-[20px] not-italic relative shrink-0 text-[14px] tracking-[-0.1504px] w-[219px]">
      <Frame4 />
      <p className="css-4hzbpn font-['Inter:Regular',sans-serif] font-normal h-[20px] relative shrink-0 text-[#364153] w-[219px]">Detla Airlines · DE 1234 · Direct</p>
    </div>
  );
}

function Frame3() {
  return (
    <div className="bg-[rgba(179,173,196,0.11)] relative rounded-[16px] shrink-0 w-full">
      <div aria-hidden="true" className="absolute border border-[rgba(179,173,196,0.28)] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <div className="flex flex-row items-end size-full">
        <div className="content-stretch flex gap-[11px] items-end pl-[12px] py-[16px] relative w-full">
          <Group1 />
          <Frame2 />
        </div>
      </div>
    </div>
  );
}

function Frame11() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
      <Frame5 />
      <Frame3 />
    </div>
  );
}

function Frame12() {
  return (
    <div className="content-stretch flex flex-col gap-[15px] items-start relative shrink-0 w-full">
      <Container3 />
      <Frame11 />
    </div>
  );
}

function Icon1() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d="M8.33301 18.3344V12.8594" id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M10 9.16797H10.0083" id="Vector_2" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M10 5.83203H10.0083" id="Vector_3" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M11.667 12.8594V18.3344" id="Vector_4" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p20136f00} id="Vector_5" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M13.333 9.16797H13.3413" id="Vector_6" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M13.333 5.83203H13.3413" id="Vector_7" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M6.66699 9.16797H6.67533" id="Vector_8" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M6.66699 5.83203H6.67533" id="Vector_9" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p238f2580} id="Vector_10" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Heading2() {
  return (
    <div className="h-[23.999px] relative shrink-0 w-[38.651px]" data-name="Heading 4">
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[24px] left-0 not-italic text-[#1f2933] text-[16px] top-[-0.73px] tracking-[-0.3125px]">Hotel</p>
    </div>
  );
}

function Frame7() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
      <Icon1 />
      <Heading2 />
    </div>
  );
}

function Text1() {
  return (
    <div className="h-[24px] relative shrink-0 w-[97px]" data-name="Text">
      <p className="absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[36px] left-[97.57px] not-italic text-[#0a0a0a] text-[18px] text-right top-[-6.31px] tracking-[0.3955px] translate-x-[-100%] w-[111px]">$1,300</p>
    </div>
  );
}

function Frame8() {
  return (
    <div className="content-stretch flex gap-[145px] items-center relative shrink-0 w-full">
      <Frame7 />
      <Text1 />
    </div>
  );
}

function Group2() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid items-[start] justify-items-[start] leading-[0] relative shrink-0">
      <div className="bg-white col-1 ml-0 mt-0 rounded-[8px] row-1 size-[40px]" />
    </div>
  );
}

function Frame10() {
  return (
    <div className="content-stretch flex items-start relative shrink-0 w-full">
      <p className="css-4hzbpn font-['Inter:Bold',sans-serif] font-bold h-[20px] leading-[20px] not-italic relative shrink-0 text-[#101828] text-[14px] tracking-[-0.1504px] w-[194px]">New York Marriot Downtown</p>
    </div>
  );
}

function Frame9() {
  return (
    <div className="content-stretch flex flex-col h-[39px] items-start relative shrink-0 w-[219px]">
      <Frame10 />
      <p className="css-4hzbpn font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[20px] not-italic relative shrink-0 text-[#364153] text-[14px] tracking-[-0.1504px] w-[219px]">4.2★ · 0.8 mi to venue</p>
    </div>
  );
}

function Frame6() {
  return (
    <div className="bg-[rgba(179,173,196,0.11)] relative rounded-[16px] shrink-0 w-full">
      <div aria-hidden="true" className="absolute border border-[rgba(179,173,196,0.28)] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <div className="flex flex-row items-end size-full">
        <div className="content-stretch flex gap-[11px] items-end pl-[12px] py-[16px] relative w-full">
          <Group2 />
          <Frame9 />
        </div>
      </div>
    </div>
  );
}

function Frame13() {
  return (
    <div className="content-stretch flex flex-col gap-[15px] items-start relative shrink-0 w-full">
      <Frame8 />
      <Frame6 />
    </div>
  );
}

function Icon2() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p2f635300} id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d={svgPaths.p23837280} id="Vector_2" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d="M7.5 14.168H12.5" id="Vector_3" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d={svgPaths.p3849af00} id="Vector_4" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Heading3() {
  return (
    <div className="h-[23.999px] relative shrink-0 w-[38.651px]" data-name="Heading 4">
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[24px] left-0 not-italic text-[#1f2933] text-[16px] top-[-0.73px] tracking-[-0.3125px]">Ground Transport</p>
    </div>
  );
}

function Frame19() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
      <Icon2 />
      <Heading3 />
    </div>
  );
}

function Text2() {
  return (
    <div className="h-[24px] relative shrink-0 w-[97px]" data-name="Text">
      <p className="absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[36px] left-[97.57px] not-italic text-[#0a0a0a] text-[18px] text-right top-[-6.31px] tracking-[0.3955px] translate-x-[-100%] w-[111px]">$160</p>
    </div>
  );
}

function Frame18() {
  return (
    <div className="content-stretch flex gap-[145px] items-center relative shrink-0 w-full">
      <Frame19 />
      <Text2 />
    </div>
  );
}

function Icon3() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g clipPath="url(#clip0_3127_440)" id="Icon">
          <path d={svgPaths.p2a5cc00} id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d={svgPaths.p18a1600} id="Vector_2" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d="M1.75 18.168L7.08333 12.918" id="Vector_3" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d="M15.8333 4.16797L10 10.0013" id="Vector_4" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
        <defs>
          <clipPath id="clip0_3127_440">
            <rect fill="white" height="20" width="20" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Heading4() {
  return (
    <div className="h-[23.999px] relative shrink-0 w-[38.651px]" data-name="Heading 4">
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[24px] left-0 not-italic text-[#1f2933] text-[16px] top-[-0.73px] tracking-[-0.3125px]">Food</p>
    </div>
  );
}

function Frame21() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
      <Icon3 />
      <Heading4 />
    </div>
  );
}

function Text3() {
  return (
    <div className="h-[24px] relative shrink-0 w-[97px]" data-name="Text">
      <p className="absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[36px] left-[97.57px] not-italic text-[#0a0a0a] text-[18px] text-right top-[-6.31px] tracking-[0.3955px] translate-x-[-100%] w-[111px]">$300</p>
    </div>
  );
}

function Frame20() {
  return (
    <div className="content-stretch flex gap-[145px] items-center relative shrink-0 w-full">
      <Frame21 />
      <Text3 />
    </div>
  );
}

function Frame14() {
  return (
    <div className="content-stretch flex flex-col gap-[18px] items-start relative shrink-0 w-full">
      <Frame12 />
      <Frame13 />
      <Frame18 />
      <Frame20 />
    </div>
  );
}

function Frame15() {
  return (
    <div className="content-stretch flex flex-col gap-[23px] items-center relative shrink-0 w-full">
      <Frame14 />
      <div className="h-0 relative shrink-0 w-full">
        <div className="absolute inset-[-1px_0_0_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 314 1">
            <line id="Line 1" stroke="var(--stroke-0, #E6E6E6)" x2="314" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Icon4() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.p37426ec0} id="Vector" stroke="var(--stroke-0, #1F9D55)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.999871" />
        </g>
      </svg>
    </div>
  );
}

function Text4() {
  return (
    <div className="h-[15.991px] relative shrink-0 w-[121.997px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-0 not-italic text-[#4a5565] text-[14px] top-[0.67px]">Within policy</p>
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div className="content-stretch flex gap-[7.995px] h-[15.991px] items-center relative shrink-0 w-full" data-name="Container">
      <Icon4 />
      <Text4 />
    </div>
  );
}

function Icon5() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.p37426ec0} id="Vector" stroke="var(--stroke-0, #1F9D55)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.999871" />
        </g>
      </svg>
    </div>
  );
}

function Text5() {
  return (
    <div className="h-[15.991px] relative shrink-0 w-[69.779px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-0 not-italic text-[#4a5565] text-[14px] top-[0.67px]">Optimized for conference worktrip</p>
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="content-stretch flex gap-[7.995px] h-[15.991px] items-center relative shrink-0 w-full" data-name="Container">
      <Icon5 />
      <Text5 />
    </div>
  );
}

function Icon6() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.p37426ec0} id="Vector" stroke="var(--stroke-0, #1F9D55)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.999871" />
        </g>
      </svg>
    </div>
  );
}

function Text6() {
  return (
    <div className="h-[15.991px] relative shrink-0 w-[129.95px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-[0.01px] not-italic text-[#4a5565] text-[14px] top-[0.03px]">Suggesting based on user preferences</p>
      </div>
    </div>
  );
}

function Container7() {
  return (
    <div className="content-stretch flex gap-[7.995px] h-[15.991px] items-center relative shrink-0 w-full" data-name="Container">
      <Icon6 />
      <Text6 />
    </div>
  );
}

function Container4() {
  return (
    <div className="content-stretch flex flex-col gap-[7.995px] h-[64px] items-start relative shrink-0 w-full" data-name="Container">
      <Container5 />
      <Container6 />
      <Container7 />
    </div>
  );
}

function Frame16() {
  return (
    <div className="content-stretch flex flex-col gap-[23px] items-center relative shrink-0 w-full">
      <Frame15 />
      <Container4 />
    </div>
  );
}

function Button() {
  return (
    <div className="bg-[#e9e7ef] h-[45px] relative rounded-[12px] shrink-0 w-full" data-name="Button">
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-[155.5px] not-italic text-[18px] text-black text-center top-[13px] tracking-[-0.1504px] translate-x-[-50%]">Select and continue</p>
    </div>
  );
}

function Frame17() {
  return (
    <div className="content-stretch flex flex-col gap-[22px] items-center relative shrink-0 w-[314px]">
      <Frame16 />
      <Button />
    </div>
  );
}

export default function Container() {
  return (
    <div className="bg-[rgba(255,255,255,0.7)] content-stretch flex flex-col gap-[11.996px] items-start pb-[0.909px] pt-[20.909px] px-[20.909px] relative rounded-[24px] size-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[0.909px] border-[rgba(255,255,255,0.5)] border-solid inset-0 pointer-events-none rounded-[24px] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)]" />
      <Container1 />
      <Frame17 />
    </div>
  );
}