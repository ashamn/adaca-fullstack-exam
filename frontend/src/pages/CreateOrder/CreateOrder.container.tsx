import { useEffect, useState } from "react";
import { getMenuItems, GetMenuItemsResponse } from "../../services/menu";
import {
  CreateOrderPrivateProps,
  CreateOrderPublicProps,
} from "./CreateOrder.props";
import CreateOrderView from "./CreateOrder.view";

const CreateOrder = (props: CreateOrderPublicProps) => {
  const [data, setData] = useState<GetMenuItemsResponse | null>(null);

  useEffect(() => {
    // TODO: Fetch menu data
    const fetchData = async () => {
      const result = await getMenuItems();
      setData(result);
    };

    fetchData();
  }, []);

  const generatedProps: CreateOrderPrivateProps = {
    items: data?.items ?? [],
    rules: data?.rules ?? {},
  };
  return <CreateOrderView {...generatedProps} />;
};

export default CreateOrder;
