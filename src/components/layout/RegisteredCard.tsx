import { Card, CardContent } from "../ui/card";

export const RegisteredCard = (): JSX.Element => {
  return (
    <div className="w-[515px] h-[693px] bg-[#d6ece1] rounded-[10px] overflow-hidden border border-dashed border-[#1aaa65]">
      <div className="w-[500px] gap-[31px] top-[53px] left-2 flex flex-col items-center relative">
        <h1 className="relative w-[452px] mt-[-1.00px] font-display-sm-semibold font-[number:var(--display-sm-semibold-font-weight)] text-gray-800 text-[length:var(--display-sm-semibold-font-size)] text-center tracking-[var(--display-sm-semibold-letter-spacing)] leading-[var(--display-sm-semibold-line-height)] [font-style:var(--display-sm-semibold-font-style)]">
          Hi Wunmi, you&apos;ve successfully registered 🎉🎉
        </h1>

        <div className="gap-[30px] self-stretch w-full flex-[0_0_auto] flex flex-col items-center relative">
          <div className="relative w-[300px] h-[479px] bg-[url(/subtract.svg)] bg-[100%_100%]">
            <Card className="flex w-[262px] h-[305px] items-center p-3.5 absolute top-[19px] left-[19px] bg-[#031d211a] rounded-2xl border border-solid border-[#1aaa65] backdrop-blur-[2px] backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(2px)_brightness(100%)]">
              <CardContent className="flex flex-col w-[232px] items-center gap-5 relative p-0">
                <div className="flex flex-col w-[175px] items-center relative flex-[0_0_auto]">
                  <div className="relative w-[280px] mt-[-1.00px] ml-[-52.50px] mr-[-52.50px] [font-family:'Road_Rage',Helvetica] font-normal text-white text-[34px] text-center tracking-[0] leading-[34px]">
                    Wizkid Live in Lagos
                  </div>

                  <div className="inline-flex flex-col items-center justify-center gap-1.5 p-1 relative flex-[0_0_auto]">
                    <div className="relative w-fit mt-[-1.00px] [font-family:'Sofia_Pro-Regular',Helvetica] font-normal text-white text-xs tracking-[-0.24px] leading-[normal] whitespace-nowrap">
                      📍 Victoria Island, Lagos
                    </div>

                    <div className="relative w-fit [font-family:'Sofia_Pro-Regular',Helvetica] font-normal text-white text-xs tracking-[-0.24px] leading-[normal] whitespace-nowrap">
                      📅 April 17, 2025 | 9:00 PM
                    </div>
                  </div>
                </div>

                <img
                  className="relative w-[140px] h-[140px]"
                  alt="QR Code"
                  src="/image.png"
                />
              </CardContent>
            </Card>

            <div className="absolute w-[236px] h-[54px] top-[408px] left-8">
              {/* Barcode section */}
              <div className="w-[18px] absolute h-[54px] top-0 left-0">
                <div className="w-2.5 absolute h-[54px] top-0 left-0">
                  <div className="absolute w-[9px] h-1.5 top-11 left-px">
                    <div className="absolute w-[7px] top-0 left-0 [font-family:'Inter',Helvetica] font-normal text-white text-xs tracking-[0] leading-[normal] whitespace-nowrap">
                      1
                    </div>
                  </div>

                  <div className="w-[9px] h-[54px] left-0 absolute top-0">
                    <img
                      className="absolute w-0.5 h-[45px] top-0 left-0"
                      alt="Vector"
                      src="/vector.svg"
                    />

                    <img
                      className="w-0.5 h-[45px] left-1 absolute top-0"
                      alt="Vector"
                      src="/vector.svg"
                    />

                    <div className="absolute w-px top-12 left-[3px] [font-family:'Inter',Helvetica] font-normal text-white text-xs text-center tracking-[0] leading-[normal] whitespace-nowrap">
                      {""}
                    </div>
                  </div>
                </div>

                <img
                  className="w-[9px] h-[41px] left-[9px] absolute top-0"
                  alt="Vector"
                  src="/vector-2.svg"
                />
              </div>

              <div className="w-[9px] h-[54px] left-[27px] absolute top-0">
                <img
                  className="absolute w-0.5 h-[45px] top-0 left-0"
                  alt="Vector"
                  src="/vector.svg"
                />

                <img
                  className="w-0.5 h-[45px] left-1 absolute top-0"
                  alt="Vector"
                  src="/vector.svg"
                />

                <div className="absolute w-px top-12 left-[3px] [font-family:'Inter',Helvetica] font-normal text-white text-xs text-center tracking-[0] leading-[normal] whitespace-nowrap">
                  {""}
                </div>
              </div>

              <img
                className="w-[3px] h-[41px] left-[21px] absolute top-0"
                alt="Vector"
                src="/vector.svg"
              />

              <div className="w-[90px] h-[50px] left-[38px] absolute top-0">
                <img
                  className="w-0.5 h-[41px] left-0 absolute top-0"
                  alt="Vector"
                  src="/vector.svg"
                />

                <img
                  className="w-1 h-[41px] left-[7px] absolute top-0"
                  alt="Vector"
                  src="/vector-2.svg"
                />

                <img
                  className="w-0.5 h-[41px] left-6 absolute top-0"
                  alt="Vector"
                  src="/vector.svg"
                />

                <img
                  className="w-[7px] h-[41px] left-[31px] absolute top-0"
                  alt="Vector"
                  src="/vector-2.svg"
                />

                <img
                  className="w-0.5 h-[41px] left-10 absolute top-0"
                  alt="Vector"
                  src="/vector.svg"
                />

                <img
                  className="w-1 h-[41px] left-11 absolute top-0"
                  alt="Vector"
                  src="/vector-2.svg"
                />

                <img
                  className="w-0.5 h-[41px] left-[55px] absolute top-0"
                  alt="Vector"
                  src="/vector.svg"
                />

                <img
                  className="w-0.5 h-[41px] left-[66px] absolute top-0"
                  alt="Vector"
                  src="/vector.svg"
                />

                <img
                  className="w-0.5 h-[41px] left-[70px] absolute top-0"
                  alt="Vector"
                  src="/vector.svg"
                />

                <img
                  className="w-0.5 h-[41px] left-[77px] absolute top-0"
                  alt="Vector"
                  src="/vector.svg"
                />

                <img
                  className="w-0.5 h-[41px] left-[86px] absolute top-0"
                  alt="Vector"
                  src="/vector.svg"
                />

                <div className="absolute w-[49px] top-11 left-[17px] [font-family:'Inter',Helvetica] font-normal text-white text-xs text-center tracking-[0] leading-[normal] whitespace-nowrap">
                  234567
                </div>
              </div>

              <div className="w-[9px] h-[54px] left-32 absolute top-0">
                <img
                  className="absolute w-0.5 h-[45px] top-0 left-0"
                  alt="Vector"
                  src="/vector.svg"
                />

                <img
                  className="w-0.5 h-[45px] left-1 absolute top-0"
                  alt="Vector"
                  src="/vector.svg"
                />

                <div className="absolute w-px top-12 left-[3px] [font-family:'Inter',Helvetica] font-normal text-white text-xs text-center tracking-[0] leading-[normal] whitespace-nowrap">
                  {""}
                </div>
              </div>

              <div className="w-[85px] h-[50px] left-[137px] absolute top-0">
                <img
                  className="w-0.5 h-[41px] left-0 absolute top-0"
                  alt="Vector"
                  src="/vector.svg"
                />

                <img
                  className="w-0.5 h-[41px] left-[7px] absolute top-0"
                  alt="Vector"
                  src="/vector.svg"
                />

                <img
                  className="w-[7px] h-[41px] left-[15px] absolute top-0"
                  alt="Vector"
                  src="/vector-2.svg"
                />

                <img
                  className="w-0.5 h-[41px] left-6 absolute top-0"
                  alt="Vector"
                  src="/vector.svg"
                />

                <img
                  className="w-1 h-[41px] left-[31px] absolute top-0"
                  alt="Vector"
                  src="/vector-2.svg"
                />

                <img
                  className="w-1 h-[41px] left-10 absolute top-0"
                  alt="Vector"
                  src="/vector-2.svg"
                />

                <img
                  className="w-[7px] h-[41px] left-[46px] absolute top-0"
                  alt="Vector"
                  src="/vector-2.svg"
                />

                <img
                  className="w-0.5 h-[41px] left-[57px] absolute top-0"
                  alt="Vector"
                  src="/vector.svg"
                />

                <img
                  className="w-1 h-[41px] left-[61px] absolute top-0"
                  alt="Vector"
                  src="/vector-2.svg"
                />

                <img
                  className="w-1 h-[41px] left-[68px] absolute top-0"
                  alt="Vector"
                  src="/vector-2.svg"
                />

                <img
                  className="w-0.5 h-[41px] left-[77px] absolute top-0"
                  alt="Vector"
                  src="/vector.svg"
                />

                <img
                  className="w-0.5 h-[41px] left-[81px] absolute top-0"
                  alt="Vector"
                  src="/vector.svg"
                />

                <div className="absolute w-[47px] top-11 left-[23px] [font-family:'Inter',Helvetica] font-normal text-white text-xs text-center tracking-[0] leading-[normal] whitespace-nowrap">
                  891026
                </div>
              </div>

              <div className="w-[9px] h-[54px] left-[229px] absolute top-0">
                <img
                  className="absolute w-0.5 h-[45px] top-0 left-0"
                  alt="Vector"
                  src="/vector.svg"
                />

                <img
                  className="w-0.5 h-[45px] left-1 absolute top-0"
                  alt="Vector"
                  src="/vector.svg"
                />

                <div className="absolute w-px top-12 left-[3px] [font-family:'Inter',Helvetica] font-normal text-white text-xs text-center tracking-[0] leading-[normal] whitespace-nowrap">
                  {""}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
