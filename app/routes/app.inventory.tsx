import type { LoaderFunction} from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { authenticate } from "~/shopify.server";


export const loader: LoaderFunction = async ({ request }) => {

  const  { admin, session } = await authenticate.admin(request);

  try {
    const response = await admin.rest.resources.InventoryLevel.all({
        session: session,
        location_ids: '67335028890'
    })

    if(response){
        console.log('hit')

        const data = response.data

        console.log(data, 'data')

        return json({
            inventory: data
        })

    }

    return null

  } catch(err){
    console.log(err)
  }
}

const Inventory = () => {

    const data: any = useLoaderData()
    console.log(data, 'data');

  return <div>app.inventory</div>;
};

export default Inventory;
