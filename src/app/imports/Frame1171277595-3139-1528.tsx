import svgPaths from "./svg-2x6bhkylry";
import imgImageAirline from "figma:asset/50ba81ee3baed0d032549253a352c5d27d54adb9.png";
import imgImageHotel from "figma:asset/3a7194d0c070824d982b80f6a329057d5ed3025a.png";

function Heading1() {
  return (
    <div className="h-[23.999px] mb-[-11px] relative shrink-0 w-full" data-name="Heading 3">
      <p className="absolute css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] left-0 not-italic text-[#1f2933] text-[16px] top-[-12.42px] tracking-[-0.3125px]">Balanced Option</p>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="h-[19.993px] mb-[-11px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#4a5565] text-[14px] top-[0.36px] tracking-[-0.1504px]">Best balance of cost and convenience</p>
    </div>
  );
}

function Container2() {
  return (
    <div className="h-[47.99px] relative shrink-0 w-[244.638px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[11px] relative size-full">
        <Heading1 />
        <Paragraph />
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="h-[60px] relative shrink-0 w-[297px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center relative size-full">
        <Container2 />
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

function Container() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-name="Container">
      <Container1 />
      <Badge />
    </div>
  );
}

function Text() {
  return (
    <div className="h-[19.993px] relative shrink-0 w-[136.193px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#364153] text-[14px] top-[0.36px] tracking-[-0.1504px] w-[137px]">Total cost (1 traveler)</p>
      </div>
    </div>
  );
}

function Text1() {
  return (
    <div className="h-[35.994px] relative shrink-0 w-[97.322px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute css-4hzbpn font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[36px] left-[-13.08px] not-italic text-[#0a0a0a] text-[30px] top-[-0.31px] tracking-[0.3955px] w-[111px]">$2,350</p>
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div className="h-[36px] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between relative size-full">
          <Text />
          <Text1 />
        </div>
      </div>
    </div>
  );
}

function Frame14() {
  return (
    <div className="content-stretch flex flex-col gap-[2px] items-start relative shrink-0 w-full">
      <Container />
      <Container3 />
    </div>
  );
}

function Frame51() {
  return (
    <div className="content-stretch flex flex-col gap-[14px] items-end relative shrink-0 w-full">
      <Frame14 />
      <div className="h-0 relative shrink-0 w-full">
        <div className="absolute inset-[-1px_0_0_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 577 1">
            <line id="Line 2" stroke="var(--stroke-0, #E6E6E6)" x2="577" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
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

function Frame7() {
  return (
    <div className="content-stretch flex gap-[11px] items-center relative shrink-0">
      <Icon />
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[24px] not-italic relative shrink-0 text-[#1f2933] text-[16px] tracking-[-0.3125px]">Flight to New York</p>
    </div>
  );
}

function Trash() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Trash">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Trash">
          <path d={svgPaths.p1c0c5900} fill="var(--fill-0, black)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex h-[24px] items-center justify-center p-[10px] relative rounded-[6px] shrink-0 w-[59px]">
      <div aria-hidden="true" className="absolute border border-[#c4c4c4] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[14px] text-black text-center tracking-[-0.1504px]">Edit</p>
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex gap-[6px] items-center relative shrink-0">
      <Trash />
      <Frame1 />
    </div>
  );
}

function Frame8() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <Frame7 />
      <Frame4 />
    </div>
  );
}

function ImageAirline() {
  return (
    <div className="relative shrink-0 size-[23.999px]" data-name="Image (Airline)">
      <img alt="" className="absolute bg-clip-padding border-0 border-[transparent] border-solid inset-0 max-w-none object-contain pointer-events-none size-full" src={imgImageAirline} />
    </div>
  );
}

function Container5() {
  return (
    <div className="bg-white content-stretch flex items-center justify-center pl-[0.909px] pr-[0.916px] py-[0.909px] relative rounded-[10px] shrink-0 size-[40px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#e5e7eb] border-[0.909px] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <ImageAirline />
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="h-[17.997px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-0 not-italic text-[#101828] text-[14px] top-[0.46px]">7:30 AM</p>
    </div>
  );
}

function Paragraph2() {
  return (
    <div className="content-stretch flex h-[13.999px] items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="css-4hzbpn flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal leading-[14px] min-h-px min-w-px not-italic relative text-[#6a7282] text-[11px]">PIT</p>
    </div>
  );
}

function Container8() {
  return (
    <div className="h-[31.996px] relative shrink-0 w-[56.57px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Paragraph1 />
        <Paragraph2 />
      </div>
    </div>
  );
}

function Container10() {
  return <div className="bg-[#e5e7eb] flex-[1_0_0] h-[0.994px] min-h-px min-w-px" data-name="Container" />;
}

function Text2() {
  return (
    <div className="h-[15px] relative shrink-0 w-[34.56px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[15px] left-0 not-italic text-[#6a7282] text-[10px] top-[0.36px]">1h 45m</p>
      </div>
    </div>
  );
}

function Container11() {
  return <div className="bg-[#e5e7eb] flex-[1_0_0] h-[0.994px] min-h-px min-w-px" data-name="Container" />;
}

function Container9() {
  return (
    <div className="flex-[1_0_0] h-[15px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[7.997px] items-center relative size-full">
        <Container10 />
        <Text2 />
        <Container11 />
      </div>
    </div>
  );
}

function Paragraph3() {
  return (
    <div className="h-[17.997px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-[56px] not-italic text-[#101828] text-[14px] text-right top-[0.46px] translate-x-[-100%]">9:15 AM</p>
    </div>
  );
}

function Paragraph4() {
  return (
    <div className="content-stretch flex h-[13.999px] items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="css-4hzbpn flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal leading-[14px] min-h-px min-w-px not-italic relative text-[#6a7282] text-[11px] text-right">EWR</p>
    </div>
  );
}

function Container12() {
  return (
    <div className="h-[31.996px] relative shrink-0 w-[55.028px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Paragraph3 />
        <Paragraph4 />
      </div>
    </div>
  );
}

function Container7() {
  return (
    <div className="content-stretch flex gap-[11.996px] h-[31.996px] items-center relative shrink-0 w-full" data-name="Container">
      <Container8 />
      <Container9 />
      <Container12 />
    </div>
  );
}

function Paragraph5() {
  return (
    <div className="h-[16.001px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-0 not-italic text-[#6a7282] text-[12px] top-[0.46px] w-[194px]">Delta Airlines · DL 3891 · Economy</p>
    </div>
  );
}

function Frame17() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full">
      <Container7 />
      <Paragraph5 />
    </div>
  );
}

function Container6() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col h-[40px] items-start min-h-px min-w-px relative" data-name="Container">
      <Frame17 />
    </div>
  );
}

function Frame18() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center relative w-full">
        <Container5 />
        <Container6 />
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="content-stretch flex h-[52px] items-start relative shrink-0 w-[302px]" data-name="Container">
      <Frame18 />
    </div>
  );
}

function Icon1() {
  return (
    <div className="relative shrink-0 size-[11.996px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.9957 11.9957">
        <g id="Icon">
          <path d={svgPaths.pe90300} id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeWidth="0.89968" />
          <path d={svgPaths.p2a17c420} id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeWidth="0.89968" />
        </g>
      </svg>
    </div>
  );
}

function Frame16() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0 w-full">
      <Icon1 />
      <p className="css-4hzbpn font-['Inter:Regular',sans-serif] font-normal h-[15px] leading-[13px] not-italic relative shrink-0 text-[#6a7282] text-[11px] w-[95px]">x1 Checked bag</p>
    </div>
  );
}

function Icon2() {
  return (
    <div className="relative shrink-0 size-[11.996px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.9957 11.9957">
        <g id="Icon">
          <path d={svgPaths.pe90300} id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeWidth="0.89968" />
          <path d={svgPaths.p2a17c420} id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeWidth="0.89968" />
        </g>
      </svg>
    </div>
  );
}

function Frame15() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0 w-full">
      <Icon2 />
      <p className="css-4hzbpn font-['Inter:Regular',sans-serif] font-normal h-[15px] leading-[13px] not-italic relative shrink-0 text-[#6a7282] text-[11px] w-[78px]">Carry-on bag</p>
    </div>
  );
}

function Frame19() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[99px]">
      <Frame16 />
      <Frame15 />
    </div>
  );
}

function Frame20() {
  return (
    <div className="bg-[#f7f6f8] content-stretch flex h-[93px] items-start justify-between p-[20px] relative rounded-[10px] shrink-0 w-[542px]">
      <div aria-hidden="true" className="absolute border-[0.91px] border-[rgba(179,173,196,0.28)] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <Container4 />
      <Frame19 />
    </div>
  );
}

function Frame39() {
  return (
    <div className="content-stretch flex gap-[23px] items-start relative shrink-0">
      <div className="flex h-[112px] items-center justify-center relative shrink-0 w-0" style={{ "--transform-inner-width": "0", "--transform-inner-height": "170.65625" } as React.CSSProperties}>
        <div className="flex-none rotate-[90deg]">
          <div className="h-0 relative w-[112px]">
            <div className="absolute inset-[-1px_0_0_0]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 112 1">
                <line id="Line 3" stroke="var(--stroke-0, #C3C3C3)" x2="112" y1="0.5" y2="0.5" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <Frame20 />
    </div>
  );
}

function Frame40() {
  return (
    <div className="content-stretch flex flex-col gap-[11px] items-end relative shrink-0 w-full">
      <Frame8 />
      <Frame39 />
    </div>
  );
}

function Frame46() {
  return (
    <div className="content-stretch flex flex-col gap-[14px] items-start relative shrink-0 w-full">
      <p className="css-4hzbpn font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] not-italic relative shrink-0 text-[#1f2933] text-[16px] tracking-[-0.3125px] w-full">Tuesday, Mar 3</p>
      <Frame40 />
    </div>
  );
}

function Icon3() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d="M8.33203 18.3344V12.8594" id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M10 9.16797H10.0083" id="Vector_2" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M10 5.83203H10.0083" id="Vector_3" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M11.668 12.8594V18.3344" id="Vector_4" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p20136f00} id="Vector_5" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M13.332 9.16797H13.3404" id="Vector_6" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M13.332 5.83203H13.3404" id="Vector_7" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M6.66797 9.16797H6.6763" id="Vector_8" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M6.66797 5.83203H6.6763" id="Vector_9" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p18a43400} id="Vector_10" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Frame9() {
  return (
    <div className="content-stretch flex gap-[14px] items-center relative shrink-0">
      <Icon3 />
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[24px] not-italic relative shrink-0 text-[#1f2933] text-[16px] tracking-[-0.3125px]">2- night stay in New York</p>
    </div>
  );
}

function Trash1() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Trash">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Trash">
          <path d={svgPaths.p1c0c5900} fill="var(--fill-0, black)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex h-[24px] items-center justify-center p-[10px] relative rounded-[6px] shrink-0 w-[59px]">
      <div aria-hidden="true" className="absolute border border-[#c4c4c4] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[14px] text-black text-center tracking-[-0.1504px]">Edit</p>
    </div>
  );
}

function Frame6() {
  return (
    <div className="content-stretch flex gap-[6px] items-center relative shrink-0">
      <Trash1 />
      <Frame2 />
    </div>
  );
}

function Frame10() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <Frame9 />
      <Frame6 />
    </div>
  );
}

function ImageHotel() {
  return (
    <div className="h-[49px] relative shrink-0 w-[72px]" data-name="Image (Hotel)">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImageHotel} />
    </div>
  );
}

function Container13() {
  return (
    <div className="content-stretch flex flex-col h-[49px] items-start overflow-clip relative rounded-[10px] shrink-0 w-[72px]" data-name="Container">
      <ImageHotel />
    </div>
  );
}

function Paragraph6() {
  return (
    <div className="content-stretch flex h-[16.001px] items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="css-4hzbpn flex-[1_0_0] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] min-h-px min-w-px not-italic relative text-[#101828] text-[13px]">New York Marriott Downtown</p>
    </div>
  );
}

function Icon4() {
  return (
    <div className="relative shrink-0 size-[13px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13 13">
        <g id="Icon">
          <path d={svgPaths.pdf5e000} id="Vector" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.833333" />
          <path d={svgPaths.p14ca4800} id="Vector_2" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.833333" />
        </g>
      </svg>
    </div>
  );
}

function Paragraph7() {
  return (
    <div className="h-[13px] relative shrink-0 w-[173px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[13px] left-0 not-italic text-[#6a7282] text-[11px] top-[0.46px]">85 West Street of Albany Street</p>
      </div>
    </div>
  );
}

function Container15() {
  return (
    <div className="content-stretch flex gap-[3.999px] h-[12.997px] items-center relative shrink-0 w-full" data-name="Container">
      <Icon4 />
      <Paragraph7 />
    </div>
  );
}

function Text3() {
  return (
    <div className="h-[16px] relative shrink-0 w-[109px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[16.5px] left-0 not-italic text-[#6a7282] text-[11px] top-[0.01px] w-[112px]">1x Deluxe King Room</p>
      </div>
    </div>
  );
}

function Icon5() {
  return (
    <div className="relative shrink-0 size-[11.996px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.9957 11.9957">
        <g clipPath="url(#clip0_3133_773)" id="Icon">
          <path d="M5.99805 9.99609H6.00305" id="Vector" stroke="var(--stroke-0, #18A0A6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.999645" />
          <path d={svgPaths.p24e33b00} id="Vector_2" stroke="var(--stroke-0, #18A0A6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.999645" />
          <path d={svgPaths.p1c443040} id="Vector_3" stroke="var(--stroke-0, #18A0A6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.999645" />
          <path d={svgPaths.p2ca9ce00} id="Vector_4" stroke="var(--stroke-0, #18A0A6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.999645" />
        </g>
        <defs>
          <clipPath id="clip0_3133_773">
            <rect fill="white" height="11.9957" width="11.9957" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container16() {
  return (
    <div className="content-stretch flex gap-[7.997px] h-[16.499px] items-center relative shrink-0 w-full" data-name="Container">
      <Text3 />
      <Icon5 />
    </div>
  );
}

function Frame21() {
  return (
    <div className="content-stretch flex flex-col gap-[2px] items-start relative shrink-0 w-full">
      <Container15 />
      <Container16 />
    </div>
  );
}

function Container14() {
  return (
    <div className="content-stretch flex flex-col gap-[1.996px] h-[50px] items-start relative shrink-0 w-[426px]" data-name="Container">
      <Paragraph6 />
      <Frame21 />
    </div>
  );
}

function Frame25() {
  return (
    <div className="content-stretch flex gap-[12px] items-start relative shrink-0 w-full">
      <Container13 />
      <Container14 />
    </div>
  );
}

function Text4() {
  return (
    <div className="h-[15px] relative shrink-0 w-[56px]" data-name="Text">
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[15px] left-0 not-italic text-[#6a7282] text-[11px] top-[0.36px]">Check-in</p>
    </div>
  );
}

function Text5() {
  return (
    <div className="h-[15px] relative shrink-0 w-[121px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[15px] left-0 not-italic text-[#6a7282] text-[11px] top-0 w-[112px]">Tue, Mar 3, 4:00PM</p>
      </div>
    </div>
  );
}

function Container17() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-[112px]" data-name="Container">
      <Text5 />
    </div>
  );
}

function Frame22() {
  return (
    <div className="content-stretch flex gap-[5px] items-center relative shrink-0 w-full">
      <Text4 />
      <Container17 />
    </div>
  );
}

function Text6() {
  return (
    <div className="h-[15px] relative shrink-0 w-[49.347px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[15px] left-0 not-italic text-[#6a7282] text-[11px] top-0 w-[109px]">Tue, Mar 5, 11:00AM</p>
      </div>
    </div>
  );
}

function Container18() {
  return (
    <div className="content-stretch flex h-[15px] items-center relative shrink-0 w-[109px]" data-name="Container">
      <Text6 />
    </div>
  );
}

function Frame23() {
  return (
    <div className="content-stretch flex gap-[5px] items-center relative shrink-0 w-full">
      <p className="css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[15px] not-italic relative shrink-0 text-[#6a7282] text-[11px] w-[56px]">Check-out</p>
      <Container18 />
    </div>
  );
}

function Frame24() {
  return (
    <div className="content-stretch flex flex-col gap-[2px] items-start relative shrink-0 w-[368px]">
      <Frame22 />
      <Frame23 />
    </div>
  );
}

function Frame26() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full">
      <Frame25 />
      <Frame24 />
    </div>
  );
}

function Icon6() {
  return (
    <div className="relative shrink-0 size-[13px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13 13">
        <g id="Icon">
          <path d="M4.33398 1.08398V3.25065" id="Vector" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.999645" />
          <path d="M8.66602 1.08398V3.25065" id="Vector_2" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.999645" />
          <path d={svgPaths.p1b069600} id="Vector_3" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.999645" />
          <path d="M1.625 5.41602H11.375" id="Vector_4" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.999645" />
        </g>
      </svg>
    </div>
  );
}

function Paragraph8() {
  return (
    <div className="h-[12.003px] relative shrink-0 w-[289.943px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[12px] left-0 not-italic text-[#6a7282] text-[11px] top-[0.46px]">{`Free cancellation before Feb 28, 2026 at 11:59 PM (stay's local time)`}</p>
      </div>
    </div>
  );
}

function Container20() {
  return (
    <div className="content-stretch flex gap-[5.994px] h-[13.991px] items-start relative shrink-0 w-full" data-name="Container">
      <Icon6 />
      <Paragraph8 />
    </div>
  );
}

function Container19() {
  return (
    <div className="content-stretch flex flex-col h-[22.898px] items-start pt-[10px] relative shrink-0 w-[486.69px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[rgba(179,173,196,0.28)] border-solid border-t-[0.909px] inset-0 pointer-events-none" />
      <Container20 />
    </div>
  );
}

function Frame27() {
  return (
    <div className="bg-[#f7f6f8] content-stretch flex flex-col h-[166.898px] items-start justify-between p-[20px] relative rounded-[10px] shrink-0 w-[535px]">
      <div aria-hidden="true" className="absolute border-[0.91px] border-[rgba(179,173,196,0.28)] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <Frame26 />
      <Container19 />
    </div>
  );
}

function Frame41() {
  return (
    <div className="content-stretch flex gap-[23px] items-start relative shrink-0 w-[563px]">
      <div className="flex h-[183px] items-center justify-center relative shrink-0 w-0" style={{ "--transform-inner-width": "0", "--transform-inner-height": "170.65625" } as React.CSSProperties}>
        <div className="flex-none rotate-[90deg]">
          <div className="h-0 relative w-[183px]">
            <div className="absolute inset-[-1px_0_0_0]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 183 1">
                <line id="Line 4" stroke="var(--stroke-0, #C3C3C3)" x2="183" y1="0.5" y2="0.5" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <Frame27 />
    </div>
  );
}

function Frame42() {
  return (
    <div className="content-stretch flex flex-col gap-[15px] items-end relative shrink-0 w-full">
      <Frame10 />
      <Frame41 />
    </div>
  );
}

function Frame47() {
  return (
    <div className="content-stretch flex flex-col gap-[11px] items-start relative shrink-0 w-full">
      <Frame46 />
      <Frame42 />
    </div>
  );
}

function Icon7() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p2905de80} id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d={svgPaths.p2a7f1980} id="Vector_2" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d="M7.5 14.168H12.5" id="Vector_3" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d={svgPaths.p3849af00} id="Vector_4" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Frame11() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0">
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[24px] not-italic relative shrink-0 text-[#1f2933] text-[16px] tracking-[-0.3125px]">Ground Transport</p>
    </div>
  );
}

function Frame12() {
  return (
    <div className="content-stretch flex gap-[11px] items-start relative shrink-0 w-[166px]">
      <Icon7 />
      <Frame11 />
    </div>
  );
}

function Frame28() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[212px]">
      <Frame12 />
    </div>
  );
}

function Frame29() {
  return (
    <div className="content-stretch flex flex-col gap-[9px] items-start relative shrink-0 w-full">
      <Frame28 />
      <p className="css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[20px] min-w-full not-italic relative shrink-0 text-[#364153] text-[14px] tracking-[-0.1504px] w-[min-content]">3 Uber Vouchers Provided $40</p>
    </div>
  );
}

function Frame44() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-[339px]">
      <Frame29 />
      <div className="absolute flex h-[17px] items-center justify-center left-[10px] top-[65px] w-0" style={{ "--transform-inner-width": "0", "--transform-inner-height": "170.65625" } as React.CSSProperties}>
        <div className="flex-none rotate-[90deg]">
          <div className="h-0 relative w-[17px]">
            <div className="absolute inset-[-1px_0_0_0]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17 1">
                <line id="Line 8" stroke="var(--stroke-0, #C3C3C3)" x2="17" y1="0.5" y2="0.5" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Icon8() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g clipPath="url(#clip0_3133_800)" id="Icon">
          <path d={svgPaths.p2840da80} id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d={svgPaths.p18a1600} id="Vector_2" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d="M1.75 18.168L7.08333 12.918" id="Vector_3" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d="M15.8333 4.16797L10 10.0013" id="Vector_4" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
        <defs>
          <clipPath id="clip0_3133_800">
            <rect fill="white" height="20" width="20" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Heading2() {
  return (
    <div className="h-[23.999px] relative shrink-0 w-[38.651px]" data-name="Heading 4">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[24px] left-0 not-italic text-[#1f2933] text-[16px] top-[-0.73px] tracking-[-0.3125px]">Food</p>
      </div>
    </div>
  );
}

function Container21() {
  return (
    <div className="content-stretch flex gap-[7.997px] h-[24px] items-center relative shrink-0 w-full" data-name="Container">
      <Icon8 />
      <Heading2 />
    </div>
  );
}

function Frame30() {
  return (
    <div className="content-stretch flex flex-col gap-[6px] items-start relative shrink-0 w-full">
      <Container21 />
      <p className="css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[#364153] text-[14px] tracking-[-0.1504px] w-full">Reimbursed Provided for under $40 per meal</p>
    </div>
  );
}

function Frame45() {
  return (
    <div className="content-stretch flex flex-col gap-[5px] items-start relative shrink-0 w-full">
      <Frame30 />
      <div className="absolute flex h-[17px] items-center justify-center left-[10px] top-[55px] w-0" style={{ "--transform-inner-width": "0", "--transform-inner-height": "170.65625" } as React.CSSProperties}>
        <div className="flex-none rotate-[90deg]">
          <div className="h-0 relative w-[17px]">
            <div className="absolute inset-[-1px_0_0_0]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17 1">
                <line id="Line 7" stroke="var(--stroke-0, #C3C3C3)" x2="17" y1="0.5" y2="0.5" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame48() {
  return (
    <div className="content-stretch flex flex-col gap-[38px] items-start relative shrink-0 w-full">
      <Frame44 />
      <Frame45 />
    </div>
  );
}

function Frame49() {
  return (
    <div className="content-stretch flex flex-col gap-[15px] items-start relative shrink-0 w-full">
      <Frame47 />
      <Frame48 />
    </div>
  );
}

function Icon9() {
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

function Frame31() {
  return (
    <div className="content-stretch flex gap-[11px] items-center relative shrink-0">
      <Icon9 />
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[24px] not-italic relative shrink-0 text-[#1f2933] text-[16px] tracking-[-0.3125px]">Flight to New York</p>
    </div>
  );
}

function Trash2() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Trash">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Trash">
          <path d={svgPaths.p1c0c5900} fill="var(--fill-0, black)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex h-[24px] items-center justify-center p-[10px] relative rounded-[6px] shrink-0 w-[59px]">
      <div aria-hidden="true" className="absolute border border-[#c4c4c4] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[14px] text-black text-center tracking-[-0.1504px]">Edit</p>
    </div>
  );
}

function Frame5() {
  return (
    <div className="content-stretch flex gap-[6px] items-center relative shrink-0">
      <Trash2 />
      <Frame3 />
    </div>
  );
}

function Frame13() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <Frame31 />
      <Frame5 />
    </div>
  );
}

function ImageAirline1() {
  return (
    <div className="relative shrink-0 size-[23.999px]" data-name="Image (Airline)">
      <img alt="" className="absolute bg-clip-padding border-0 border-[transparent] border-solid inset-0 max-w-none object-contain pointer-events-none size-full" src={imgImageAirline} />
    </div>
  );
}

function Container23() {
  return (
    <div className="bg-white content-stretch flex items-center justify-center pl-[0.909px] pr-[0.916px] py-[0.909px] relative rounded-[10px] shrink-0 size-[40px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#e5e7eb] border-[0.909px] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <ImageAirline1 />
    </div>
  );
}

function Paragraph9() {
  return (
    <div className="h-[17.997px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-0 not-italic text-[#101828] text-[14px] top-[0.46px]">9:59 PM</p>
    </div>
  );
}

function Paragraph10() {
  return (
    <div className="content-stretch flex h-[13.999px] items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="css-4hzbpn flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal leading-[14px] min-h-px min-w-px not-italic relative text-[#6a7282] text-[11px]">PIT</p>
    </div>
  );
}

function Container26() {
  return (
    <div className="h-[31.996px] relative shrink-0 w-[56.57px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Paragraph9 />
        <Paragraph10 />
      </div>
    </div>
  );
}

function Container28() {
  return <div className="bg-[#e5e7eb] flex-[1_0_0] h-[0.994px] min-h-px min-w-px" data-name="Container" />;
}

function Text7() {
  return (
    <div className="h-[15px] relative shrink-0 w-[34.56px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[15px] left-0 not-italic text-[#6a7282] text-[10px] top-[0.36px]">1h 45m</p>
      </div>
    </div>
  );
}

function Container29() {
  return <div className="bg-[#e5e7eb] flex-[1_0_0] h-[0.994px] min-h-px min-w-px" data-name="Container" />;
}

function Container27() {
  return (
    <div className="flex-[1_0_0] h-[15px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[7.997px] items-center relative size-full">
        <Container28 />
        <Text7 />
        <Container29 />
      </div>
    </div>
  );
}

function Paragraph11() {
  return (
    <div className="h-[17.997px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-[56px] not-italic text-[#101828] text-[14px] text-right top-[0.46px] translate-x-[-100%]">11:30 PM</p>
    </div>
  );
}

function Paragraph12() {
  return (
    <div className="content-stretch flex h-[13.999px] items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="css-4hzbpn flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal leading-[14px] min-h-px min-w-px not-italic relative text-[#6a7282] text-[11px] text-right">EWR</p>
    </div>
  );
}

function Container30() {
  return (
    <div className="h-[31.996px] relative shrink-0 w-[55.028px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Paragraph11 />
        <Paragraph12 />
      </div>
    </div>
  );
}

function Container25() {
  return (
    <div className="content-stretch flex gap-[11.996px] h-[31.996px] items-center relative shrink-0 w-full" data-name="Container">
      <Container26 />
      <Container27 />
      <Container30 />
    </div>
  );
}

function Paragraph13() {
  return (
    <div className="h-[16.001px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-0 not-italic text-[#6a7282] text-[12px] top-[0.46px] w-[194px]">Delta Airlines · DL 3891 · Economy</p>
    </div>
  );
}

function Frame35() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full">
      <Container25 />
      <Paragraph13 />
    </div>
  );
}

function Container24() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col h-[40px] items-start min-h-px min-w-px relative" data-name="Container">
      <Frame35 />
    </div>
  );
}

function Frame34() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center relative w-full">
        <Container23 />
        <Container24 />
      </div>
    </div>
  );
}

function Container22() {
  return (
    <div className="content-stretch flex h-[52px] items-start relative shrink-0 w-[302px]" data-name="Container">
      <Frame34 />
    </div>
  );
}

function Icon10() {
  return (
    <div className="relative shrink-0 size-[11.996px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.9957 11.9957">
        <g id="Icon">
          <path d={svgPaths.pe90300} id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeWidth="0.89968" />
          <path d={svgPaths.p2a17c420} id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeWidth="0.89968" />
        </g>
      </svg>
    </div>
  );
}

function Frame54() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0 w-full">
      <Icon10 />
      <p className="css-4hzbpn font-['Inter:Regular',sans-serif] font-normal h-[15px] leading-[13px] not-italic relative shrink-0 text-[#6a7282] text-[11px] w-[95px]">x1 Checked bag</p>
    </div>
  );
}

function Icon11() {
  return (
    <div className="relative shrink-0 size-[11.996px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.9957 11.9957">
        <g id="Icon">
          <path d={svgPaths.pe90300} id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeWidth="0.89968" />
          <path d={svgPaths.p2a17c420} id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeWidth="0.89968" />
        </g>
      </svg>
    </div>
  );
}

function Frame55() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0 w-full">
      <Icon11 />
      <p className="css-4hzbpn font-['Inter:Regular',sans-serif] font-normal h-[15px] leading-[13px] not-italic relative shrink-0 text-[#6a7282] text-[11px] w-[78px]">Carry-on bag</p>
    </div>
  );
}

function Frame36() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[99px]">
      <Frame54 />
      <Frame55 />
    </div>
  );
}

function Frame33() {
  return (
    <div className="bg-[#f7f6f8] content-stretch flex h-[93px] items-start justify-between p-[20px] relative rounded-[10px] shrink-0 w-[542px]">
      <div aria-hidden="true" className="absolute border-[0.91px] border-[rgba(179,173,196,0.28)] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <Container22 />
      <Frame36 />
    </div>
  );
}

function Frame32() {
  return (
    <div className="content-stretch flex flex-col gap-[11px] items-end relative shrink-0 w-full">
      <Frame13 />
      <Frame33 />
    </div>
  );
}

function Frame43() {
  return (
    <div className="content-stretch flex flex-col gap-[14px] items-start relative shrink-0 w-full">
      <p className="css-4hzbpn font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] not-italic relative shrink-0 text-[#1f2933] text-[16px] tracking-[-0.3125px] w-full">Thursday, Mar 5</p>
      <Frame32 />
    </div>
  );
}

function Frame50() {
  return (
    <div className="content-stretch flex flex-col gap-[30px] items-start relative shrink-0 w-full">
      <Frame49 />
      <Frame43 />
    </div>
  );
}

function Frame52() {
  return (
    <div className="content-stretch flex flex-col gap-[21px] items-start relative shrink-0 w-full">
      <Frame51 />
      <Frame50 />
    </div>
  );
}

function Icon12() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.p2c6800c0} id="Vector" stroke="var(--stroke-0, #1F9D55)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.999871" />
        </g>
      </svg>
    </div>
  );
}

function Text8() {
  return (
    <div className="h-[15.991px] relative shrink-0 w-[121.997px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-0 not-italic text-[#4a5565] text-[14px] top-[0.67px]">Accessibility satisfied</p>
      </div>
    </div>
  );
}

function Container32() {
  return (
    <div className="content-stretch flex gap-[7.995px] h-[15.991px] items-center relative shrink-0 w-full" data-name="Container">
      <Icon12 />
      <Text8 />
    </div>
  );
}

function Icon13() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.p2c6800c0} id="Vector" stroke="var(--stroke-0, #1F9D55)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.999871" />
        </g>
      </svg>
    </div>
  );
}

function Text9() {
  return (
    <div className="h-[15.991px] relative shrink-0 w-[69.779px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-0 not-italic text-[#4a5565] text-[14px] top-[0.67px]">No red-eyes</p>
      </div>
    </div>
  );
}

function Container33() {
  return (
    <div className="content-stretch flex gap-[7.995px] h-[15.991px] items-center relative shrink-0 w-full" data-name="Container">
      <Icon13 />
      <Text9 />
    </div>
  );
}

function Icon14() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.p2c6800c0} id="Vector" stroke="var(--stroke-0, #1F9D55)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.999871" />
        </g>
      </svg>
    </div>
  );
}

function Text10() {
  return (
    <div className="h-[15.991px] relative shrink-0 w-[129.95px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-[0.01px] not-italic text-[#4a5565] text-[14px] top-[0.03px]">Room sharing available</p>
      </div>
    </div>
  );
}

function Container34() {
  return (
    <div className="content-stretch flex gap-[7.995px] h-[15.991px] items-center relative shrink-0 w-full" data-name="Container">
      <Icon14 />
      <Text10 />
    </div>
  );
}

function Container31() {
  return (
    <div className="content-stretch flex flex-col gap-[7.995px] h-[64px] items-start relative shrink-0 w-[383px]" data-name="Container">
      <Container32 />
      <Container33 />
      <Container34 />
    </div>
  );
}

function Frame56() {
  return (
    <div className="content-stretch flex flex-col gap-[19px] items-start relative shrink-0 w-full">
      <div className="h-0 relative shrink-0 w-full">
        <div className="absolute inset-[-1px_0_0_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 577 1">
            <line id="Line 2" stroke="var(--stroke-0, #E6E6E6)" x2="577" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <Container31 />
    </div>
  );
}

function Frame53() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[20px] items-center px-[24px] py-[30px] relative rounded-[14px] shrink-0 w-[625px]">
      <Frame52 />
      <Frame56 />
    </div>
  );
}

function Button() {
  return (
    <div className="bg-[#916af5] h-[45px] relative rounded-[12px] shrink-0 w-full" data-name="Button">
      <p className="absolute css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] left-[312px] not-italic text-[18px] text-center text-white top-[13px] tracking-[-0.1504px] translate-x-[-50%]">{`Confirm & Complete Booking`}</p>
    </div>
  );
}

function Frame57() {
  return (
    <div className="content-stretch flex flex-col gap-[9px] items-end relative shrink-0 w-full">
      <Button />
      <p className="css-4hzbpn font-['Inter:Italic',sans-serif] font-normal h-[36px] italic leading-[26.67px] relative shrink-0 text-[14px] text-black text-center tracking-[-0.2005px] w-full">Don’t worry! All reservations can be cancelled within 24 hours.</p>
    </div>
  );
}

function Frame37() {
  return (
    <div className="content-stretch flex flex-col gap-[17px] items-start relative rounded-[14px] shrink-0 w-[625px]">
      <div aria-hidden="true" className="absolute border border-[#e5e7eb] border-solid inset-[-1px] pointer-events-none rounded-[15px]" />
      <Frame53 />
      <Frame57 />
    </div>
  );
}

function Heading() {
  return (
    <div className="h-[23.997px] relative shrink-0 w-[347.185px]" data-name="Heading 2">
      <p className="absolute css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] left-0 not-italic text-[#1f2933] text-[16px] top-[-0.98px] tracking-[-0.3125px]">{`Budget & Spend`}</p>
    </div>
  );
}

function Text11() {
  return (
    <div className="absolute h-[36px] left-[0.01px] top-[0.1px] w-[107px]" data-name="Text">
      <p className="absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[36px] left-0 not-italic text-[#0a0a0a] text-[30px] top-0 tracking-[0.3955px] w-[107px]">$2,350</p>
    </div>
  );
}

function Text12() {
  return (
    <div className="absolute h-[19.993px] left-[106.74px] top-[14.09px] w-[63.182px]" data-name="Text">
      <p className="absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#4a5565] text-[14px] top-[0.36px] tracking-[-0.1504px] w-[64px]">of $2,500</p>
    </div>
  );
}

function Container36() {
  return (
    <div className="h-[35.994px] relative shrink-0 w-full" data-name="Container">
      <Text11 />
      <Text12 />
    </div>
  );
}

function Container37() {
  return <div className="h-[10px] shrink-0 w-full" data-name="Container" style={{ backgroundImage: "linear-gradient(rgb(82, 201, 63) 0%, rgb(24, 160, 166) 100%), linear-gradient(90deg, rgb(3, 2, 19) 0%, rgb(3, 2, 19) 100%)" }} />;
}

function PrimitiveDiv() {
  return (
    <div className="bg-[rgba(3,2,19,0.2)] content-stretch flex flex-col h-[10px] items-start overflow-clip pl-[-16.495px] pr-[16.495px] relative rounded-[15252000px] shrink-0 w-full" data-name="Primitive.div">
      <Container37 />
    </div>
  );
}

function Text13() {
  return (
    <div className="h-[16.001px] relative shrink-0 w-[57.358px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-0 not-italic text-[#4a5565] text-[12px] top-[0.46px] w-[58px]">94% used</p>
      </div>
    </div>
  );
}

function Badge1() {
  return (
    <div className="bg-[#d1f4e0] h-[23.999px] relative rounded-[15252000px] shrink-0 w-[72.436px]" data-name="Badge">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center overflow-clip px-[12px] py-[4px] relative rounded-[inherit] size-full">
        <p className="css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#52c93f] text-[12px]">In policy</p>
      </div>
    </div>
  );
}

function Container38() {
  return (
    <div className="h-[23.999px] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between relative size-full">
          <Text13 />
          <Badge1 />
        </div>
      </div>
    </div>
  );
}

function TripOverview() {
  return (
    <div className="content-stretch flex flex-col gap-[7.997px] h-[89.986px] items-start relative shrink-0 w-[347.185px]" data-name="TripOverview">
      <Container36 />
      <PrimitiveDiv />
      <Container38 />
    </div>
  );
}

function Text14() {
  return (
    <div className="h-[19.994px] relative shrink-0 w-[43.001px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#4a5565] text-[14px] top-[0.35px] tracking-[-0.1504px]">Flights</p>
      </div>
    </div>
  );
}

function Text15() {
  return (
    <div className="h-[19.994px] relative shrink-0 w-[46.372px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#1f2933] text-[14px] top-[0.35px] tracking-[-0.1504px]">$3,600</p>
      </div>
    </div>
  );
}

function Container40() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-start justify-between left-0 top-[-0.02px] w-[344px]" data-name="Container">
      <Text14 />
      <Text15 />
    </div>
  );
}

function Text16() {
  return (
    <div className="h-[19.994px] relative shrink-0 w-[41.6px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#4a5565] text-[14px] top-[0.35px] tracking-[-0.1504px]">Hotels (2 nights)</p>
      </div>
    </div>
  );
}

function Text17() {
  return (
    <div className="h-[19.994px] relative shrink-0 w-[45.234px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-[46px] not-italic text-[#1f2933] text-[14px] text-right top-[0.35px] tracking-[-0.1504px] translate-x-[-100%]">$800</p>
      </div>
    </div>
  );
}

function Container41() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-start justify-between left-0 top-[27.98px] w-[344px]" data-name="Container">
      <Text16 />
      <Text17 />
    </div>
  );
}

function Text18() {
  return (
    <div className="h-[19.994px] relative shrink-0 w-[47.878px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#4a5565] text-[14px] top-[0.35px] tracking-[-0.1504px]">Ground Transportation</p>
      </div>
    </div>
  );
}

function Text19() {
  return (
    <div className="h-[19.994px] relative shrink-0 w-[34.794px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-[34.89px] not-italic text-[#1f2933] text-[14px] text-right top-[0.35px] tracking-[-0.1504px] translate-x-[-100%]">$120</p>
      </div>
    </div>
  );
}

function Container42() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-start justify-between left-0 top-[55.98px] w-[344px]" data-name="Container">
      <Text18 />
      <Text19 />
    </div>
  );
}

function Text20() {
  return (
    <div className="h-[19.994px] relative shrink-0 w-[70.474px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#4a5565] text-[14px] top-[0.35px] tracking-[-0.1504px]">Food (est.)</p>
      </div>
    </div>
  );
}

function Text21() {
  return (
    <div className="h-[19.994px] relative shrink-0 w-[44.454px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-[9.55px] not-italic text-[#1f2933] text-[14px] top-[0.35px] tracking-[-0.1504px]">$300</p>
      </div>
    </div>
  );
}

function Container43() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-start justify-between left-0 top-[83.98px] w-[344px]" data-name="Container">
      <Text20 />
      <Text21 />
    </div>
  );
}

function Container39() {
  return (
    <div className="h-[103.962px] relative shrink-0 w-[347.185px]" data-name="Container">
      <Container40 />
      <Container41 />
      <Container42 />
      <Container43 />
    </div>
  );
}

function Container35() {
  return (
    <div className="bg-[rgba(255,255,255,0.6)] h-[323px] relative rounded-[14px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#e5e7eb] border-[0.909px] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <div className="content-stretch flex flex-col gap-[15.994px] items-start pb-[0.909px] pt-[24.908px] px-[24.908px] relative size-full">
        <Heading />
        <TripOverview />
        <Container39 />
      </div>
    </div>
  );
}

function Heading3() {
  return (
    <div className="h-[23.997px] relative shrink-0 w-full" data-name="Heading 2">
      <p className="absolute css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] left-0 not-italic text-[#1f2933] text-[16px] top-[-0.98px] tracking-[-0.3125px]">Payment method</p>
    </div>
  );
}

function Icon15() {
  return (
    <div className="relative shrink-0 size-[19.994px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.9939 19.9939">
        <g clipPath="url(#clip0_3133_736)" id="Icon">
          <path d={svgPaths.p282b580} id="Vector" stroke="var(--stroke-0, #1246A5)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66616" />
          <path d="M1.66602 8.33008H18.3276" id="Vector_2" stroke="var(--stroke-0, #1246A5)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66616" />
        </g>
        <defs>
          <clipPath id="clip0_3133_736">
            <rect fill="white" height="19.9939" width="19.9939" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container47() {
  return (
    <div className="bg-[rgba(18,70,165,0.1)] relative rounded-[10px] shrink-0 size-[39.998px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center pr-[0.011px] relative size-full">
        <Icon15 />
      </div>
    </div>
  );
}

function Container49() {
  return (
    <div className="absolute h-[19.994px] left-0 top-0 w-[97.715px]" data-name="Container">
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#1f2933] text-[14px] top-[0.35px] tracking-[-0.1504px]">Corporate card</p>
    </div>
  );
}

function Container50() {
  return (
    <div className="absolute h-[15.991px] left-0 top-[19.99px] w-[97.715px]" data-name="Container">
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-0 not-italic text-[#6a7282] text-[12px] top-[0.67px]">Visa •••• 4242</p>
    </div>
  );
}

function Container48() {
  return (
    <div className="h-[35.985px] relative shrink-0 w-[97.715px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Container49 />
        <Container50 />
      </div>
    </div>
  );
}

function Container46() {
  return (
    <div className="h-[39.998px] relative shrink-0 w-[149.712px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[11.998px] items-center relative size-full">
        <Container47 />
        <Container48 />
      </div>
    </div>
  );
}

function Button1() {
  return (
    <div className="bg-[#f5f7fa] h-[31.992px] relative rounded-[8px] shrink-0 w-[76.131px]" data-name="Button">
      <div aria-hidden="true" className="absolute border-[0.674px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center px-[12.674px] py-[0.674px] relative size-full">
        <p className="css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[#1f2933] text-[14px] text-center tracking-[-0.1504px]">Change</p>
      </div>
    </div>
  );
}

function Container45() {
  return (
    <div className="h-[73.329px] relative rounded-[10px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#e5e7eb] border-[0.674px] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[16.665px] py-[0.674px] relative size-full">
          <Container46 />
          <Button1 />
        </div>
      </div>
    </div>
  );
}

function PrimitiveLabel() {
  return (
    <div className="flex-[1_0_0] h-[39.988px] min-h-px min-w-px relative" data-name="Primitive.label">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center relative size-full">
        <p className="css-4hzbpn font-['Inter:Medium',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[#1f2933] text-[14px] tracking-[-0.1504px] w-[284px]">Auto-fill purchase card forms and draft expense reports</p>
      </div>
    </div>
  );
}

function PrimitiveSpan() {
  return <div className="bg-white rounded-[22622000px] shrink-0 size-[15.991px]" data-name="Primitive.span" />;
}

function PrimitiveButton() {
  return (
    <div className="bg-[#030213] h-[18.393px] relative rounded-[22622000px] shrink-0 w-[31.992px]" data-name="Primitive.button">
      <div aria-hidden="true" className="absolute border-[0.674px] border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[22622000px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center pl-[14.665px] pr-[0.674px] py-[0.674px] relative size-full">
        <PrimitiveSpan />
      </div>
    </div>
  );
}

function Container51() {
  return (
    <div className="bg-[rgba(24,160,166,0.05)] h-[73.318px] relative rounded-[10px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[0.674px] border-[rgba(24,160,166,0.2)] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[16.665px] py-[0.674px] relative size-full">
          <PrimitiveLabel />
          <PrimitiveButton />
        </div>
      </div>
    </div>
  );
}

function Container44() {
  return (
    <div className="bg-white h-[252px] relative rounded-[14px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#e5e7eb] border-[0.674px] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <div className="content-stretch flex flex-col gap-[15.991px] items-start pb-[0.674px] pt-[24.671px] px-[24.671px] relative size-full">
        <Heading3 />
        <Container45 />
        <Container51 />
      </div>
    </div>
  );
}

function Icon16() {
  return (
    <div className="relative shrink-0 size-[15.994px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.9943 15.9943">
        <g id="Icon">
          <path d={svgPaths.p1dc87103} id="Vector" stroke="var(--stroke-0, #1F2933)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33286" />
        </g>
      </svg>
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex gap-[5px] items-center relative shrink-0">
      <p className="css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[#1f2933] text-[14px] tracking-[-0.1504px] w-[123px]">View Policy Details</p>
      <Icon16 />
    </div>
  );
}

function Container52() {
  return (
    <div className="bg-[rgba(31,157,85,0.1)] h-[56px] relative rounded-[14px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[0.674px] border-[rgba(31,157,85,0.2)] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pb-[0.674px] pt-[0.67px] px-[16.665px] relative size-full">
          <Frame />
        </div>
      </div>
    </div>
  );
}

function Frame58() {
  return (
    <div className="content-stretch flex flex-col gap-[18px] items-start relative shrink-0 w-[397px]">
      <Container35 />
      <Container44 />
      <Container52 />
    </div>
  );
}

export default function Frame38() {
  return (
    <div className="bg-white content-stretch flex gap-[18px] items-start p-[24px] relative rounded-[24px] size-full">
      <div aria-hidden="true" className="absolute border-[1.8px] border-[rgba(138,116,195,0.32)] border-solid inset-0 pointer-events-none rounded-[24px] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.17)]" />
      <Frame37 />
      <Frame58 />
    </div>
  );
}