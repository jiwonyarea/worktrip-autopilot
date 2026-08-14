import svgPaths from "./svg-piow945ile";
import imgImage1 from "figma:asset/50ba81ee3baed0d032549253a352c5d27d54adb9.png";

function Button() {
  return (
    <div className="bg-[#f5f7fa] content-stretch flex h-[32px] items-center justify-center px-[12.909px] py-[0.909px] relative rounded-[8px] shrink-0 w-[132px]" data-name="Button">
      <div aria-hidden="true" className="absolute border-[0.909px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <p className="css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[#1f2933] text-[14px] text-center tracking-[-0.1504px]">Change booking</p>
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex gap-[15px] items-center relative shrink-0">
      <p className="css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] not-italic relative shrink-0 text-[#1f2933] text-[16px] tracking-[-0.3125px]">My schedule</p>
      <Button />
    </div>
  );
}

function ShareFat() {
  return (
    <div className="relative shrink-0 size-[22px]" data-name="ShareFat">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 22">
        <g id="ShareFat">
          <path d={svgPaths.p27eb400} fill="var(--fill-0, black)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function DownloadSimple() {
  return (
    <div className="relative shrink-0 size-[22px]" data-name="DownloadSimple">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 22">
        <g id="DownloadSimple">
          <path d={svgPaths.p33dae700} fill="var(--fill-0, black)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
      <ShareFat />
      <DownloadSimple />
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-[582px]">
      <Frame />
      <Frame1 />
    </div>
  );
}

function Container() {
  return <div className="bg-[#e5e7eb] h-[136.839px] shrink-0 w-[1.991px]" data-name="Container" />;
}

function Container1() {
  return (
    <div className="h-[176px] relative shrink-0 w-[56px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center relative size-full">
        <Container />
      </div>
    </div>
  );
}

function Icon() {
  return (
    <div className="relative shrink-0 size-[15.991px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.9909 15.9909">
        <g id="Icon">
          <path d={svgPaths.p31bfb6a0} id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33258" />
        </g>
      </svg>
    </div>
  );
}

function Container2() {
  return (
    <div className="h-[19.994px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] left-0 not-italic text-[#1f2933] text-[14px] top-[0.35px] tracking-[-0.1504px]">9:00-11:05</p>
    </div>
  );
}

function Container3() {
  return (
    <div className="h-[15.991px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-0 not-italic text-[#6a7282] text-[12px] top-[0.67px]">PIT-SFO · Detla Airlines · DE 1234</p>
    </div>
  );
}

function Container4() {
  return (
    <div className="flex-[1_0_0] h-[35.985px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Container2 />
        <Container3 />
      </div>
    </div>
  );
}

function Icon1() {
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

function Container5() {
  return (
    <div className="bg-[#f7f6f8] h-[59.982px] relative rounded-[10px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(179,173,196,0.28)] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[11.998px] items-center px-[12.998px] py-px relative size-full">
          <Icon />
          <Container4 />
          <Icon1 />
        </div>
      </div>
    </div>
  );
}

function Icon2() {
  return (
    <div className="relative shrink-0 size-[15.991px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.9909 15.9909">
        <g clipPath="url(#clip0_3178_1906)" id="Icon">
          <path d="M6.66406 14.6588V10.2812" id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33258" />
          <path d="M7.99609 7.33008H8.00276" id="Vector_2" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33258" />
          <path d="M7.99609 4.66406H8.00276" id="Vector_3" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33258" />
          <path d="M9.32812 10.2812V14.6588" id="Vector_4" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33258" />
          <path d={svgPaths.p22c4780} id="Vector_5" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33258" />
          <path d="M10.6602 7.33008H10.6668" id="Vector_6" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33258" />
          <path d="M10.6602 4.66406H10.6668" id="Vector_7" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33258" />
          <path d="M5.33008 7.33008H5.33674" id="Vector_8" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33258" />
          <path d="M5.33031 4.66402H5.33697" id="Vector_9" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33258" />
          <path d={svgPaths.p1e3afd80} id="Vector_10" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33258" />
        </g>
        <defs>
          <clipPath id="clip0_3178_1906">
            <rect fill="white" height="15.9909" width="15.9909" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container6() {
  return (
    <div className="absolute h-[19.994px] left-0 top-0 w-[341.54px]" data-name="Container">
      <p className="absolute css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] left-0 not-italic text-[#1f2933] text-[14px] top-[0.35px] tracking-[-0.1504px]">Hilton Midtown</p>
    </div>
  );
}

function Container7() {
  return (
    <div className="absolute h-[15.991px] left-0 top-[19.99px] w-[341.54px]" data-name="Container">
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-0 not-italic text-[#6a7282] text-[12px] top-[0.67px]">Check-in 3:00 PM</p>
    </div>
  );
}

function Container8() {
  return (
    <div className="flex-[1_0_0] h-[35.985px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Container6 />
        <Container7 />
      </div>
    </div>
  );
}

function Icon3() {
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

function Container9() {
  return (
    <div className="bg-[#f7f6f8] h-[59.982px] relative rounded-[10px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(179,173,196,0.28)] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[11.998px] items-center px-[12.998px] py-px relative size-full">
          <Icon2 />
          <Container8 />
          <Icon3 />
        </div>
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="content-stretch flex flex-col gap-[7.995px] h-[127.959px] items-start relative shrink-0 w-full" data-name="Container">
      <Container5 />
      <Container9 />
    </div>
  );
}

function Container11() {
  return (
    <div className="flex-[1_0_0] h-[128px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Container10 />
      </div>
    </div>
  );
}

function Container12() {
  return (
    <div className="h-[137px] relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex gap-[15.991px] items-start relative size-full">
        <Container1 />
        <Container11 />
      </div>
    </div>
  );
}

function Container13() {
  return (
    <div className="bg-[#18a0a6] h-[27.02px] relative rounded-[22622000px] shrink-0 w-[39.998px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <p className="css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] not-italic relative shrink-0 text-[12px] text-white">3-5</p>
      </div>
    </div>
  );
}

function Container14() {
  return <div className="bg-[#e5e7eb] flex-[1_0_0] min-h-px min-w-px w-[1.991px]" data-name="Container" />;
}

function Container15() {
  return (
    <div className="h-[108px] relative shrink-0 w-[56px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[7.995px] items-center relative size-full">
        <Container13 />
        <Container14 />
      </div>
    </div>
  );
}

function Container16() {
  return (
    <div className="h-[19.994px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#1f2933] text-[14px] top-[0.35px] tracking-[-0.1504px]">Conference days</p>
    </div>
  );
}

function Icon4() {
  return (
    <div className="relative shrink-0 size-[15.991px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.9909 15.9909">
        <g clipPath="url(#clip0_3178_1918)" id="Icon">
          <path d={svgPaths.p270daa40} id="Vector" stroke="var(--stroke-0, #18A0A6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33258" />
          <path d={svgPaths.p1cf2a3a0} id="Vector_2" stroke="var(--stroke-0, #18A0A6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33258" />
        </g>
        <defs>
          <clipPath id="clip0_3178_1918">
            <rect fill="white" height="15.9909" width="15.9909" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container17() {
  return (
    <div className="absolute h-[19.994px] left-0 top-0 w-[341.54px]" data-name="Container">
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#1f2933] text-[14px] top-[0.35px] tracking-[-0.1504px]">AWS re:Invent</p>
    </div>
  );
}

function Container18() {
  return (
    <div className="absolute h-[15.991px] left-0 top-[19.99px] w-[341.54px]" data-name="Container">
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-0 not-italic text-[#6a7282] text-[12px] top-[0.67px]">Venetian Expo</p>
    </div>
  );
}

function Container19() {
  return (
    <div className="flex-[1_0_0] h-[35.985px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Container17 />
        <Container18 />
      </div>
    </div>
  );
}

function Container20() {
  return (
    <div className="bg-[#e9f5de] h-[59.982px] relative rounded-[10px] shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[11.998px] items-center px-[11.998px] relative size-full">
          <Icon4 />
          <Container19 />
        </div>
      </div>
    </div>
  );
}

function Container21() {
  return (
    <div className="flex-[1_0_0] h-[107.965px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[11.998px] items-start relative size-full">
        <Container16 />
        <Container20 />
      </div>
    </div>
  );
}

function Container22() {
  return (
    <div className="h-[107.965px] relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex gap-[15.991px] items-start relative size-full">
        <Container15 />
        <Container21 />
      </div>
    </div>
  );
}

function Container23() {
  return <div className="bg-[#e5e7eb] h-[136.839px] shrink-0 w-[1.991px]" data-name="Container" />;
}

function Container24() {
  return (
    <div className="h-[176px] relative shrink-0 w-[56px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center relative size-full">
        <Container23 />
      </div>
    </div>
  );
}

function Icon5() {
  return (
    <div className="relative shrink-0 size-[15.991px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.9909 15.9909">
        <g clipPath="url(#clip0_3178_1925)" id="Icon">
          <path d="M6.66406 14.6588V10.2812" id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33258" />
          <path d="M7.99609 7.32812H8.00276" id="Vector_2" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33258" />
          <path d="M7.99609 4.66406H8.00276" id="Vector_3" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33258" />
          <path d="M9.32812 10.2812V14.6588" id="Vector_4" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33258" />
          <path d={svgPaths.p22c4780} id="Vector_5" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33258" />
          <path d="M10.6602 7.32812H10.6668" id="Vector_6" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33258" />
          <path d="M10.6602 4.66406H10.6668" id="Vector_7" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33258" />
          <path d="M5.33008 7.33008H5.33674" id="Vector_8" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33258" />
          <path d="M5.33031 4.66402H5.33697" id="Vector_9" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33258" />
          <path d={svgPaths.p6999400} id="Vector_10" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33258" />
        </g>
        <defs>
          <clipPath id="clip0_3178_1925">
            <rect fill="white" height="15.9909" width="15.9909" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container25() {
  return (
    <div className="absolute h-[19.994px] left-0 top-0 w-[341.54px]" data-name="Container">
      <p className="absolute css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] left-0 not-italic text-[#1f2933] text-[14px] top-[0.35px] tracking-[-0.1504px]">Hilton Midtown</p>
    </div>
  );
}

function Container26() {
  return (
    <div className="absolute h-[15.991px] left-0 top-[19.99px] w-[341.54px]" data-name="Container">
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-0 not-italic text-[#6a7282] text-[12px] top-[0.67px]">Check out 11:00 AM</p>
    </div>
  );
}

function Container27() {
  return (
    <div className="flex-[1_0_0] h-[35.985px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Container25 />
        <Container26 />
      </div>
    </div>
  );
}

function Icon6() {
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

function Container28() {
  return (
    <div className="bg-[#f7f6f8] h-[59.982px] relative rounded-[10px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(179,173,196,0.28)] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[11.998px] items-center px-[12.998px] py-px relative size-full">
          <Icon5 />
          <Container27 />
          <Icon6 />
        </div>
      </div>
    </div>
  );
}

function Icon7() {
  return (
    <div className="relative shrink-0 size-[15.991px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.9909 15.9909">
        <g id="Icon">
          <path d={svgPaths.p31bfb6a0} id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33258" />
        </g>
      </svg>
    </div>
  );
}

function Container29() {
  return (
    <div className="h-[19.994px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] left-0 not-italic text-[#1f2933] text-[14px] top-[0.35px] tracking-[-0.1504px]">9:00-11:05</p>
    </div>
  );
}

function Container30() {
  return (
    <div className="h-[15.991px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-0 not-italic text-[#6a7282] text-[12px] top-[0.67px]">{`PIT-SFO ·      Detla Airlines · DE 1234`}</p>
    </div>
  );
}

function Container31() {
  return (
    <div className="flex-[1_0_0] h-[35.985px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Container29 />
        <Container30 />
        <div className="absolute h-[10px] left-[58.35px] top-[23.04px] w-[13px]" data-name="image 1">
          <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage1} />
        </div>
      </div>
    </div>
  );
}

function Icon8() {
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

function Container32() {
  return (
    <div className="bg-[#f7f6f8] h-[59.982px] relative rounded-[10px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(179,173,196,0.28)] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[11.998px] items-center px-[12.998px] py-px relative size-full">
          <Icon7 />
          <Container31 />
          <Icon8 />
        </div>
      </div>
    </div>
  );
}

function Container33() {
  return (
    <div className="content-stretch flex flex-col gap-[7.995px] h-[127.959px] items-start relative shrink-0 w-full" data-name="Container">
      <Container28 />
      <Container32 />
    </div>
  );
}

function Container34() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative w-full">
        <Container33 />
      </div>
    </div>
  );
}

function Container35() {
  return (
    <div className="h-[159.951px] relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex gap-[15.991px] items-start relative size-full">
        <Container24 />
        <Container34 />
      </div>
    </div>
  );
}

export default function Container36() {
  return (
    <div className="content-stretch flex flex-col gap-[15.991px] items-start pb-[0.674px] pt-[20.668px] px-[20.668px] relative rounded-[10px] size-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#e5e7eb] border-[0.674px] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <Frame2 />
      <p className="css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] not-italic relative shrink-0 text-[#1f2933] text-[16px] tracking-[-0.3125px]">Tuesday, Mar 3</p>
      <Container12 />
      <Container22 />
      <p className="css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] not-italic relative shrink-0 text-[#1f2933] text-[16px] tracking-[-0.3125px]">Thursday, Mar 5</p>
      <Container35 />
    </div>
  );
}