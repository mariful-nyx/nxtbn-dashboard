import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import OrderTable from "./OrderTable";
import OrderPagination from "./OrderPagination";
import OrderToolbar from "./OrderToolbar";
import useApi from "../../api";

const pageChoice = [
  {
    title: "All Orders",
    value: "all-orders",
  },
  {
    title: "Shipping",
    value: "shipping",
  },
  {
    title: "Completed",
    value: "completed",
  },
  {
    title: "Canceled",
    value: "canceled",
  },
];

function OrdersMain() {
  let [searchParams, setSearchParams] = useSearchParams();

  const changePage = (page: string) => {
    setSearchParams(new URLSearchParams({ page: page }));
  };

  useEffect(() => {
    if (searchParams.get("page") === null) {
      setSearchParams(new URLSearchParams({ page: "all-orders" }));
    }
  }, [setSearchParams, searchParams]);

  const currentPage = searchParams.get("page");

  const api = useApi()
  const [orders, setOrders] = useState<any>()

  useEffect(()=>{
      getOrders()
  }, [])
  const getOrders = (page?: number) => {
    api.getOrders(page).then((response:any)=>setOrders(response)).catch((error)=>console.log(error))
  }


  return (
    <div className="w-full flex flex-col p-[5%] md:p-10">
      <div className="bg-white rounded-lg">
        <div className="text-base-300 flex gap-5 border-b border-[#EEEFF2] py-5 px-10 pb-3 w-[100%] overflow-x-auto">
          {pageChoice.map((page) => (
            <button
              key={page.value}
              onClick={() => changePage(page.value)}
              className={`relative text-sm md:text-[16px] ${
                currentPage === page.value && "text-[#0CAF60] font-bold"
              }`}
            >
              {page.title}
              {currentPage === page.value && (
                <span className="after:content-[''] absolute bottom-[-0.75rem] left-[-10px] w-[120%] border-b-2 border-[#0CAF60]"></span>
              )}
            </button>
          ))}
        </div>

        <OrderToolbar />
        <div className="px-1">
          <OrderTable orders={orders}/>
        </div>
        
        <OrderPagination orders={orders} getOrders={getOrders}/>
      </div>
    </div>
  );
}

export default OrdersMain;
