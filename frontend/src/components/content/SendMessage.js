import React, { useState } from 'react'
import { Button, Checkbox, Form, Input, Select, message, Space } from 'antd';

const SendMessage = (props) => {

  const [messageApi, contextHolder] = message.useMessage();

  const [form] = Form.useForm();

  const [selectedCat, setSelectedCat] = useState("")

  const onFinish = (values) => {
    console.log('Success:', values);
    console.log('room:', values.room);
    console.log('user:', values.user);
    console.log('message:', values.message);
    if (!values.user) {
      messageApi.open({
        type: 'error',
        content: 'Please enter a user',
      });
    } else if (!values.room) {
      messageApi.open({
        type: 'error',
        content: 'Please enter a room',
      });
    } else {
      messageApi.open({
        type: 'success',
        content: 'Message Sent!',
      });
      props.onSend(values.room, values.user, values.message)
      form.resetFields()

    }
    
  };
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const displayValues = (room) => {
    console.log(room)
    const category = props.rooms.filter((item) => 
      item.roomName == room
    )
    console.log("category")
    // console.log(category[0].roomDataCategory)
    setSelectedCat(category[0].roomDataCategory)
  }
  return (
    <div>
      {contextHolder}
      <Form
        name="basic"
        labelCol={{
          span: 4,
        }}
        wrapperCol={{
          span: 16,
        }}
        style={{
          maxWidth: 600,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        form={form}
      >
        <Form.Item
          label="User"
          name="user"
          rules={[
            {
              required: false,
              message: 'Please input your username!',
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="Room" name="room">
          <Select onSelect={displayValues}>
            {props.rooms.map((room) => 
              <Select.Option value={room.roomName}>{room.roomName}</Select.Option>
            )}
          </Select>
        </Form.Item>

        {/* Display input fields depending on selected category */}
        {selectedCat == "Text" ? <Form.Item
          label="Message"
          name="message"
          rules={[
            {
              required: false,
              message: 'Please input your message!',
            },
          ]}
        >
          <Input />
        </Form.Item> : (selectedCat == "Number" ? <Form.Item
          label="Number"
            name="message"
          rules={[
            {
              required: false,
              message: 'Please input your number!',
            },
          ]}
        >
          <Input />
          </Form.Item> : (selectedCat == "UserProfile" ? <div>
              <Form.Item
                label="Username"
                name="message"
                rules={[
                  {
                    required: false,
                    message: 'Please input your User Profile!',
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Age"
                name="message"
                rules={[
                  {
                    required: false,
                    message: 'Please input your User Profile!',
                  },
                ]}
              >
                <Input />
              </Form.Item>

            
            
            
            </div> : <></>))}

        <Form.Item
          wrapperCol={{
            offset: 4,
            span: 16,
          }}
        >
          <Button type="primary" htmlType="submit">
            Send
          </Button>
        </Form.Item>
      </Form>

    </div>
  )
}

export default SendMessage