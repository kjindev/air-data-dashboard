import { dummydata } from "@/store/dummyData";
import axios from "axios";

let list: { date: string; time: string; name: string } = {
  date: "",
  time: "",
  name: "",
};

const handler = async (req: any, res: any) => {
  if (req.method === "GET") {
    const result = dummydata.filter(
      (item: any) =>
        item.MSRDT.includes(list.date + list.time) &&
        list.name === item.MSRSTE_NM
    );
    res.json(result);
    // const getAPI = async (req: Request) => {
    //   const API_URL = `http://openAPI.seoul.go.kr:8088/${
    //     process.env.NEXT_PUBLIC_API_URL_KEY
    //   }/json/TimeAverageAirQuality/1/25/${list.date + list.time}/${list.name}`;
    //   let response;
    //   try {
    //     response = await axios.get(API_URL);
    //   } catch (error) {
    //     console.log(error);
    //   }
    //   return response;
    // };
    // await getAPI(req).then((response) => {
    //   res.json(response?.data);
    // });
  } else if (req.method === "POST") {
    list = {
      date: req.body.date,
      time: req.body.time,
      name: req.body.name,
    };
    res.send(list);
  }
};

export default handler;
