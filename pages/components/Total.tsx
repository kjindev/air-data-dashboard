import { useState, useEffect, lazy, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import useRequest from "../hooks/useRequest";
import TotalMap from "../chart/maps/TotalMap";
import PieChart from "../chart/totalChart/PieChart";
import BubbleChart from "../chart/totalChart/BubbleChart";
import PM10Chart from "../chart/totalChart/PM10Chart";
import { todayData, totalData, yesterdayData } from "@/store/dataSlice";

export default function Daily() {
  const [timeList, setTimeList] = useState<string[]>([]);
  // const request = useRequest();
  const dispatch = useDispatch();
  const date = useSelector((state: RootState) => {
    return state.name;
  });
  const todayState = useSelector((state: RootState) => {
    return state.data.todayState;
  });

  const getData = async (dateType: string) => {
    try {
      const response = await fetch("/api/data");
      const result = await response.json();
      if (!result.RESULT) {
        // const data = result.TimeAverageAirQuality.row;
        const data = result;
        if (dateType === "today") {
          dispatch(todayData(data));
        } else if (dateType === "yesterday") {
          dispatch(yesterdayData(data));
        } else if (dateType === "total") {
          dispatch(totalData(data));
        }
      }
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  const updateData = async (
    reqDate: string,
    reqTime: string,
    reqName: string | undefined
  ) => {
    try {
      const response = await fetch("/api/data_temp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date: reqDate,
          // time: reqTime,
          time: "202402091200",
          name: reqName,
        }),
      });
      if (!response.ok) {
        console.log("error");
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (todayState) {
      let list: string[] = [];
      for (let i = todayState.length - 2; i >= 0; i--) {
        list.push(todayState[i].MSRDT.slice(8, 10) + "시");
      }
      setTimeList(list);
    }
  }, [todayState]);

  const changeOption = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const target = event.target as HTMLSelectElement;
    const selectTime = target.value.slice(0, 2);
    updateData(date.todayDateState, selectTime, "")
      .then(() => getData("total"))
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    if (timeList.length !== 0) {
      updateData(date.todayDateState, timeList[0].slice(0, 2), "")
        .then(() => getData("total"))
        .catch((error) => console.log(error));
    }
    // eslint-disable-next-line
  }, [timeList]);

  return (
    <div>
      <div className="pt-[5%] lg:pt-0 px-[5%] pb-5 w-[100%] flex flex-col md:flex-row items-center">
        <div className="text-2xl"> | 오늘의 서울 대기환경</div>
        {/* <div className="p-3">
          <select onChange={changeOption} className="px-3 py-1 drop-shadow">
            {timeList?.map((item, index) => (
              <option key={index} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div> */}
      </div>
      <div className="w-[95vw] md:w-[85vw] flex justify-center items-center">
        <div className="w-[90%] lg:h-[100%] flex flex-col lg:flex-row justify-between items-center">
          <div className="w-[100%] lg:w-[50%] lg:mr-3 flex flex-col justify-center items-center">
            <div className="w-[100%] lg:h-[32vh] mb-5 flex flex-col lg:flex-row items-center justify-between">
              <div className="w-[100%] md:w-[50%] lg:w-[48%] lg:h-[100%] bg-white rounded-xl drop-shadow-md">
                <TotalMap />
              </div>
              <div className="w-[100%] md:w-[50%] lg:w-[48%] mt-5 lg:mt-0 lg:h-[32vh] bg-white rounded-xl drop-shadow-md">
                <PieChart />
              </div>
            </div>
            <div className="w-[100%] h-[70vh] lg:h-[40vh] bg-white rounded-xl drop-shadow-md">
              <BubbleChart />
            </div>
          </div>
          <div className="w-[100%] lg:w-[48%] h-[100vh] lg:h-[75vh] mt-5 lg:mt-0 bg-white rounded-xl drop-shadow-md">
            <PM10Chart />
          </div>
        </div>
      </div>
    </div>
  );
}
