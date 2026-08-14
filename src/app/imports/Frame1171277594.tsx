import svgPaths from "./svg-c7iisg0ug2";
import imgImageAirline from "figma:asset/50ba81ee3baed0d032549253a352c5d27d54adb9.png";
import imgImageHotel from "figma:asset/3a7194d0c070824d982b80f6a329057d5ed3025a.png";

function Heading() {
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

function Container() {
  return (
    <div className="h-[47.99px] relative shrink-0 w-[244.638px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[11px] relative size-full">
        <Heading />
        <Paragraph />
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="h-[60px] relative shrink-0 w-[297px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center relative size-full">
        <Container />
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

function Container2() {
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

function Frame13() {
  return (
    <div className="content-stretch flex flex-col gap-[2px] items-start relative shrink-0 w-full">
      <Container2 />
      <Container3 />
    </div>
  );
}

function Frame50() {
  return (
    <div className="content-stretch flex flex-col gap-[14px] items-end relative shrink-0 w-full">
      <Frame13 />
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

function Frame6() {
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

function Frame() {
  return (
    <div className="content-stretch flex h-[24px] items-center justify-center p-[10px] relative rounded-[6px] shrink-0 w-[59px]">
      <div aria-hidden="true" className="absolute border border-[#c4c4c4] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[14px] text-black text-center tracking-[-0.1504px]">Edit</p>
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex gap-[6px] items-center relative shrink-0">
      <Trash />
      <Frame />
    </div>
  );
}

function Frame7() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <Frame6 />
      <Frame3 />
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

function Container4() {
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

function Container5() {
  return (
    <div className="h-[31.996px] relative shrink-0 w-[56.57px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Paragraph1 />
        <Paragraph2 />
      </div>
    </div>
  );
}

function Container6() {
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

function Container7() {
  return (
    <div className="flex-[1_0_0] h-[15px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[7.997px] items-center relative size-full">
        <Container6 />
        <Text2 />
        <Container6 />
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

function Container8() {
  return (
    <div className="h-[31.996px] relative shrink-0 w-[55.028px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Paragraph3 />
        <Paragraph4 />
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div className="content-stretch flex gap-[11.996px] h-[31.996px] items-center relative shrink-0 w-full" data-name="Container">
      <Container5 />
      <Container7 />
      <Container8 />
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

function Frame16() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full">
      <Container9 />
      <Paragraph5 />
    </div>
  );
}

function Container10() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col h-[40px] items-start min-h-px min-w-px relative" data-name="Container">
      <Frame16 />
    </div>
  );
}

function Frame17() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center relative w-full">
        <Container4 />
        <Container10 />
      </div>
    </div>
  );
}

function Container11() {
  return (
    <div className="content-stretch flex h-[52px] items-start relative shrink-0 w-[302px]" data-name="Container">
      <Frame17 />
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

function Frame15() {
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

function Frame14() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0 w-full">
      <Icon2 />
      <p className="css-4hzbpn font-['Inter:Regular',sans-serif] font-normal h-[15px] leading-[13px] not-italic relative shrink-0 text-[#6a7282] text-[11px] w-[78px]">Carry-on bag</p>
    </div>
  );
}

function Frame18() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[99px]">
      <Frame15 />
      <Frame14 />
    </div>
  );
}

function Frame19() {
  return (
    <div className="bg-[#f7f6f8] content-stretch flex h-[93px] items-start justify-between p-[20px] relative rounded-[10px] shrink-0 w-[542px]">
      <div aria-hidden="true" className="absolute border-[0.91px] border-[rgba(179,173,196,0.28)] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <Container11 />
      <Frame18 />
    </div>
  );
}

function Frame38() {
  return (
    <div className="content-stretch flex gap-[23px] items-start relative shrink-0">
      <div className="flex h-[112px] items-center justify-center relative shrink-0 w-0" style={{ "--transform-inner-width": "0", "--transform-inner-height": "130.453125" } as React.CSSProperties}>
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
      <Frame19 />
    </div>
  );
}

function Frame39() {
  return (
    <div className="content-stretch flex flex-col gap-[11px] items-end relative shrink-0 w-full">
      <Frame7 />
      <Frame38 />
    </div>
  );
}

function Frame45() {
  return (
    <div className="content-stretch flex flex-col gap-[14px] items-start relative shrink-0 w-full">
      <p className="css-4hzbpn font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] not-italic relative shrink-0 text-[#1f2933] text-[16px] tracking-[-0.3125px] w-full">Tuesday, Mar 3</p>
      <Frame39 />
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

function Frame8() {
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

function Frame1() {
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
      <Trash1 />
      <Frame1 />
    </div>
  );
}

function Frame9() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <Frame8 />
      <Frame5 />
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

function Container12() {
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

function Container13() {
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
        <g clipPath="url(#clip0_3158_1693)" id="Icon">
          <path d="M5.99805 9.99609H6.00305" id="Vector" stroke="var(--stroke-0, #18A0A6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.999645" />
          <path d={svgPaths.p24e33b00} id="Vector_2" stroke="var(--stroke-0, #18A0A6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.999645" />
          <path d={svgPaths.p1c443040} id="Vector_3" stroke="var(--stroke-0, #18A0A6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.999645" />
          <path d={svgPaths.p2ca9ce00} id="Vector_4" stroke="var(--stroke-0, #18A0A6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.999645" />
        </g>
        <defs>
          <clipPath id="clip0_3158_1693">
            <rect fill="white" height="11.9957" width="11.9957" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container14() {
  return (
    <div className="content-stretch flex gap-[7.997px] h-[16.499px] items-center relative shrink-0 w-full" data-name="Container">
      <Text3 />
      <Icon5 />
    </div>
  );
}

function Frame20() {
  return (
    <div className="content-stretch flex flex-col gap-[2px] items-start relative shrink-0 w-full">
      <Container13 />
      <Container14 />
    </div>
  );
}

function Container15() {
  return (
    <div className="content-stretch flex flex-col gap-[1.996px] h-[50px] items-start relative shrink-0 w-[426px]" data-name="Container">
      <Paragraph6 />
      <Frame20 />
    </div>
  );
}

function Frame24() {
  return (
    <div className="content-stretch flex gap-[12px] items-start relative shrink-0 w-full">
      <Container12 />
      <Container15 />
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

function Container16() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-[112px]" data-name="Container">
      <Text5 />
    </div>
  );
}

function Frame21() {
  return (
    <div className="content-stretch flex gap-[5px] items-center relative shrink-0 w-full">
      <Text4 />
      <Container16 />
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

function Container17() {
  return (
    <div className="content-stretch flex h-[15px] items-center relative shrink-0 w-[109px]" data-name="Container">
      <Text6 />
    </div>
  );
}

function Frame22() {
  return (
    <div className="content-stretch flex gap-[5px] items-center relative shrink-0 w-full">
      <p className="css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[15px] not-italic relative shrink-0 text-[#6a7282] text-[11px] w-[56px]">Check-out</p>
      <Container17 />
    </div>
  );
}

function Frame23() {
  return (
    <div className="content-stretch flex flex-col gap-[2px] items-start relative shrink-0 w-[368px]">
      <Frame21 />
      <Frame22 />
    </div>
  );
}

function Frame25() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full">
      <Frame24 />
      <Frame23 />
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

function Container18() {
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
      <Container18 />
    </div>
  );
}

function Frame26() {
  return (
    <div className="bg-[#f7f6f8] content-stretch flex flex-col h-[166.898px] items-start justify-between p-[20px] relative rounded-[10px] shrink-0 w-[535px]">
      <div aria-hidden="true" className="absolute border-[0.91px] border-[rgba(179,173,196,0.28)] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <Frame25 />
      <Container19 />
    </div>
  );
}

function Frame40() {
  return (
    <div className="content-stretch flex gap-[23px] items-start relative shrink-0 w-[563px]">
      <div className="flex h-[183px] items-center justify-center relative shrink-0 w-0" style={{ "--transform-inner-width": "0", "--transform-inner-height": "130.453125" } as React.CSSProperties}>
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
      <Frame26 />
    </div>
  );
}

function Frame41() {
  return (
    <div className="content-stretch flex flex-col gap-[15px] items-end relative shrink-0 w-full">
      <Frame9 />
      <Frame40 />
    </div>
  );
}

function Frame46() {
  return (
    <div className="content-stretch flex flex-col gap-[11px] items-start relative shrink-0 w-full">
      <Frame45 />
      <Frame41 />
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

function Frame10() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0">
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[24px] not-italic relative shrink-0 text-[#1f2933] text-[16px] tracking-[-0.3125px]">Ground Transport</p>
    </div>
  );
}

function Frame11() {
  return (
    <div className="content-stretch flex gap-[11px] items-start relative shrink-0 w-[166px]">
      <Icon7 />
      <Frame10 />
    </div>
  );
}

function Frame27() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[212px]">
      <Frame11 />
    </div>
  );
}

function Frame28() {
  return (
    <div className="content-stretch flex flex-col gap-[9px] items-start relative shrink-0 w-full">
      <Frame27 />
      <p className="css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[20px] min-w-full not-italic relative shrink-0 text-[#364153] text-[14px] tracking-[-0.1504px] w-[min-content]">3 Uber Vouchers Provided $40</p>
    </div>
  );
}

function Frame43() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-[339px]">
      <Frame28 />
      <div className="absolute flex h-[17px] items-center justify-center left-[10px] top-[65px] w-0" style={{ "--transform-inner-width": "0", "--transform-inner-height": "130.453125" } as React.CSSProperties}>
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
        <g clipPath="url(#clip0_3158_1656)" id="Icon">
          <path d={svgPaths.p2840da80} id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d={svgPaths.p18a1600} id="Vector_2" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d="M1.75 18.168L7.08333 12.918" id="Vector_3" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d="M15.8333 4.16797L10 10.0013" id="Vector_4" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
        <defs>
          <clipPath id="clip0_3158_1656">
            <rect fill="white" height="20" width="20" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Heading1() {
  return (
    <div className="h-[23.999px] relative shrink-0 w-[38.651px]" data-name="Heading 4">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[24px] left-0 not-italic text-[#1f2933] text-[16px] top-[-0.73px] tracking-[-0.3125px]">Food</p>
      </div>
    </div>
  );
}

function Container20() {
  return (
    <div className="content-stretch flex gap-[7.997px] h-[24px] items-center relative shrink-0 w-full" data-name="Container">
      <Icon8 />
      <Heading1 />
    </div>
  );
}

function Frame29() {
  return (
    <div className="content-stretch flex flex-col gap-[6px] items-start relative shrink-0 w-full">
      <Container20 />
      <p className="css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[#364153] text-[14px] tracking-[-0.1504px] w-full">Reimbursed Provided for under $40 per meal</p>
    </div>
  );
}

function Frame44() {
  return (
    <div className="content-stretch flex flex-col gap-[5px] items-start relative shrink-0 w-full">
      <Frame29 />
      <div className="absolute flex h-[17px] items-center justify-center left-[10px] top-[55px] w-0" style={{ "--transform-inner-width": "0", "--transform-inner-height": "130.453125" } as React.CSSProperties}>
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

function Frame47() {
  return (
    <div className="content-stretch flex flex-col gap-[38px] items-start relative shrink-0 w-full">
      <Frame43 />
      <Frame44 />
    </div>
  );
}

function Frame48() {
  return (
    <div className="content-stretch flex flex-col gap-[15px] items-start relative shrink-0 w-full">
      <Frame46 />
      <Frame47 />
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

function Frame32() {
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

function Frame2() {
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
      <Trash2 />
      <Frame2 />
    </div>
  );
}

function Frame12() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <Frame32 />
      <Frame4 />
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

function Container21() {
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

function Container22() {
  return (
    <div className="h-[31.996px] relative shrink-0 w-[56.57px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Paragraph9 />
        <Paragraph10 />
      </div>
    </div>
  );
}

function Container23() {
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

function Container24() {
  return (
    <div className="flex-[1_0_0] h-[15px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[7.997px] items-center relative size-full">
        <Container23 />
        <Text7 />
        <Container23 />
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

function Container25() {
  return (
    <div className="h-[31.996px] relative shrink-0 w-[55.028px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Paragraph11 />
        <Paragraph12 />
      </div>
    </div>
  );
}

function Container26() {
  return (
    <div className="content-stretch flex gap-[11.996px] h-[31.996px] items-center relative shrink-0 w-full" data-name="Container">
      <Container22 />
      <Container24 />
      <Container25 />
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

function Frame34() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full">
      <Container26 />
      <Paragraph13 />
    </div>
  );
}

function Container27() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col h-[40px] items-start min-h-px min-w-px relative" data-name="Container">
      <Frame34 />
    </div>
  );
}

function Frame37() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center relative w-full">
        <Container21 />
        <Container27 />
      </div>
    </div>
  );
}

function Container28() {
  return (
    <div className="content-stretch flex h-[52px] items-start relative shrink-0 w-[302px]" data-name="Container">
      <Frame37 />
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

function Frame56() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[99px]">
      <Frame54 />
      <Frame55 />
    </div>
  );
}

function Frame30() {
  return (
    <div className="bg-[#f7f6f8] content-stretch flex h-[93px] items-start justify-between p-[20px] relative rounded-[10px] shrink-0 w-[542px]">
      <div aria-hidden="true" className="absolute border-[0.91px] border-[rgba(179,173,196,0.28)] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <Container28 />
      <Frame56 />
    </div>
  );
}

function Frame31() {
  return (
    <div className="content-stretch flex flex-col gap-[11px] items-end relative shrink-0 w-full">
      <Frame12 />
      <Frame30 />
    </div>
  );
}

function Frame42() {
  return (
    <div className="content-stretch flex flex-col gap-[14px] items-start relative shrink-0 w-full">
      <p className="css-4hzbpn font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] not-italic relative shrink-0 text-[#1f2933] text-[16px] tracking-[-0.3125px] w-full">Thursday, Mar 5</p>
      <Frame31 />
    </div>
  );
}

function Frame49() {
  return (
    <div className="content-stretch flex flex-col gap-[30px] items-start relative shrink-0 w-full">
      <Frame48 />
      <Frame42 />
    </div>
  );
}

function Frame51() {
  return (
    <div className="content-stretch flex flex-col gap-[21px] items-start relative shrink-0 w-full">
      <Frame50 />
      <Frame49 />
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

function Container29() {
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

function Container30() {
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

function Container31() {
  return (
    <div className="content-stretch flex gap-[7.995px] h-[15.991px] items-center relative shrink-0 w-full" data-name="Container">
      <Icon14 />
      <Text10 />
    </div>
  );
}

function Container32() {
  return (
    <div className="content-stretch flex flex-col gap-[7.995px] h-[64px] items-start relative shrink-0 w-[383px]" data-name="Container">
      <Container29 />
      <Container30 />
      <Container31 />
    </div>
  );
}

function Frame33() {
  return (
    <div className="content-stretch flex flex-col gap-[19px] items-start relative shrink-0 w-full">
      <div className="h-0 relative shrink-0 w-full">
        <div className="absolute inset-[-1px_0_0_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 577 1">
            <line id="Line 2" stroke="var(--stroke-0, #E6E6E6)" x2="577" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <Container32 />
    </div>
  );
}

function Frame52() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[20px] items-center px-[24px] py-[30px] relative rounded-[14px] shrink-0 w-[625px]">
      <Frame51 />
      <Frame33 />
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

function Frame35() {
  return (
    <div className="content-stretch flex flex-col gap-[9px] items-center relative shrink-0 w-[577px]">
      <Button />
      <p className="css-4hzbpn font-['Inter:Italic',sans-serif] font-normal h-[36px] italic leading-[26.67px] relative shrink-0 text-[14px] text-black text-center tracking-[-0.2005px] w-full">Don’t worry! All reservations can be cancelled within 24 hours.</p>
    </div>
  );
}

function Frame53() {
  return (
    <div className="content-stretch flex flex-col gap-[17px] items-center relative shrink-0">
      <Frame52 />
      <Frame35 />
    </div>
  );
}

export default function Frame36() {
  return (
    <div className="content-stretch flex flex-col items-start relative rounded-[14px] size-full">
      <div aria-hidden="true" className="absolute border border-[#e5e7eb] border-solid inset-[-1px] pointer-events-none rounded-[15px]" />
      <Frame53 />
    </div>
  );
}