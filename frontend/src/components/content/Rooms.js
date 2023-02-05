import React from 'react'
import { Button, Checkbox, Form, Input, Select, message } from 'antd';
import { ValueScope } from 'ajv/dist/compile/codegen';

const Rooms = (props) => {
  const [form1] = Form.useForm();
  const [form2] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const onAdd = (values) => {
    // QA: How are we storing categories in the database? 
      // Should there be a special message sent to clients that there is a new category?

    console.log("trying to add: " + values)
    console.log(values)
    if (!values.roomAdd) {
      messageApi.open({
        type: 'error',
        content: 'Please enter a room name',
      });
    } else if (!values.category) {
      messageApi.open({
        type: 'error',
        content: 'Please select a category',
      });
    } else {
      props.onAdd(values.roomAdd, values.category)
      console.log('adding:', values);
      messageApi.open({
        type: 'success',
        content: 'Added Room ' + values.roomAdd + '!',
      });
      form1.resetFields()
    }
    
  };
  // not doing delete?
  const onDelete = (values) => {
    console.log("trying to delete: " + values)
    if (!values.roomDelete) {
      messageApi.open({
        type: 'error',
        content: 'Please select a room',
      });
    } else {
      console.log('deleting: ', values)
      messageApi.open({
        type: 'success',
        content: 'Deleted room ' + values.roomDelete + '!',
      });
      props.onDelete(values.roomDelete)
      form2.resetFields()
    }
    
  }
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
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

        onFinish={onAdd}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        form={form1}
      >
        <Form.Item
          label="Room"
          name="roomAdd"
          rules={[
            {
              required: false,
              message: 'Please input your group!',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="Category" name="category">
          <Select>
            {/* TODO: map out categories retrieved from database (passed as props from app.js)*/}
            {props.categories.map((cat) =>
              <Select.Option value={cat}>{cat}</Select.Option>
            )}
            {/* <Select.Option value="COMP 410">COMP 410</Select.Option>
            <Select.Option value="IM Basketball">IM Basketball</Select.Option>
            <Select.Option value="Suitemates">Suitemates</Select.Option> */}
          </Select>
        </Form.Item>

        <Form.Item
          wrapperCol={{
            offset: 4,
            span: 16,
          }}
        >
          <Button type="primary" htmlType="submit">
            Add
          </Button>
        </Form.Item>
      </Form>


      
    </div>
  )
}

export default Rooms

// <Form
// name = "basic"
// labelCol = {{
//   span: 4,
//         }}
// wrapperCol = {{
//   span: 16,
//         }}
// style = {{
//   maxWidth: 600,
//         }}

// onFinish = { onDelete }
// onFinishFailed = { onFinishFailed }
// autoComplete = "off"
// form = { form2 }
//   >
//         <Form.Item label="Room" name="roomDelete">
//           <Select>
//             {/* TODO: map out categories retrieved from database (passed as props from app.js)*/}
//             {props.rooms.map((room) => 
//               <Select.Option value={room.roomName}>{room.roomName}</Select.Option>
//             )}
//           </Select>
//         </Form.Item>
//         <Form.Item
//           wrapperCol={{
//             offset: 4,
//             span: 16,
//           }}
//         >
//           <Button type="primary" htmlType="submit">
//             Delete
//           </Button>
//         </Form.Item>
        
//       </Form >