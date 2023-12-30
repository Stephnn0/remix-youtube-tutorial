import { Button, Card, Layout, Page, TextField } from "@shopify/polaris";
import axios from "axios";
import { useEffect, useState } from "react";


interface Message {
    _id: string,
    content: string
}

const Chat = () => {


    const [messages, setMessages ] = useState<Message[]>([]);

    const getAllMessages = async () => {
        try {

            const response = await axios.get<Message[]>('https://www.poppilan.com/api/getAllMessages')
            setMessages(response.data)
            console.log(response.data)
        }catch(err){
                console.error(err)
            }
        }
    
    useEffect(() => {
        getAllMessages()
    }, [])

    console.log(messages, 'messages')


  return (
    <Page>
        <Layout>
            <Layout.Section>
                <div>
                    <h1>CHAT</h1>
                    {
                        messages.length > 0 ? (
                            <div>
                                {
                                    messages.map((message: Message) => (
                                        <div key={message._id}>
                                            <Card>
                                                {message.content}
                                            </Card>
                                            <br/>
                                        </div>
                                    ))
                                }
                            </div>
                        ) : (
                            <h1>no messages found</h1>
                        )
                    }
                </div>
            </Layout.Section>
            <Layout.Section>
                <div style={{position: "fixed", bottom: "0", width: "95%"}}>
                    <Card background="bg-fill-brand-hover">
                        <TextField
                            label=""
                             autoComplete="off" />
                        <Button>Send</Button>

                    </Card>
                </div>
            </Layout.Section>

        </Layout>
    </Page>
  );


}


export default Chat;
