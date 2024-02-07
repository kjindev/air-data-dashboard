import { useState, useEffect, lazy, Suspense } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import useRequest from "../hooks/useRequest";
import Modal from "./Modal";
import DailyMap from "../chart/maps/DailyMap";
import PM10Chart from "../chart/dailyChart/PM10Chart";
import SO2Chart from "../chart/dailyChart/SO2Chart";
import NO2Chart from "../chart/dailyChart/NO2Chart";
import O3Chart from "../chart/dailyChart/O3Chart";
import PM25Chart from "../chart/dailyChart/PM25Chart";

export default function Daily() {
  const [today, setToday] = useState("");
  const { updateData, getData } = useRequest();
  const { todayDateState, yesterdayDateState, nameState } = useSelector(
    (state: RootState) => {
      return state.name;
    }
  );
  const todayState = useSelector((state: RootState) => {
    return state.data.todayState;
  });

  useEffect(() => {
    if (todayState) setToday(todayState[0]?.MSRDT);
  }, [todayState]);

  useEffect(() => {
    updateData(todayDateState, "", nameState)
      .then(() => getData("today"))
      .then(() => updateData(yesterdayDateState, "", nameState))
      .then(() => getData("yesterday"))
      .catch((error) => console.log(error));
    // eslint-disable-next-line
  }, [todayDateState, nameState]);

  return (
    <div>
      <div className="pt-[5%] lg:pt-0 px-[5%] pb-5 w-[100%] flex flex-col md:flex-row justify-between items-center">
        <Modal />
        <div className="text-2xl"> | {nameState}의 실시간 대기환경</div>
        <div>
          <span>({today?.slice(0, 4)}년 </span>
          <span>{today?.slice(4, 6)}월 </span>
          <span>{today?.slice(6, 8)}일 </span>
          <span>{today?.slice(8, 10)}시 기준)</span>
        </div>
      </div>
      <div className="w-[95vw] md:w-[85vw] flex flex-col justify-center items-center">
        <div className="w-[90%] flex flex-col lg:flex-row justify-between items-center">
          <div className="w-[100%] md:w-[50%] lg:w-[33%] lg:h-[45vh] lg:self-center mb-5 bg-white rounded-xl drop-shadow-md">
            <DailyMap />
          </div>
          <div className="w-[100%] lg:w-[65%] h-[45vh] flex justify-center lg:ml-5 mb-5 bg-white rounded-xl drop-shadow-md">
            <PM10Chart />
          </div>
        </div>
        <div className="w-[90%] flex flex-col lg:flex-row justify-between items-center">
          <div className="w-[100%] md:mb-5 lg:mb-0 lg:mr-3 lg:w-[42%] flex justify-between">
            <div className="w-[100%] mr-1 mb-5 md:mb-0 md:w-[48.5%] h-[27vh] flex justify-center bg-white rounded-xl drop-shadow-md">
              <SO2Chart />
            </div>
            <div className="w-[100%] ml-1 mb-5 md:mb-0 md:w-[48.5%] h-[27vh] flex justify-center bg-white rounded-xl drop-shadow-md">
              <NO2Chart />
            </div>
          </div>
          <div className="w-[100%] mb-5 lg:mb-0 lg:w-[30%] h-[27vh] flex justify-center bg-white rounded-xl drop-shadow-md">
            <O3Chart />
          </div>
          <div className="w-[100%] lg:w-[32%] lg:ml-3 lg:h-[27vh] flex justify-center bg-white rounded-xl drop-shadow-md">
            <PM25Chart />
          </div>
        </div>
      </div>
    </div>
  );
}
