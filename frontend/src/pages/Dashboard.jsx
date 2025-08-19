// src/pages/Dashboard.jsx
import React from 'react';
import { Typography, Layout } from 'antd';

const { Title } = Typography;
const { Content } = Layout;

const Dashboard = () => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Content style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Title level={1}>Dashboard</Title>
      </Content>
    </Layout>
  );
};

export default Dashboard;
