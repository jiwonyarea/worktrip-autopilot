import svgPaths from "./svg-trguva5jlw";

function Icon() {
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
      <Icon />
    </div>
  );
}

export default function Container() {
  return (
    <div className="bg-[rgba(31,157,85,0.1)] content-stretch flex flex-col items-start justify-center pb-[0.674px] pt-[0.67px] px-[16.665px] relative rounded-[14px] size-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[0.674px] border-[rgba(31,157,85,0.2)] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <Frame />
    </div>
  );
}