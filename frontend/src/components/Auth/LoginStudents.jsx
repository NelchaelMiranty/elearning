import React from 'react';
import { Form, Input, Button, Checkbox, Card } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

const LoginStudent = () => {
  const onFinish = (values) => {
    console.log('Données soumises:', values);
  };

  return (
    <Card title="Connexion Étudiant" style={{ width: 400, margin: '50px auto' }}>
      <Form onFinish={onFinish}>
        <Form.Item name="matricule" rules={[{ required: true }]}>
          <Input prefix={<UserOutlined />} placeholder="N° Matricule" />
        </Form.Item>
        <Form.Item name="cours" rules={[{ required: true }]}>
          <Input placeholder="ID Cours" />
        </Form.Item>
        <Form.Item name="password" rules={[{ required: true }]}>
          <Input.Password prefix={<LockOutlined />} placeholder="Mot de passe" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Se connecter
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default LoginStudent;