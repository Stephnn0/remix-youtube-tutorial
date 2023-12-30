import type { ActionFunction} from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useActionData, useSubmit } from "@remix-run/react";
import { Button, Card, Page, TextField } from "@shopify/polaris";
import { useState } from "react";
import { authenticate } from "~/shopify.server";


export const action: ActionFunction = async ({ request }) => {
    const { admin } = await authenticate.admin(request)

    const formData = await request.formData();


    const dynamicTitle = formData.get('discountTitlee')
    console.log(dynamicTitle, 'dynamicTitle')

    try {

        const startsAt = "2022-06-21T00:00:00Z";
        const endsAt = "2024-09-21T00:00:00Z";
        const minimumRequirementSubtotal = 2;
        const discountAmount = 100;

        const response =  await admin.graphql(
                     `#graphql
                  mutation discountAutomaticBasicCreate($automaticBasicDiscount: DiscountAutomaticBasicInput!) {
                    discountAutomaticBasicCreate(automaticBasicDiscount: $automaticBasicDiscount) {
                      automaticDiscountNode {
                        id
                        automaticDiscount {
                          ... on DiscountAutomaticBasic {
                            startsAt
                            endsAt
                            minimumRequirement {
                          ... on DiscountMinimumSubtotal {
                           greaterThanOrEqualToSubtotal {
                                 amount
                                 currencyCode
                           }
                           }
                         }
                            customerGets {
                              value {
                                ... on DiscountAmount {
                                  amount {
                                    amount
                                    currencyCode
                                  }
                                  appliesOnEachItem
                                  
                                }
                              }
                              items {
                                ... on AllDiscountItems {
                                  allItems
                                }
                              }
                            }
                          }
                        }
                      }
                      userErrors {
                        field
                        code
                        message
                      }
                    }
                  }`,
                  {
                variables: {
                  automaticBasicDiscount: {
                    title: dynamicTitle,
                    startsAt,
                    endsAt,
                    minimumRequirement: {
                      subtotal: {
                        greaterThanOrEqualToSubtotal: minimumRequirementSubtotal,
                      },
                    },
                    customerGets: {
                      value: {
                        discountAmount: {
                          amount: discountAmount,
                          appliesOnEachItem: false,
                        },
                      },
                      items: {
                        all: true,
                      },
                    },
                 },
             }
        }
        );

        if(response.ok){
            const responseJson = await request.json()
            console.log('created discount');

            return json({
                discount: responseJson.data
            })

        }

        return null

    } catch(err){
        console.log(err)
    }
    
}


const Discounts = () => {

    const [discountTitlee, setDiscountTitlee] = useState('')

    const submit = useSubmit();
    const actionData = useActionData<typeof action>();
    console.log(actionData, 'actionData');

    const generateDiscount = () => submit({}, { replace: true, method: 'POST'})

  return (
    <Page>
        <Card>
            <Form onSubmit={generateDiscount} method="post">
            <TextField
             id="discountTitlee"
             name="discountTitlee"
             label="title"
             autoComplete="off"
             value={discountTitlee}
             onChange={(value) => setDiscountTitlee(value)}
    />
              <Button submit>create Discount</Button>
     
            </Form>
            
        </Card>
    </Page>
  );
};

export default Discounts;
